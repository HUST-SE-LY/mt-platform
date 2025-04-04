from . import db
from datetime import datetime
import uuid

class TranslationMemory(db.Model):
    __tablename__ = 'translation_memories'

    id = db.Column(db.String(36), primary_key=True)  # 记忆库ID
    name = db.Column(db.String(100), nullable=False, unique=True)  # 记忆库名称
    source_lang = db.Column(db.String(10), nullable=False)  # 源语言
    target_lang = db.Column(db.String(10), nullable=False)  # 目标语言
    tags = db.Column(db.JSON, default=list)  # 使用 JSON 类型存储标签
    created_at = db.Column(db.DateTime, default=datetime.now)  # 创建时间
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间
    user_id = db.Column(db.String(20), db.ForeignKey('users.phone'), nullable=True)

    # 关系
    entries = db.relationship('TranslationMemoryEntry', backref='memory', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<TranslationMemory {self.id}>'

class TranslationMemoryEntry(db.Model):
    __tablename__ = 'translation_memory_entries'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    memory_id = db.Column(db.String(36), db.ForeignKey('translation_memories.id'), nullable=False)
    source_text = db.Column(db.Text, nullable=False)
    target_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    # 可以添加其他字段，如创建者、最后修改时间等