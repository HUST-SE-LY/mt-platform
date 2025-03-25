from flask import Blueprint, request, jsonify, current_app
from models import db, AdImage, Advertisement, AdStatus, ConsumptionRecord, User  # Add User to imports
from models.consumption_record import ConsumptionType
import os
import uuid
from datetime import datetime

ad_bp = Blueprint('advertisement', __name__, url_prefix='/api/ad')

@ad_bp.route('/upload_image', methods=['POST'])
def upload_ad_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    user = request.user
    
    # 从request中获取文件名并检查文件类型
    filename = request.form.get('filename')
    print(filename)
    if not filename or not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
        return jsonify({'error': 'Invalid file type. Only images are allowed'}), 400
    
    try:
        # 生成唯一文件名
        file_ext = os.path.splitext(filename)[1]
        filename = f"{uuid.uuid4().hex}{file_ext}"
        
        # 保存路径
        upload_folder = current_app.config.get('UPLOAD_FOLDER', '/Users/ly/mt-platform/uploads')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        
        # 创建图片记录
        ad_image = AdImage(
            id=str(uuid.uuid4()),
            user_phone=user.phone,
            file_path=file_path
        )
        db.session.add(ad_image)
        db.session.commit()
        
        # 生成公开访问的URL
        base_url = current_app.config.get('BASE_URL', 'http://localhost:5050')
        image_url = f"{base_url}/uploads/{filename}"
        
        return jsonify({
            'image_url': image_url,
            'message': 'Image uploaded successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@ad_bp.route('/create_ad', methods=['POST'])
def create_ad():
    data = request.get_json()
    user = request.user
    
    # 获取广告信息
    title = data.get('title')
    redirect_url = data.get('redirect_url')
    image_url = data.get('img_url')
    click_count = data.get('click_count')
    
    # 检查必填字段
    if not title or not redirect_url or not image_url or not click_count:
        return jsonify({'error': 'Missing required fields'}), 400
    
    cost = click_count * 2
    
    # 检查用户余额
    if user.balance < cost:
        return jsonify({'error': 'Insufficient balance'}), 400
    
    try:
        # 扣除费用
        user.balance -= cost
        
        # 创建广告
        ad = Advertisement(
            id=str(uuid.uuid4()),
            title=title,
            redirect_url=redirect_url,
            user_phone=user.phone,
            remaining_clicks=click_count,
            total_spent=0,
            status=AdStatus.UNDER_REVIEW,
            image_url=image_url
        )
        db.session.add(ad)
        
        # 创建消费记录
        consumption_record = ConsumptionRecord(
            id=str(uuid.uuid4()),
            user_phone=user.phone,
            ad_id=ad.id,
            amount=cost,
            click_count=click_count,
            consumption_type=ConsumptionType.NEW_AD
        )
        db.session.add(consumption_record)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Ad created successfully, waiting for review',
            'ad_id': ad.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@ad_bp.route('/list', methods=['GET'])
def list_ads():
    user = request.user
    
    try:
        # 查询该用户的所有广告
        ads = Advertisement.query.filter_by(user_phone=user.phone).all()
        
        # 构建返回数据
        ads_data = []
        for ad in ads:
            ads_data.append({
                'id': ad.id,
                'title': ad.title,
                'redirect_url': ad.redirect_url,
                'image_url': ad.image_url,
                'remaining_clicks': ad.remaining_clicks,
                'total_spent': ad.total_spent,
                'status': ad.status.value,
                'created_at': ad.created_at.isoformat(),
                'updated_at': ad.updated_at.isoformat()
            })
        
        return jsonify({
            'ads': ads_data,
            'message': 'Ads retrieved successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ad_bp.route('/delete/<ad_id>', methods=['DELETE'])
def delete_ad(ad_id):
    user = request.user
    
    try:
        # 查询广告
        ad = Advertisement.query.filter_by(id=ad_id, user_phone=user.phone).first()
        
        # 检查广告是否存在
        if not ad:
            return jsonify({'error': 'Ad not found or not owned by user'}), 404
        
        # 删除关联的消费记录
        ConsumptionRecord.query.filter_by(ad_id=ad_id).delete()
        
        # 删除广告
        db.session.delete(ad)
        db.session.commit()
        
        return jsonify({
            'message': 'Ad deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@ad_bp.route('/consumption_records', methods=['GET'])
def get_consumption_records():
    user = request.user
    
    try:
        # 查询该用户的所有消费记录
        records = ConsumptionRecord.query.filter_by(user_phone=user.phone).all()
        
        # 构建返回数据
        records_data = []
        for record in records:
            # 获取对应的广告标题
            ad = Advertisement.query.filter_by(id=record.ad_id).first()
            ad_title = ad.title if ad else '未知广告'
            
            records_data.append({
                'id': record.id,
                'ad_id': record.ad_id,
                'ad_title': ad_title,
                'amount': record.amount,
                'click_count': record.click_count,
                'consumption_type': record.consumption_type.value,
                'created_at': record.consumption_time.isoformat()
            })
        
        return jsonify({
            'records': records_data,
            'message': 'Consumption records retrieved successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ad_bp.route('/pending_ads', methods=['GET'])
def get_pending_ads():
    try:
        # 查询所有待审核的广告
        ads = Advertisement.query.filter_by(status=AdStatus.UNDER_REVIEW).all()
        
        # 构建返回数据
        ads_data = []
        for ad in ads:
            user = User.query.filter_by(phone=ad.user_phone).first()
            ads_data.append({
                'id': ad.id,
                'title': ad.title,
                'redirect_url': ad.redirect_url,
                'image_url': ad.image_url,
                'user_name': user.username if user else '未知用户',
                'company_name': user.company_name if user else '未知企业'
            })
        
        return jsonify({
            'ads': ads_data,
            'message': 'Pending ads retrieved successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ad_bp.route('/audit_ad/<ad_id>', methods=['POST'])
def audit_ad(ad_id):
    data = request.get_json()
    action = data.get('action')  # 'approve' or 'reject'
    
    try:
        # 查询广告
        ad = Advertisement.query.filter_by(id=ad_id).first()
        
        if not ad:
            return jsonify({'error': 'Ad not found'}), 404
            
        # 更新广告状态
        if action == 'approve':
            ad.status = AdStatus.ACTIVE
        elif action == 'reject':
            ad.status = AdStatus.REJECTED
        else:
            return jsonify({'error': 'Invalid action'}), 400
            
        db.session.commit()
        
        return jsonify({
            'message': f'Ad {action}d successfully',
            'new_status': ad.status.value
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@ad_bp.route('/pause_ad/<ad_id>', methods=['POST'])
def pause_ad(ad_id):
    try:
        # 查询广告
        ad = Advertisement.query.filter_by(id=ad_id).first()
        
        if not ad:
            return jsonify({'error': 'Ad not found'}), 404
            
        # 更新广告状态
        ad.status = AdStatus.PAUSED
        db.session.commit()
        
        return jsonify({
            'message': 'Ad paused successfully',
            'new_status': ad.status.value
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@ad_bp.route('/resume_ad/<ad_id>', methods=['POST'])
def resume_ad(ad_id):
    try:
        # 查询广告
        ad = Advertisement.query.filter_by(id=ad_id).first()
        
        if not ad:
            return jsonify({'error': 'Ad not found'}), 404
            
        # 更新广告状态
        ad.status = AdStatus.ACTIVE
        db.session.commit()
        
        return jsonify({
            'message': 'Ad resumed successfully',
            'new_status': ad.status.value
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@ad_bp.route('/recharge_ad/<ad_id>', methods=['POST'])
def recharge_ad(ad_id):
    data = request.get_json()
    amount = data.get('amount')
    
    try:
        # 查询广告
        ad = Advertisement.query.filter_by(id=ad_id).first()
        
        if not ad:
            return jsonify({'error': 'Ad not found'}), 404
            
        # 验证充值金额
        if not isinstance(amount, (int, float)) or amount <= 0:
            return jsonify({'error': 'Invalid amount, must be a positive number'}), 400
            
        # 计算增加的点击次数
        click_count = int(amount / 2)
        ad.remaining_clicks += click_count
        
        # 创建消费记录
        consumption_record = ConsumptionRecord(
            id=str(uuid.uuid4()),
            user_phone=ad.user_phone,
            ad_id=ad.id,
            amount=amount,
            click_count=click_count,
            consumption_type=ConsumptionType.RECHARGE
        )
        db.session.add(consumption_record)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Ad recharged successfully',
            'new_remaining_clicks': ad.remaining_clicks,
            'new_total_spent': ad.total_spent
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@ad_bp.route('/random_ad', methods=['GET'])
def get_random_ad():
    try:
        # 查询所有正常展示的广告
        active_ads = Advertisement.query.filter_by(status=AdStatus.ACTIVE).all()
        
        if not active_ads:
            return jsonify({'error': 'No active ads available'}), 404
            
        # 随机选择一个广告
        import random
        ad = random.choice(active_ads)
        
        # 构建返回数据
        ad_data = {
            'id': ad.id,
            'title': ad.title,
            'redirect_url': ad.redirect_url,
            'image_url': ad.image_url
        }
        
        # 更新广告剩余点击次数
        ad.remaining_clicks -= 1
        if ad.remaining_clicks <= 0:
            ad.status = AdStatus.PAUSED
            
        db.session.commit()
        
        return jsonify({
            'ad': ad_data,
            'message': 'Random ad retrieved successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@ad_bp.route('/click_ad/<ad_id>', methods=['POST'])
def click_ad(ad_id):
    try:
        # 查询广告
        ad = Advertisement.query.filter_by(id=ad_id).first()
        
        if not ad:
            return jsonify({'error': 'Ad not found'}), 404
            
        # 检查广告状态
        if ad.status != AdStatus.ACTIVE:
            return jsonify({'error': 'Ad is not active'}), 400
            
        # 检查剩余点击次数
        if ad.remaining_clicks <= 0:
            return jsonify({'error': 'No remaining clicks'}), 400
            
        # 更新广告数据
        ad.remaining_clicks -= 1
        ad.total_spent += 2  # 每次点击增加2元消费
        
        # 如果点击次数用完，暂停广告
        if ad.remaining_clicks <= 0:
            ad.status = AdStatus.PAUSED
            
        db.session.commit()
        
        return jsonify({
            'message': 'Ad click recorded successfully',
            'new_remaining_clicks': ad.remaining_clicks,
            'new_total_spent': ad.total_spent
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500