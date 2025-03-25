from enum import Enum
from datetime import datetime
from models import db

class AdStatus(Enum):
    ACTIVE = 'active'  # 正常展示
    PAUSED = 'paused'  # 暂停展示
    UNDER_REVIEW = 'under_review'  # 审核中
    REJECTED = 'rejected'  # 审核不通过

class Advertisement(db.Model):
    __tablename__ = 'advertisements'

    id = db.Column(db.String(36), primary_key=True)  # 广告ID
    title = db.Column(db.String(255), nullable=False)  # 广告标题
    redirect_url = db.Column(db.String(512), nullable=False)  # 广告跳转链接
    user_phone = db.Column(db.String(20), db.ForeignKey('users.phone'), nullable=False)  # 广告所属用户
    remaining_clicks = db.Column(db.Integer, default=0)  # 剩余点击次数
    total_spent = db.Column(db.Float, default=0.0)  # 累计消费
    status = db.Column(db.Enum(AdStatus), default=AdStatus.UNDER_REVIEW)  # 当前状态
    image_url = db.Column(db.String(512))  # 广告图片URL
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # 创建时间
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间

    def __repr__(self):
        return f'<Advertisement {self.id}>'