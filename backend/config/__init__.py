from flask_sqlalchemy import SQLAlchemy

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:1596087252ly%40@localhost/mt-platform'  # 如果密码包含@
    SQLALCHEMY_TRACK_MODIFICATIONS = False