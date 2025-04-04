from . import db
from datetime import datetime
import uuid

class DocumentSegment(db.Model):
    """文档文本段表"""
    __tablename__ = 'document_segments'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = db.Column(db.String(36), db.ForeignKey('project_documents.id'), nullable=False)  # 关联的文档
    source_text = db.Column(db.Text, nullable=False)  # 原文
    target_text = db.Column(db.Text)  # 译文
    sequence = db.Column(db.Integer, nullable=False)  # 段落序号
    status = db.Column(db.String(20), default='pending')  # 状态：pending/translating/completed/error/reviewed/confirmed
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    # 关联关系
    document = db.relationship('ProjectDocument', backref=db.backref('segments', lazy=True, order_by='DocumentSegment.sequence')) 