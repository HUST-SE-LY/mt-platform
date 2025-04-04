from flask import Blueprint, request, jsonify, send_file
from models import TranslationMemory, TranslationMemoryEntry, db  # 从models导入
from datetime import datetime
import uuid
from sqlalchemy import func
from werkzeug.utils import secure_filename
import os
from utils.tmx import generate_tmx, parse_tmx

translation_memory_bp = Blueprint('translation_memory', __name__, url_prefix='/api/translation_memory')

@translation_memory_bp.route('/', methods=['GET'])
def get_translation_memories():
    """获取所有翻译记忆库"""
    try:
        # 查询所有记忆库
        memories = TranslationMemory.query.all()
        
        # 对每个记忆库，计算条目数量
        result = []
        for memory in memories:
            # 计算该记忆库的条目数量
            entry_count = TranslationMemoryEntry.query.filter_by(memory_id=memory.id).count()
            
            # 构建返回数据
            memory_data = {
                'id': memory.id,
                'name': memory.name,
                'source_lang': memory.source_lang,
                'target_lang': memory.target_lang,
                'tags': memory.tags,
                'entry_count': entry_count,
                'created_at': memory.created_at.isoformat() if hasattr(memory, 'created_at') else None
            }
            result.append(memory_data)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@translation_memory_bp.route('/', methods=['POST'])
