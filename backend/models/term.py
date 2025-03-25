from . import db
from datetime import datetime

class Term(db.Model):
    __tablename__ = 'terms'

    id = db.Column(db.String(36), primary_key=True)  # 术语ID
    source_term = db.Column(db.String(255), nullable=False)  # 源语言术语
    target_term = db.Column(db.String(255), nullable=False)  # 目标语言术语
    description = db.Column(db.Text, nullable=True)  # 附加说明
    termbase_id = db.Column(db.String(36), db.ForeignKey('termbases.id'), nullable=False)  # 所属术语库ID
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # 创建时间
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间

    def __repr__(self):
        return f'<Term {self.id}>'