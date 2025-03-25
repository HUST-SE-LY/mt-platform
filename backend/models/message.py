from . import db
from datetime import datetime

class Message(db.Model):
    __tablename__ = 'messages'
    
    # 主键
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # 消息标题
    title = db.Column(db.String(100), nullable=False)
    
    # 消息内容
    text = db.Column(db.Text, nullable=False)
    
    # 跳转URL
    target = db.Column(db.String(200), nullable=True)
    
    # 消息日期
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # 所属用户（外键）
    user_phone = db.Column(db.String(20), db.ForeignKey('users.phone'), nullable=False)
    
    # 是否已读
    is_read = db.Column(db.Boolean, nullable=False, default=False)
    
    # 添加与 User 的关系
    user = db.relationship('User', backref='messages')