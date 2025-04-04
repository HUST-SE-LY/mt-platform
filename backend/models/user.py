from . import db
from sqlalchemy import Enum, select, func
from enum import Enum as PyEnum
from .message import Message
from sqlalchemy.orm import column_property
from sqlalchemy import select, func

# 定义用户类型枚举
class UserType(PyEnum):
    Normal = 'Normal'
    Advertiser = 'Advertiser'
    Pro = 'Pro'
    Enterprise = 'Enterprise'
    Admin = 'Admin'

# 添加一个映射字典用于前端传值
USER_TYPE_MAPPING = {
    'Normal': UserType.Normal,
    'Advertiser': UserType.Advertiser,
    'Pro': UserType.Pro,
    'Enterprise': UserType.Enterprise,
    'Admin': UserType.Admin
}

class User(db.Model):
    __tablename__ = 'users'
    
    phone = db.Column(db.String(20), primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    balance = db.Column(db.Float, nullable=False, default=0.0)
    
    unread_message_count = column_property(
        select(func.count(Message.id))
        .where(Message.user_phone == phone)
        .where(Message.is_read == False)
        .scalar_subquery()
    )
    
    email = db.Column(db.String(120), nullable=True)
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id'), nullable=True)  # 新增公司关联
    company = db.relationship('Company', backref='users')  # 新增关系
    
    user_type = db.Column(Enum(UserType), nullable=False, default=UserType.Normal)
    
    @classmethod
    def create_default_admin(cls):
        # 检查是否已存在管理员用户
        admin = cls.query.filter_by(phone='admin').first()
        if not admin:
            # 创建默认管理员用户
            admin = cls(
                phone='admin',
                username='admin',
                password='123456',  # 注意：实际应用中应使用加密后的密码
                balance=0.0,
                user_type=UserType.Admin
            )
            db.session.add(admin)
            db.session.commit()
            return True
        return False