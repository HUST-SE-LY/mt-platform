from flask import Blueprint, request, jsonify
from flask import make_response
from passlib.hash import pbkdf2_sha256
from models import db, User, Company  # 添加 Company 导入
from models.user import USER_TYPE_MAPPING, UserType  # 添加 UserType 导入
from flask import current_app
from models.document import Document
import time
import re

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 获取前端数据
    username = data.get('username')
    password = data.get('password')
    phone = data.get('phone')
    email = data.get('email', None)
    user_type = data.get('user_type')
    company_code = data.get('company_code', None)  # 修改这里，从company_name改为company_code

    # 验证用户类型
    if user_type not in USER_TYPE_MAPPING:
        return jsonify({'error': 'Invalid user type'}), 400
    
    # 检查必填字段
    if not username or not password or not phone or user_type is None:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # 检查用户是否已存在
    if User.query.filter_by(phone=phone).first():
        return jsonify({'error': 'User already exists'}), 400
    
    # 如果是企业用户或广告客户，需要验证公司代码
    if USER_TYPE_MAPPING[user_type] in [UserType.Enterprise, UserType.Advertiser]:
        if not company_code:
            return jsonify({'error': '企业用户或广告客户必须提供公司代码'}), 400
        
        # 验证公司代码格式
        if not re.match(r'^\d{6}$', company_code):
            return jsonify({'error': '公司代码必须是6位数字'}), 400
        
        # 检查公司是否存在
        company = Company.query.filter_by(org_code=company_code).first()
        if not company:
            return jsonify({'error': '公司代码不存在，请先注册公司'}), 400
        
        company_id = company.id
    else:
        company_id = None
    
    # 创建新用户
    new_user = User(
        phone=phone,
        username=username,
        password=pbkdf2_sha256.hash(password),
        balance=0.0,
        email=email,
        company_id=company_id,  # 使用公司ID而不是公司名称
        user_type=USER_TYPE_MAPPING[user_type]
    )
    
    # 保存到数据库
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    phone = data.get('phone')
    password = data.get('password')
    user_type = data.get('user_type')

    # 检查必填字段
    if not phone or not password or user_type is None:
        return jsonify({'error': 'Missing phone, password or user type'}), 400

    # 查询用户
    user = User.query.filter_by(phone=phone).first()
    if not user:
        return jsonify({'error': 'Invalid phone or password'}), 401

    # 验证用户类型
    if user.user_type != USER_TYPE_MAPPING.get(user_type):
        return jsonify({'error': 'User type does not match'}), 403

    # 特殊处理管理员用户
    if user.user_type == UserType.Admin:
        if password != user.password:
            return jsonify({'error': 'Invalid phone or password'}), 401
    else:
        if not pbkdf2_sha256.verify(password, user.password):
            return jsonify({'error': 'Invalid phone or password'}), 401

    # 获取公司名称（如果有关联公司）
    company_name = None
    if user.company_id:
        company = Company.query.get(user.company_id)
        if company:
            company_name = company.name

    # 创建响应
    response = make_response(jsonify({
        'phone': user.phone,
        'username': user.username,
        'balance': user.balance,
        'unread_message_count': user.unread_message_count,
        'email': user.email,
        'company_name': company_name,  # 使用从公司表中获取的名称
        'user_type': user.user_type.name
    }))

    # 生成安全token
    token = current_app.token_serializer.dumps({
        'user_id': user.phone,
        'timestamp': int(time.time())
    })

    # 设置cookie
    response.set_cookie('auth_token', token, max_age=3600*24*7, samesite='None', secure=True)
    return response

@user_bp.route('/auto_login', methods=['GET'])
def auto_login():
    # 中间件已经验证了cookie并将用户信息附加到request对象
    user = request.user
    
    # 获取公司名称（如果有关联公司）
    company_name = None
    if user.company_id:
        company = Company.query.get(user.company_id)
        if company:
            company_name = company.name
    
    # 返回用户信息
    return jsonify({
        'phone': user.phone,
        'username': user.username,
        'balance': user.balance,
        'unread_message_count': user.unread_message_count,
        'email': user.email,
        'company_name': company_name,  # 使用从公司表中获取的名称
        'user_type': user.user_type.name
    }), 200

