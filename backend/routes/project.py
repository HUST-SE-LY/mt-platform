from flask import Blueprint, request, jsonify, current_app, Response, stream_with_context
from models import db, Project, ProjectMemoryLink, ProjectTermbaseLink, TranslationMemory, Termbase, ProjectDocument, DocumentSegment
from datetime import datetime
from services.file_service import FileService
from services.document_parser_service import DocumentParserService
from concurrent.futures import ThreadPoolExecutor
from services.translation import DeepSeekTranslator
from contextlib import contextmanager
import json
import time
from services.termbase_matcher import TermbaseMatcher

project_bp = Blueprint('project', __name__, url_prefix='/api/project')

file_service = FileService()
document_parser = DocumentParserService()

# 只创建线程池，不初始化翻译器
executor = ThreadPoolExecutor(max_workers=5)

term_matcher = TermbaseMatcher()

@contextmanager
def app_context():
    """创建应用上下文的上下文管理器"""
    ctx = current_app.app_context()
    ctx.push()
    try:
        yield
    finally:
        ctx.pop()

@project_bp.route('/', methods=['POST'])
def create_project():
    """创建新的翻译项目"""
    try:
        data = request.get_json()
        
        # 验证必填字段
        required_fields = ['name', 'source_lang', 'target_lang']
        if not all(field in data for field in required_fields):
            return jsonify({'error': '缺少必填字段'}), 400
            
        # 验证源语言和目标语言不能相同
        if data['source_lang'] == data['target_lang']:
            return jsonify({'error': '源语言和目标语言不能相同'}), 400
            
        # 创建项目
        new_project = Project(
            name=data['name'],
            source_lang=data['source_lang'],
            target_lang=data['target_lang'],
            description=data.get('description'),
            user_id=request.user.phone if hasattr(request, 'user') else None
        )
        
        db.session.add(new_project)
        
        # 关联记忆库
        memory_ids = data.get('memory_ids', [])
        for index, memory_id in enumerate(memory_ids):
            # 验证记忆库是否存在
            if not TranslationMemory.query.get(memory_id):
                return jsonify({'error': f'记忆库 {memory_id} 不存在'}), 400
                
            link = ProjectMemoryLink(
                project_id=new_project.id,
                memory_id=memory_id,
                priority=index
            )
            db.session.add(link)
            
        # 关联术语库
        termbase_ids = data.get('termbase_ids', [])
        for index, termbase_id in enumerate(termbase_ids):
            # 验证术语库是否存在
            if not Termbase.query.get(termbase_id):
                return jsonify({'error': f'术语库 {termbase_id} 不存在'}), 400
                
            link = ProjectTermbaseLink(
                project_id=new_project.id,
                termbase_id=termbase_id,
                priority=index
            )
            db.session.add(link)
            
        db.session.commit()
        
        return jsonify({
            'message': '项目创建成功',
            'id': new_project.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@project_bp.route('/resources', methods=['GET'])
def get_project_resources():
    """获取可用的记忆库和术语库资源"""
    try:
        # 获取所有记忆库
        memories = TranslationMemory.query.all()
        memory_list = [{
            'id': m.id,
            'name': m.name,
            'source_lang': m.source_lang,
            'target_lang': m.target_lang
        } for m in memories]
        
        # 获取所有术语库
        termbases = Termbase.query.all()
        termbase_list = [{
            'id': t.id,
            'name': t.name,
            'source_lang': t.source_lang,
            'target_lang': t.target_lang
        } for t in termbases]
        
        return jsonify({
            'memories': memory_list,
            'termbases': termbase_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@project_bp.route('/', methods=['GET'])
def get_projects():
    """获取所有项目列表"""
    try:
        # 获取当前用户的项目
        projects = Project.query.filter_by(user_id=request.user.phone if hasattr(request, 'user') else None).all()
        
        result = []
        for project in projects:
            # 获取项目关联的文档数量（假设有 documents 表与 projects 关联）
            # doc_count = Document.query.filter_by(project_id=project.id).count()
            doc_count = 0  # 暂时返回0，等文档功能完成后再修改
            
            result.append({
                'id': project.id,
                'name': project.name,
                'source_lang': project.source_lang,
                'target_lang': project.target_lang,
                'doc_count': doc_count,
                'created_at': project.created_at.isoformat(),
                'description': project.description
            })
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@project_bp.route('/<project_id>', methods=['DELETE'])
def delete_project(project_id):
    """删除项目"""
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': '项目不存在'}), 404
            
        # 验证权限
        if hasattr(request, 'user') and project.user_id != request.user.phone:
            return jsonify({'error': '无权限删除此项目'}), 403
            
        # 删除项目（关联的记忆库和术语库链接会自动删除）
        db.session.delete(project)
        db.session.commit()
        
        return jsonify({'message': '项目删除成功'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@project_bp.route('/<project_id>', methods=['GET'])
def get_project(project_id):
    """获取项目详情"""
    try:
        # 获取项目基本信息
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': '项目不存在'}), 404
            
        # 获取项目关联的记忆库
        memories = []
        for link in project.memory_links:
            memory = link.memory
            memories.append({
                'id': memory.id,
                'name': memory.name,
                'priority': link.priority
            })
            
        # 获取项目关联的术语库
        termbases = []
        for link in project.termbase_links:
            termbase = link.termbase
            termbases.append({
                'id': termbase.id,
                'name': termbase.name,
                'priority': link.priority
            })
            
        # 获取项目文档列表
        documents = []
        for doc in project.documents:
            documents.append({
                'id': doc.id,
                'name': doc.name,
                'size': doc.file_size,
                'status': doc.status,
                'created_at': doc.created_at.isoformat(),
                'creator': doc.creator.phone if doc.creator else None
            })
            
        # 构建返回数据
        result = {
            'id': project.id,
            'name': project.name,
            'source_lang': project.source_lang,
            'target_lang': project.target_lang,
            'description': project.description,
            'created_at': project.created_at.isoformat(),
            'creator': project.creator.phone if project.creator else None,
            'doc_count': len(documents),
            'memories': memories,
            'termbases': termbases,
            'documents': documents
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@project_bp.route('/<project_id>/documents', methods=['POST'])
def upload_document(project_id):
    """上传项目文档"""
    try:
        # 验证项目是否存在
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': '项目不存在'}), 404
            
        # 检查是否有文件
        if 'file' not in request.files:
            return jsonify({'error': '没有上传文件'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': '没有选择文件'}), 400
            
        # 获取原始文件名（处理中文文件名）
        filename = file.filename
        if isinstance(filename, str):
            # 如果是 Windows 系统上传的文件，去除可能的路径信息
            filename = filename.rsplit('\\', 1)[-1]
        try:
            # 尝试解码文件名（处理某些浏览器的编码问题）
            filename = filename.encode('latin1').decode('utf-8')
        except (UnicodeEncodeError, UnicodeDecodeError):
            # 如果解码失败，说明文件名已经是 UTF-8 编码
            pass
            
        # 保存文件
        file_info = file_service.save_file(file, original_filename=filename)
        
        # 创建文档记录
        document = ProjectDocument(
            id=file_info['file_id'],
            project_id=project_id,
            name=filename,  # 使用处理后的文件名
            file_path=file_info['file_path'],
            file_size=file_info['file_size'] // 1024,  # 转换为KB
            status='pending',  # 设置为待翻译状态
            user_id=request.user.phone if hasattr(request, 'user') else None
        )
        db.session.add(document)
        
        # 解析文档并创建文本段
        segments = document_parser.parse_file(file_info['file_path'])
        for index, text in enumerate(segments, 1):
            segment = DocumentSegment(
                document_id=document.id,
                source_text=text,
                sequence=index
            )
            db.session.add(segment)
        
        db.session.commit()
        
        return jsonify({
            'message': '文档上传成功',
            'document_id': document.id,
            'segment_count': len(segments)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Document upload error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@project_bp.route('/documents/<document_id>/translate', methods=['POST'])
def translate_document(document_id):
    """AI初译文档"""
    try:
        # 获取文档和项目信息
        document = ProjectDocument.query.get(document_id)
        if not document:
            return jsonify({'error': '文档不存在'}), 404
            
        project = Project.query.get(document.project_id)
        if not project:
            return jsonify({'error': '项目不存在'}), 404
            
        # 保存需要的信息
        project_source_lang = project.source_lang
        project_target_lang = project.target_lang
        
        # 获取所有未翻译的段落的 ID
        segment_ids = [
            seg.id for seg in DocumentSegment.query.filter_by(
                document_id=document_id,
                target_text=None
            ).all()
        ]
        
        total_segments = len(segment_ids)
        
        # 更新文档状态为翻译中
        session = db.session()
        try:
            document = session.query(ProjectDocument).get(document_id)
            if document:
                document.status = 'translating'
                # 重置所有段落状态为 pending
                for segment in session.query(DocumentSegment).filter_by(document_id=document_id):
                    segment.status = 'pending'
                    segment.target_text = None
                session.commit()
        finally:
            session.close()
        
        # 获取当前应用上下文
        app = current_app._get_current_object()
        
        # 在需要时初始化翻译器
        translator = DeepSeekTranslator()
        error_count = 0
        completed_count = 0
        
        def translate_segment(segment_id):
            nonlocal error_count, completed_count
            with app.app_context():
                session = None
                try:
                    # 创建新的会话
                    session = db.session()
                    
                    # 使用新的会话查询段落
                    segment = session.query(DocumentSegment).get(segment_id)
                    if not segment:
                        current_app.logger.error(f"Segment {segment_id} not found")
                        error_count += 1
                        return
                    
                    # 调用翻译服务
                    current_app.logger.info(f"Translating segment {segment_id}: {segment.source_text[:50]}...")
                    translation = translator.translate(
                        segment.source_text,
                        project_source_lang,
                        project_target_lang
                    )
                    
                    if not translation:
                        raise ValueError("Empty translation result")
                    
                    # 更新数据库
                    segment.target_text = translation
                    segment.status = 'completed'
                    session.commit()
                    completed_count += 1
                    current_app.logger.info(f"Successfully translated segment {segment_id}")
                    
                except Exception as e:
                    error_count += 1
                    current_app.logger.error(f"Translation error for segment {segment_id}: {str(e)}")
                    if session and session.is_active:
                        session.rollback()
                        try:
                            # 重新获取段落并更新状态
                            segment = session.query(DocumentSegment).get(segment_id)
                            if segment:
                                segment.status = 'error'
                                segment.target_text = None
                                session.commit()
                        except Exception as e2:
                            current_app.logger.error(f"Failed to update error status: {str(e2)}")
                finally:
                    if session:
                        session.close()
        
        # 使用线程池并行翻译
        futures = []
        for segment_id in segment_ids:
            future = executor.submit(translate_segment, segment_id)
            futures.append(future)
        
        # 等待所有翻译完成
        for future in futures:
            try:
                future.result()
            except Exception as e:
                error_count += 1
                current_app.logger.error(f"Future execution error: {str(e)}")
        
        # 更新最终状态
        session = db.session()
        try:
            document = session.query(ProjectDocument).get(document_id)
            if document:
                document.status = 'completed' if error_count == 0 else 'error'
                session.commit()
        finally:
            session.close()
        
        return jsonify({
            'message': '翻译任务完成',
            'segment_count': len(segment_ids),
            'success_count': completed_count,
            'error_count': error_count,
            'status': 'completed' if error_count == 0 else 'error'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Document translation error: {str(e)}")
        session = db.session()
        try:
            document = session.query(ProjectDocument).get(document_id)
            if document:
                document.status = 'error'
                session.commit()
        finally:
            session.close()
        return jsonify({'error': str(e)}), 500

@project_bp.route('/documents/<document_id>', methods=['GET'])
def get_document(document_id):
    """获取文档详情"""
    try:
        # 获取文档
        document = ProjectDocument.query.get(document_id)
        if not document:
            return jsonify({'error': '文档不存在'}), 404
            
        # 获取项目关联的术语库ID
        project = Project.query.get(document.project_id)
        termbase_ids = [link.termbase_id for link in project.termbase_links]
        
        # 加载术语
        terms = term_matcher.load_terms(termbase_ids)
        
        # 获取文档的所有段落
        segments = DocumentSegment.query.filter_by(
            document_id=document_id
        ).order_by(DocumentSegment.sequence).all()
        
        # 构建返回数据
        result = {
            'id': document.id,
            'name': document.name,
            'status': document.status,
            'created_at': document.created_at.isoformat(),
            'segments': [{
                'id': seg.id,
                'sequence': seg.sequence,
                'source_text': seg.source_text,
                'target_text': seg.target_text,
                'status': seg.status,
                'terms': term_matcher.find_terms(seg.source_text, terms)
            } for seg in segments]
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@project_bp.route('/documents/<document_id>/translate/progress', methods=['GET'])
def translate_progress(document_id):
    """获取翻译进度"""
    def generate():
        try:
            last_status = None
            last_progress = -1
            
            while True:
                # 创建新的会话以获取最新数据
                session = db.session()
                try:
                    # 获取文档状态和进度
                    document = session.query(ProjectDocument).get(document_id)
                    if not document:
                        break

                    # 获取段落统计
                    total = session.query(DocumentSegment).filter_by(
                        document_id=document_id
                    ).count()
                    
                    if total == 0:
                        break

                    completed = session.query(DocumentSegment).filter_by(
                        document_id=document_id,
                        status='completed'
                    ).count()
                    
                    error = session.query(DocumentSegment).filter_by(
                        document_id=document_id,
                        status='error'
                    ).count()
                    
                    # 计算进度
                    processed = completed + error
                    progress = int(processed / total * 100)
                    
                    # 检查状态或进度是否有变化
                    status_changed = document.status != last_status
                    progress_changed = progress != last_progress
                    
                    # 如果有变化，发送更新
                    if status_changed or progress_changed:
                        data = {
                            'progress': progress,
                            'status': document.status,
                            'total': total,
                            'success': completed,
                            'error': error
                        }
                        yield f"data: {json.dumps(data)}\n\n"
                        
                        # 更新上次的状态和进度
                        last_status = document.status
                        last_progress = progress
                    
                    # 如果翻译已完成或出错，再发送一次最终状态后结束
                    if document.status != 'translating':
                        if status_changed:  # 只在状态刚改变时发送
                            data = {
                                'progress': 100,
                                'status': document.status,
                                'total': total,
                                'success': completed,
                                'error': error
                            }
                            yield f"data: {json.dumps(data)}\n\n"
                        break
                finally:
                    session.close()

                time.sleep(0.5)  # 每0.5秒检查一次

        except Exception as e:
            current_app.logger.error(f"Progress stream error: {str(e)}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
        }
    ) 