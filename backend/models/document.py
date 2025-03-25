from datetime import datetime
from . import db

class Document(db.Model):
    """文档模型类，用于存储用户上传的文档信息"""
    __tablename__ = 'documents'
    
    id = db.Column(db.String(36), primary_key=True)
    file_name = db.Column(db.String(255), nullable=False)
    upload_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    file_size = db.Column(db.BigInteger, nullable=False)
    storage_path = db.Column(db.String(512), nullable=False)
    user_phone = db.Column(db.String(20), db.ForeignKey('users.phone'), nullable=False)
    is_translating = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, id, file_name, file_size, storage_path, user_phone, is_translating=False):
        self.id = id
        self.file_name = file_name
        self.file_size = file_size
        self.storage_path = storage_path
        self.user_phone = user_phone
        self.is_translating = is_translating

    def to_dict(self):
        """将模型对象转换为字典"""
        return {
            'id': self.id,
            'file_name': self.file_name,
            'upload_time': self.upload_time.isoformat(),
            'file_size': self.file_size,
            'storage_path': self.storage_path,
            'user_phone': self.user_phone,
            'is_translating': self.is_translating
        }