@user_bp.route('/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    
    # 从中间件获取用户信息
    user = request.user
    
    password = data.get('password')
    
    # 检查必填字段
    if not password :
        return jsonify({'error': 'Missing required fields'}), 400
    
    # 更新密码
    user.password = pbkdf2_sha256.hash(password)
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'}), 200

@user_bp.route('/update_profile', methods=['POST'])
def update_profile():
    data = request.get_json()
    
    # 从中间件获取用户信息
    user = request.user
    
    # 获取请求数据
    username = data.get('username')
    email = data.get('email')
    
    # 检查至少有一个字段需要更新
    if username is None and email is None:
        return jsonify({'error': 'No fields to update'}), 400
    
    # 更新用户名
    if username is not None:
        user.username = username
    
    # 更新邮箱
    if email is not None:
        user.email = email
    
    # 保存到数据库
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'username': user.username,
        'email': user.email
    }), 200

@user_bp.route('/recharge', methods=['POST'])
def recharge():
    data = request.get_json()
    
    # 从中间件获取用户信息
    user = request.user
    
    # 获取充值金额
    amount = data.get('amount')
    
    # 检查必填字段
    if amount is None:
        return jsonify({'error': 'Missing amount'}), 400
    
    # 验证充值金额
    if not isinstance(amount, (int, float)) or amount <= 0:
        return jsonify({'error': 'Invalid amount, must be a positive number'}), 400
    
    # 更新用户余额
    user.balance += amount
    db.session.commit()
    
    return jsonify({
        'message': 'Recharge successful',
        'new_balance': user.balance
    }), 200

@user_bp.route('/messages', methods=['GET'])
def get_messages():
    # 从中间件获取用户信息
    user = request.user
    
    # 查询该用户的所有消息
    messages = Message.query.filter_by(user_phone=user.phone).order_by(Message.date.desc()).all()
    
    # 格式化返回数据
    messages_data = [{
        'id': msg.id,
        'title': msg.title,
        'text': msg.text,
        'target': msg.target,
        'date': msg.date.isoformat(),
        'isRead': msg.is_read
    } for msg in messages]
    
    return jsonify(messages_data), 200

@user_bp.route('/mark_message_as_read', methods=['POST'])
def mark_message_as_read():
    data = request.get_json()
    
    # 从中间件获取用户信息
    user = request.user
    
    # 获取消息ID
    message_id = data.get('message_id')
    
    # 检查必填字段
    if not message_id:
        return jsonify({'error': 'Missing message_id'}), 400
    
    # 查询消息
    message = Message.query.filter_by(id=message_id, user_phone=user.phone).first()
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    # 如果消息已经是已读状态，直接返回成功
    if message.is_read:
        return jsonify({'message': 'Message already marked as read'}), 200
    
    # 标记消息为已读
    message.is_read = True
    db.session.commit()
    
    return jsonify({'message': 'Message marked as read successfully'}), 200

@user_bp.route('/delete_message', methods=['POST'])
def delete_message():
    data = request.get_json()
    
    # 从中间件获取用户信息
    user = request.user
    
    # 获取消息ID
    message_id = data.get('message_id')
    
    # 检查必填字段
    if not message_id:
        return jsonify({'error': 'Missing message_id'}), 400
    
    # 查询消息
    message = Message.query.filter_by(id=message_id, user_phone=user.phone).first()
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    # 删除消息
    db.session.delete(message)
    db.session.commit()
    
    return jsonify({'message': 'Message deleted successfully'}), 200

@user_bp.route('/documents', methods=['GET'])
def get_user_documents():
    # 从中间件获取用户信息
    user = request.user
    
    try:
        # 查询用户的所有文档，按上传时间倒序排列
        documents = Document.query.filter_by(user_phone=user.phone)\
            .order_by(Document.upload_time.desc())\
            .all()
        
        # 转换为字典格式
        documents_data = [{
            'id': doc.id,
            'file_name': doc.file_name,
            'upload_time': doc.upload_time.isoformat(),
            'file_size': doc.file_size,
            'is_translating': doc.is_translating
        } for doc in documents]
        
        return jsonify({
            'documents': documents_data,
            'count': len(documents_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/logout', methods=['POST'])
def logout():
    # 创建一个响应对象
    response = make_response(jsonify({'message': 'Logged out successfully'}))
    
    # 设置一个过期的cookie来清除登录状态
    response.set_cookie('auth_token', '', expires=0, max_age=0, samesite='None', secure=True)
    
    return response
