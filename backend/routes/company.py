from flask import Blueprint, request, jsonify
from models import Company, db
import uuid
import re

company_bp = Blueprint('company', __name__, url_prefix='/api/company')

@company_bp.route('/register', methods=['POST'])
def register_company():
    data = request.get_json()
    
    # 验证必填字段
    required_fields = ['name', 'org_code', 'address', 'contact_person', 'contact_phone']
    if not all(field in data for field in required_fields):
        return jsonify({'error': '缺少必填字段'}), 400
    
    # 验证机构代码格式（六位数字）
    if not re.match(r'^\d{6}$', data['org_code']):
        return jsonify({'error': '机构代码必须是6位数字'}), 400
    
    try:
        # 检查机构代码是否已存在
        if Company.query.filter_by(org_code=data['org_code']).first():
            return jsonify({'error': '该机构代码已被注册'}), 400
            
        # 创建新公司
        new_company = Company(
            id=str(uuid.uuid4()),
            name=data['name'],
            org_code=data['org_code'],
            address=data['address'],
            contact_person=data['contact_person'],
            contact_phone=data['contact_phone']
        )
        
        db.session.add(new_company)
        db.session.commit()
        
        return jsonify({
            'message': '公司注册成功',
            'company_id': new_company.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

company = company_bp