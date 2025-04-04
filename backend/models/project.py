from . import db
from datetime import datetime
import uuid

class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)  # 项目名称
    source_lang = db.Column(db.String(10), nullable=False)  # 源语言
    target_lang = db.Column(db.String(10), nullable=False)  # 目标语言
    description = db.Column(db.Text)  # 备注
    created_at = db.Column(db.DateTime, default=datetime.now)  # 创建时间
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)  # 更新时间
    user_id = db.Column(db.String(20), db.ForeignKey('users.phone'), nullable=True)  # 创建者

    # 关联关系
    creator = db.relationship('User', backref=db.backref('projects', lazy=True))
    memory_links = db.relationship('ProjectMemoryLink', backref='project', lazy=True, cascade='all, delete-orphan')
    termbase_links = db.relationship('ProjectTermbaseLink', backref='project', lazy=True, cascade='all, delete-orphan')

class ProjectMemoryLink(db.Model):
    __tablename__ = 'project_memory_links'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'), nullable=False)
    memory_id = db.Column(db.String(36), db.ForeignKey('translation_memories.id'), nullable=False)
    priority = db.Column(db.Integer, nullable=False)  # 优先级，数字越小优先级越高
    created_at = db.Column(db.DateTime, default=datetime.now)

    # 添加与记忆库的关联关系
    memory = db.relationship('TranslationMemory', backref=db.backref('project_links', lazy=True))

class ProjectTermbaseLink(db.Model):
    __tablename__ = 'project_termbase_links'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'), nullable=False)
    termbase_id = db.Column(db.String(36), db.ForeignKey('termbases.id'), nullable=False)
    priority = db.Column(db.Integer, nullable=False)  # 优先级，数字越小优先级越高
    created_at = db.Column(db.DateTime, default=datetime.now)

    # 添加与术语库的关联关系
    termbase = db.relationship('Termbase', backref=db.backref('project_links', lazy=True)) 