def create_translation_memory():
    """创建新的翻译记忆库"""
    data = request.get_json()
    
    # 验证必填字段
    required_fields = ['name', 'source_lang', 'target_lang']
    if not all(field in data for field in required_fields):
        return jsonify({'error': '缺少必填字段'}), 400
    
    # 验证源语言和目标语言不能相同
    if data['source_lang'] == data['target_lang']:
        return jsonify({'error': '源语言和目标语言不能相同'}), 400
    
    # 验证记忆库名称是否已存在
    if TranslationMemory.query.filter_by(name=data['name']).first():
        return jsonify({'error': '记忆库名称已存在'}), 400
    
    try:
        # 创建新的记忆库
        new_memory = TranslationMemory(
            id=str(uuid.uuid4()),
            name=data['name'],
            source_lang=data['source_lang'],
            target_lang=data['target_lang'],
            tags=data.get('tags', []),
            created_at=datetime.now(),  # 添加创建时间
            user_id=request.user.phone if hasattr(request, 'user') else None  # 如果有用户认证，关联用户
        )
        
        db.session.add(new_memory)
        db.session.commit()
        
        return jsonify({
            'message': '记忆库创建成功',
            'id': new_memory.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@translation_memory_bp.route('/<memory_id>', methods=['GET'])
def get_translation_memory(memory_id):
    """获取指定ID的翻译记忆库"""
    try:
        memory = TranslationMemory.query.get(memory_id)
        if not memory:
            return jsonify({'error': '记忆库不存在'}), 404
        
        # 计算条目数量
        entry_count = TranslationMemoryEntry.query.filter_by(memory_id=memory.id).count()
        
        # 构建返回数据
        memory_data = {
            'id': memory.id,
            'name': memory.name,
            'source_lang': memory.source_lang,
            'target_lang': memory.target_lang,
            'tags': memory.tags,
            'entry_count': entry_count,
            'created_at': memory.created_at.isoformat() if hasattr(memory, 'created_at') else None
        }
        
        return jsonify(memory_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@translation_memory_bp.route('/<memory_id>', methods=['DELETE'])
def delete_translation_memory(memory_id):
    """删除指定ID的翻译记忆库"""
    try:
        memory = TranslationMemory.query.get(memory_id)
        if not memory:
            return jsonify({'error': '记忆库不存在'}), 404
        
        # 如果有用户认证，检查权限
        if hasattr(request, 'user') and memory.user_id and memory.user_id != request.user.phone:
            return jsonify({'error': '没有权限删除此记忆库'}), 403
        
        # 先删除所有关联的条目
        TranslationMemoryEntry.query.filter_by(memory_id=memory.id).delete()
        
        # 删除记忆库
        db.session.delete(memory)
        db.session.commit()
        
        return jsonify({'message': '记忆库删除成功'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@translation_memory_bp.route('/<memory_id>/entries', methods=['GET'])
def get_memory_entries(memory_id):
    """获取指定记忆库的所有条目"""
    try:
        # 检查记忆库是否存在
        memory = TranslationMemory.query.get(memory_id)
        if not memory:
            return jsonify({'error': '记忆库不存在'}), 404
        
        # 获取所有条目
        entries = TranslationMemoryEntry.query.filter_by(memory_id=memory_id).all()
        
        # 构建返回数据
        entries_data = [{
            'id': entry.id,
            'source_text': entry.source_text,
            'target_text': entry.target_text,
            'created_at': entry.created_at.isoformat() if hasattr(entry, 'created_at') else None
        } for entry in entries]
        
        return jsonify(entries_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@translation_memory_bp.route('/<memory_id>/export', methods=['GET'])
def export_memory(memory_id):
    """导出记忆库为TMX文件"""
    try:
        # 验证记忆库是否存在
        memory = TranslationMemory.query.get(memory_id)
        if not memory:
            return jsonify({'error': '记忆库不存在'}), 404
            
        # 获取所有条目
        entries = TranslationMemoryEntry.query.filter_by(memory_id=memory_id).all()
        
        # 生成TMX内容
        tmx_content = generate_tmx(entries)
        
        # 创建临时文件
        filename = f'memory_{memory_id}.tmx'
        filepath = os.path.join('/tmp', filename)
        with open(filepath, 'wb') as f:
            f.write(tmx_content)
        
        # 发送文件
        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename,
            mimetype='application/x-tmx+xml'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@translation_memory_bp.route('/<memory_id>/import', methods=['POST'])
def import_memory(memory_id):
    """从TMX文件导入记忆库条目"""
    try:
        # 验证记忆库是否存在
        memory = TranslationMemory.query.get(memory_id)
        if not memory:
            return jsonify({'error': '记忆库不存在'}), 404
            
        # 检查是否有文件
        if 'file' not in request.files:
            return jsonify({'error': '没有上传文件'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': '没有选择文件'}), 400
            
        # 验证文件类型
        if not file.filename.endswith('.tmx'):
            return jsonify({'error': '只支持TMX文件'}), 400
            
        # 读取并解析TMX文件
        tmx_content = file.read()
        entries, src_lang, tgt_lang = parse_tmx(tmx_content, memory_id)
        
        # 验证语言对是否匹配
        if src_lang != memory.source_lang or tgt_lang != memory.target_lang:
            return jsonify({'error': '文件的语言对与记忆库不匹配'}), 400
            
        # 批量插入条目
        for entry_data in entries:
            entry = TranslationMemoryEntry(**entry_data)
            db.session.add(entry)
            
        db.session.commit()
        
        return jsonify({
            'message': '导入成功',
            'count': len(entries)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@translation_memory_bp.route('/<memory_id>/entries/<entry_id>', methods=['PUT'])
def update_memory_entry(memory_id, entry_id):
    """更新记忆库条目"""
    try:
        # 验证记忆库是否存在
        memory = TranslationMemory.query.get(memory_id)
        if not memory:
            return jsonify({'error': '记忆库不存在'}), 404
            
        # 验证条目是否存在
        entry = TranslationMemoryEntry.query.filter_by(
            id=entry_id,
            memory_id=memory_id
        ).first()
        if not entry:
            return jsonify({'error': '记忆对不存在'}), 404
            
        # 获取更新数据
        data = request.get_json()
        
        # 更新字段
        if 'source_text' in data:
            entry.source_text = data['source_text']
        if 'target_text' in data:
            entry.target_text = data['target_text']
            
        # 更新时间
        entry.updated_at = datetime.now()
        
        db.session.commit()
        
        return jsonify({
            'message': '更新成功',
            'id': entry.id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500