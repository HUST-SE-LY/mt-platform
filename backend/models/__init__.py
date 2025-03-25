from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# 在db定义之后导入模型
from .user import User
from .message import Message
from .document import Document
from .text_segment import TextSegment
from .advertisement import Advertisement
from .consumption_record import ConsumptionRecord
from .ad_image import AdImage
from .advertisement import AdStatus
from .translation_memory import TranslationMemory
from .translation_unit import TranslationUnit
from .termbase import Termbase
from .term import Term