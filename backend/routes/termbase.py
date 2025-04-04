from flask import Blueprint, request, jsonify, send_file
from models import Termbase, Term, db
from datetime import datetime
import uuid
from utils.tbx import generate_tbx, parse_tbx
import os

termbase_bp = Blueprint('termbase', __name__, url_prefix='/api/termbase')

@termbase_bp.route('/', methods=['GET'])
def get_termbases():
    """获取用户的所有术语库"""
    try:
        # 查询所有术语库
        termbases = Termbase.query.all()
        
        result = []
        for termbase in termbases:
            # 计算术语数量
            term_count = Term.query.filter_by(termbase_id=termbase.id).count()
            
            result.append({
                'id': termbase.id,
                'name': termbase.name,
                'source_lang': termbase.source_lang,
                'target_lang': termbase.target_lang,
                'tags': termbase.tags,
                'entry_count': term_count,
                'created_at': termbase.created_at.isoformat()
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@termbase_bp.route('/', methods=['POST'])
def create_termbase():
    """创建新的术语库"""
    data = request.get_json()
    
    # 验证必填字段
    required_fields = ['name', 'source_lang', 'target_lang']
    if not all(field in data for field in required_fields):
        return jsonify({'error': '缺少必填字段'}), 400
    
    # 验证源语言和目标语言不能相同
    if data['source_lang'] == data['target_lang']:
        return jsonify({'error': '源语言和目标语言不能相同'}), 400
    
    try:
        # 创建新的术语库
        new_termbase = Termbase(
            id=str(uuid.uuid4()),
            name=data['name'],
            source_lang=data['source_lang'],
            target_lang=data['target_lang'],
            tags=data.get('tags', [])
        )
        
        db.session.add(new_termbase)
        db.session.commit()
        
        return jsonify({
            'message': '术语库创建成功',
            'id': new_termbase.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@termbase_bp.route('/<termbase_id>', methods=['DELETE'])
def delete_termbase(termbase_id):
    """删除术语库"""
    try:
        termbase = Termbase.query.get(termbase_id)
        if not termbase:
            return jsonify({'error': '术语库不存在'}), 404
        
        # 删除所有相关术语
        Term.query.filter_by(termbase_id=termbase_id).delete()
        
        # 删除术语库
        db.session.delete(termbase)
        db.session.commit()
        
        return jsonify({'message': '术语库删除成功'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@termbase_bp.route('/<termbase_id>/terms', methods=['GET'])
def get_terms(termbase_id):
    """获取术语库中的所有术语"""
    try:
        # 验证术语库是否存在
        if not Termbase.query.get(termbase_id):
            return jsonify({'error': '术语库不存在'}), 404
            
        # 获取所有术语
        terms = Term.query.filter_by(termbase_id=termbase_id).all()
        
        result = [{
            'id': term.id,
            'source_term': term.source_term,
            'target_term': term.target_term,
            'description': term.description,
            'created_at': term.created_at.isoformat()
        } for term in terms]
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@termbase_bp.route('/<termbase_id>/terms', methods=['POST'])
def add_term(termbase_id):
    """添加新术语"""
    try:
        # 验证术语库是否存在
        if not Termbase.query.get(termbase_id):
            return jsonify({'error': '术语库不存在'}), 404
            
        data = request.get_json()
        
        # 验证必填字段
        required_fields = ['source_term', 'target_term']
        if not all(field in data for field in required_fields):
            return jsonify({'error': '缺少必填字段'}), 400
            
        # 创建新术语
        new_term = Term(
            id=str(uuid.uuid4()),
            termbase_id=termbase_id,
            source_term=data['source_term'],
            target_term=data['target_term'],
            description=data.get('description')
        )
        
        db.session.add(new_term)
        db.session.commit()
        
        return jsonify({
            'message': '术语添加成功',
            'id': new_term.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@termbase_bp.route('/<termbase_id>/terms/<term_id>', methods=['PUT'])
def update_term(termbase_id, term_id):
    """更新术语"""
    try:
        # 验证术语是否存在
        term = Term.query.filter_by(id=term_id, termbase_id=termbase_id).first()
        if not term:
            return jsonify({'error': '术语不存在'}), 404
            
        data = request.get_json()
        
        # 更新字段
        if 'source_term' in data:
            term.source_term = data['source_term']
        if 'target_term' in data:
            term.target_term = data['target_term']
        if 'description' in data:
            term.description = data['description']
            
        db.session.commit()
        
        return jsonify({
            'message': '术语更新成功',
            'id': term.id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@termbase_bp.route('/<termbase_id>/terms/<term_id>', methods=['DELETE'])
def delete_term(termbase_id, term_id):
    """删除术语"""
    try:
        # 验证术语是否存在
        term = Term.query.filter_by(id=term_id, termbase_id=termbase_id).first()
        if not term:
            return jsonify({'error': '术语不存在'}), 404
            
        db.session.delete(term)
        db.session.commit()
        
        return jsonify({'message': '术语删除成功'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@termbase_bp.route('/<termbase_id>', methods=['GET'])
def get_termbase(termbase_id):
    """获取单个术语库的详情"""
    try:
        termbase = Termbase.query.get(termbase_id)
        if not termbase:
            return jsonify({'error': '术语库不存在'}), 404
            
        # 计算术语数量
        term_count = Term.query.filter_by(termbase_id=termbase_id).count()
        
        # 构建返回数据
        result = {
            'id': termbase.id,
            'name': termbase.name,
            'source_lang': termbase.source_lang,
            'target_lang': termbase.target_lang,
            'tags': termbase.tags,
            'entry_count': term_count,
            'created_at': termbase.created_at.isoformat()
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@termbase_bp.route('/<termbase_id>/export', methods=['GET'])
def export_termbase(termbase_id):
    """导出术语库为TBX文件"""
    try:
        # 验证术语库是否存在
        termbase = Termbase.query.get(termbase_id)
        if not termbase:
            return jsonify({'error': '术语库不存在'}), 404
            
        # 获取所有术语
        terms = Term.query.filter_by(termbase_id=termbase_id).all()
        
        # 生成TBX内容
        tbx_content = generate_tbx(terms, termbase)
        
        # 创建临时文件
        filename = f'termbase_{termbase_id}.tbx'
        filepath = os.path.join('/tmp', filename)
        with open(filepath, 'wb') as f:
            f.write(tbx_content)
        
        # 发送文件
        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename,
            mimetype='application/x-tbx'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@termbase_bp.route('/<termbase_id>/import', methods=['POST'])
def import_termbase(termbase_id):
    """从TBX文件导入术语"""
    try:
        # 验证术语库是否存在
        termbase = Termbase.query.get(termbase_id)
        if not termbase:
            return jsonify({'error': '术语库不存在'}), 404
            
        # 检查是否有文件
        if 'file' not in request.files:
            return jsonify({'error': '没有上传文件'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': '没有选择文件'}), 400
            
        # 验证文件类型
        if not file.filename.endswith('.tbx'):
            return jsonify({'error': '只支持TBX文件'}), 400
            
        # 读取并解析TBX文件
        tbx_content = file.read()
        terms, src_lang, tgt_lang = parse_tbx(tbx_content, termbase_id)
        
        # 验证语言对是否匹配
        if src_lang != termbase.source_lang or tgt_lang != termbase.target_lang:
            return jsonify({'error': '文件的语言对与术语库不匹配'}), 400
            
        # 批量插入术语
        for term_data in terms:
            term = Term(**term_data)
            db.session.add(term)
            
        db.session.commit()
        
        return jsonify({
            'message': '导入成功',
            'count': len(terms)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 