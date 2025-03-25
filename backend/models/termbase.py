from . import db
from datetime import datetime

class Termbase(db.Model):
    __tablename__ = 'termbases'

    id = db.Column(db.String(36), primary_key=True)  # 术语库ID
    name = db.Column(db.String(255), nullable=False)  # 术语库名称
    source_lang = db.Column(db.String(10), nullable=False)  # 源语言
    target_lang = db.Column(db.String(10), nullable=False)  # 目标语言
    tags = db.Column(db.JSON, default=list)  # 使用 JSON 类型存储标签
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # 创建时间
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间

    def __repr__(self):
        return f'<Termbase {self.id}>'