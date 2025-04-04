from . import db
from datetime import datetime

class Company(db.Model):
    __tablename__ = 'companies'

    id = db.Column(db.String(36), primary_key=True)  # 公司ID
    name = db.Column(db.String(120), nullable=False)  # 公司名称
    org_code = db.Column(db.String(50), unique=True, nullable=False)  # 机构代码
    address = db.Column(db.String(255), nullable=False)  # 公司地址
    contact_person = db.Column(db.String(50), nullable=False)  # 联系人
    contact_phone = db.Column(db.String(20), nullable=False)  # 联系方式
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # 创建时间
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间

    def __repr__(self):
        return f'<Company {self.id}>'