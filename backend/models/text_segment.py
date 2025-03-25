from datetime import datetime
from . import db

class TextSegment(db.Model):
    """文本段模型类，用于存储文档的分段翻译结果"""
    __tablename__ = 'text_segments'
    
    id = db.Column(db.String(36), primary_key=True)
    original_text = db.Column(db.Text, nullable=False)
    translated_text = db.Column(db.Text)
    document_id = db.Column(db.String(36), db.ForeignKey('documents.id'), nullable=False)
    sequence = db.Column(db.Integer, nullable=False)  # 新增字段，用于记录顺序
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, id, original_text, document_id, sequence, translated_text=None):
        self.id = id
        self.original_text = original_text
        self.document_id = document_id
        self.sequence = sequence  # 初始化顺序字段
        self.translated_text = translated_text

    def to_dict(self):
        """将模型对象转换为字典"""
        return {
            'id': self.id,
            'original_text': self.original_text,
            'translated_text': self.translated_text,
            'document_id': self.document_id,
            'sequence': self.sequence,  # 添加顺序字段到字典
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }