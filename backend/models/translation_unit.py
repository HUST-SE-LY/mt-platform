from . import db
from datetime import datetime

class TranslationUnit(db.Model):
    __tablename__ = 'translation_units'

    id = db.Column(db.String(36), primary_key=True)  # 记忆对ID
    source_text = db.Column(db.Text, nullable=False)  # 源语言文本
    target_text = db.Column(db.Text, nullable=False)  # 目标语言文本
    memory_id = db.Column(db.String(36), db.ForeignKey('translation_memories.id'), nullable=False)  # 所属记忆库ID
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # 创建时间
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间

    def __repr__(self):
        return f'<TranslationUnit {self.id}>'