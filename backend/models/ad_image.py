from datetime import datetime
from models import db

class AdImage(db.Model):
    __tablename__ = 'ad_images'

    id = db.Column(db.String(36), primary_key=True)  # 图片ID
    user_phone = db.Column(db.String(20), db.ForeignKey('users.phone'), nullable=False)  # 对应用户
    file_path = db.Column(db.String(512), nullable=False)  # 图片在服务器中的路径
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # 创建时间

    def __repr__(self):
        return f'<AdImage {self.id}>'