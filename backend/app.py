from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from flask_migrate import Migrate
from routes.user import user_bp
from itsdangerous import URLSafeTimedSerializer
from middleware.auth import auth_middleware
from routes.translation import translation_bp
from dotenv import load_dotenv
import os
from services.translation import DeepSeekTranslator
from routes.document import document_bp
from routes.advertisement import ad_bp
from routes.translation_memory import translation_memory_bp

# 加载环境变量
load_dotenv()

app = Flask(__name__)

# 在应用上下文中初始化翻译器
def init_translator():
    app.translator = DeepSeekTranslator()

# 在应用启动时初始化
init_translator()

app.config['SECRET_KEY'] = 'mt-platform'  # 请替换为强随机字符串
app.token_serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# 配置上传文件夹
app.config['UPLOAD_FOLDER'] = '/Users/ly/mt-platform/uploads'

# 更详细的CORS配置
CORS(app, supports_credentials=True, origins=["http://localhost:8080"])

# 添加静态文件路由
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    from flask import send_from_directory
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# 加载配置
app.config.from_object(Config)

# 初始化数据库
db.init_app(app)
migrate = Migrate(app, db)

with app.app_context():
    from models.user import User
    User.create_default_admin()

# Register middleware
@app.before_request
def before_request():
    return auth_middleware()

# 注册蓝图
app.register_blueprint(user_bp)
app.register_blueprint(translation_bp)
app.register_blueprint(document_bp)
app.register_blueprint(ad_bp)
app.register_blueprint(translation_memory_bp)

if __name__ == '__main__':
    app.run(port=5050, debug=True)
