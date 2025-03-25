from flask import request, jsonify
import time
from flask import current_app
from models import User

def auth_middleware():
    # 排除登录和注册接口
    print(request.path)
    if request.path in ['/api/user/login', '/api/user/register']:
        return None

    # 获取cookie
    token = request.cookies.get('auth_token')
    print(token)
    if not token:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        # 验证token
        data = current_app.token_serializer.loads(token, max_age=3600*24*7)
        print(data)
        user_id = data['user_id']
        timestamp = data['timestamp']

        # 查询用户
        user = User.query.filter_by(phone=user_id).first()
        print(user)
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401

        # 将用户信息附加到请求上下文中
        request.user = user
        return None

    except Exception as e:
        return jsonify({'error': 'Invalid token'}), 401