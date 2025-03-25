from enum import Enum
from datetime import datetime
from models import db

class ConsumptionType(Enum):
    NEW_AD = 'new_ad'  # 投放新广告
    RECHARGE = 'recharge'  # 为旧广告充值

class ConsumptionRecord(db.Model):
    __tablename__ = 'consumption_records'

    id = db.Column(db.String(36), primary_key=True)  # 消费记录ID
    user_phone = db.Column(db.String(20), db.ForeignKey('users.phone'), nullable=False)  # 对应用户
    ad_id = db.Column(db.String(36), db.ForeignKey('advertisements.id'), nullable=False)  # 对应广告
    amount = db.Column(db.Float, nullable=False)  # 消费金额
    consumption_time = db.Column(db.DateTime, default=datetime.utcnow)  # 消费时间
    click_count = db.Column(db.Integer, nullable=False)  # 本次消费投放的次数
    consumption_type = db.Column(db.Enum(ConsumptionType), nullable=False)  # 消费类型

    def __repr__(self):
        return f'<ConsumptionRecord {self.id}>'