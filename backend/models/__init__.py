from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# 在db定义之后导入模型
from .user import User, UserType
from .message import Message
from .document import Document, ProjectDocument
from .text_segment import TextSegment
from .advertisement import Advertisement
from .consumption_record import ConsumptionRecord
from .ad_image import AdImage
from .advertisement import AdStatus
from .translation_memory import TranslationMemory, TranslationMemoryEntry
from .translation_unit import TranslationUnit
from .termbase import Termbase
from .term import Term
from .company import Company
from .project import Project, ProjectMemoryLink, ProjectTermbaseLink
from .segment import DocumentSegment

# 导出所有模型
__all__ = [
    'db',
    'User',
    'UserType',
    'Company',
    'Document',
    'ProjectDocument',
    'DocumentSegment',
    'Message',
    'TextSegment',
    'Advertisement',
    'ConsumptionRecord',
    'AdImage',
    'AdStatus',
    'TranslationMemory',
    'TranslationMemoryEntry',
    'TranslationUnit',
    'Termbase',
    'Term',
    'Project',
    'ProjectMemoryLink',
    'ProjectTermbaseLink'
]