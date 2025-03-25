from flask import Blueprint, request, jsonify, current_app
from models.document import Document
from models.text_segment import TextSegment
from services.file_service import FileService
from services.document_parser_service import DocumentParserService
from services.translation import DeepSeekTranslator
import uuid
from datetime import datetime
from threading import Thread
from models import db

document_bp = Blueprint('document', __name__, url_prefix='/api/document')

@document_bp.route('/upload', methods=['POST'])
def upload_document():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    user = request.user
    user_phone = user.phone
    
    if not user_phone:
        return jsonify({'error': 'User phone is required'}), 400
    
    try:
        # 保存文件
        file_service = FileService()
        file_name = request.form.get('fileName', file.filename)
        file_info = file_service.save_file(file, file_name)
        
        # 计算费用（10KB = 1元）
        cost = max(1, file_info['file_size'] // 10240)
        
        # 检查用户余额是否足够
        from models.user import User
        user = User.query.filter_by(phone=user_phone).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        if user.balance < cost:
            return jsonify({'error': 'Insufficient balance'}), 400
        
        # 创建文档记录
        doc = Document(
            id=file_info['file_id'],
            file_name=file_info['original_filename'],
            file_size=file_info['file_size'],
            storage_path=file_info['file_path'],
            user_phone=user_phone,
            is_translating=True
        )
        db.session.add(doc)
        db.session.commit()
        
        # 获取语言参数
        source_lang = request.form.get('source_lang', '中文')
        target_lang = request.form.get('target_lang', '英文')
        
        # 启动后台翻译任务
        app = current_app._get_current_object()
        Thread(target=async_translate_document, args=(app, file_info, user_phone, source_lang, target_lang)).start()
        
        return jsonify({
            'document_id': file_info['file_id'],
            'status': 'uploaded',
            'message': 'Document uploaded successfully, translation in progress'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def async_translate_document(app, file_info, user_phone, source_lang, target_lang):
    """后台异步执行文档翻译"""
    with app.app_context():
        try:
            # 获取文档记录
            doc = Document.query.get(file_info['file_id'])
            
            # 解析文档
            parser = DocumentParserService()
            segments = parser.parse_file(file_info['file_path'])
            
            # 翻译文本段
            translator = current_app.translator
            for index, segment in enumerate(segments):
                translated_text = translator.translate(segment, source_lang, target_lang)
                text_segment = TextSegment(
                    id=str(uuid.uuid4()),
                    original_text=segment,
                    translated_text=translated_text,
                    document_id=file_info['file_id'],
                    sequence=index + 1
                )
                db.session.add(text_segment)
            
            # 翻译完成后扣除费用
            cost = max(1, file_info['file_size'] // 10240)
            from models.user import User
            user = User.query.filter_by(phone=user_phone).first()
            if user:
                user.balance -= cost
                db.session.commit()
            
            # 更新文档状态
            doc.is_translating = False
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error during async translation: {str(e)}")


@document_bp.route('/status/<document_id>', methods=['GET'])
def get_document_status(document_id):
    try:
        # 获取文档记录
        doc = Document.query.get(document_id)
        if not doc:
            return jsonify({'error': 'Document not found'}), 404
        
        # 检查是否翻译完成
        if doc.is_translating:
            return jsonify({
                'document_id': document_id,
                'status': 'translating',
                'message': 'Document is still being translated'
            }), 200
        
        # 获取已翻译的文本段，按顺序排列
        text_segments = TextSegment.query.filter_by(document_id=document_id)\
            .order_by(TextSegment.sequence).all()
        
        # 构建返回数据
        segments_data = [{
            'original_text': segment.original_text,
            'translated_text': segment.translated_text,
            'sequence': segment.sequence
        } for segment in text_segments]
        
        return jsonify({
            'document_id': document_id,
            'status': 'completed',
            'segments': segments_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@document_bp.route('/delete/<document_id>', methods=['DELETE'])
def delete_document(document_id):
    try:
        # 获取当前用户
        user = request.user
        if not user or not user.phone:
            return jsonify({'error': 'Unauthorized'}), 401
        
        # 获取文档记录
        doc = Document.query.get(document_id)
        if not doc:
            return jsonify({'error': 'Document not found'}), 404
        
        # 检查文档是否属于当前用户
        if doc.user_phone != user.phone:
            return jsonify({'error': 'Permission denied'}), 403
        
        # 删除本地文件
        import os
        if os.path.exists(doc.storage_path):
            os.remove(doc.storage_path)
        
        # 删除相关的文本段记录
        TextSegment.query.filter_by(document_id=document_id).delete()
        
        # 删除文档记录
        db.session.delete(doc)
        db.session.commit()
        
        return jsonify({
            'message': 'Document deleted successfully',
            'document_id': document_id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500