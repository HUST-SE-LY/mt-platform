from flask import Blueprint, request, jsonify
from models import TranslationMemory, db  # 修改为绝对导入
from datetime import datetime
import uuid

translation_memory_bp = Blueprint('translation_memory', __name__, url_prefix='/api/translation_memory')

@translation_memory_bp.route('/', methods=['POST'])
def create_translation_memory():
    data = request.get_json()
    
    # 验证必填字段
    required_fields = ['name', 'source_lang', 'target_lang']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        # 创建新的记忆库
        new_memory = TranslationMemory(
            id=str(uuid.uuid4()),
            name=data['name'],
            source_lang=data['source_lang'],
            target_lang=data['target_lang'],
            tags=data.get('tags', [])
        )
        
        db.session.add(new_memory)
        db.session.commit()
        
        return jsonify({
            'message': 'Translation memory created successfully',
            'id': new_memory.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500