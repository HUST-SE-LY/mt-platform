import os
import uuid
from werkzeug.utils import secure_filename

class FileService:
    """文件服务类，用于处理文件上传和存储"""
    
    def __init__(self):
        self.upload_folder = os.getenv('UPLOAD_FOLDER', 'uploads')
        if not os.path.exists(self.upload_folder):
            os.makedirs(self.upload_folder)

    def save_file(self, file, original_filename=None):
        """
        保存上传的文件
        :param file: FileStorage 对象
        :param original_filename: 原始文件名（可选）
        :return: 文件信息字典
        """
        # 使用原始文件名或文件对象的文件名
        filename = original_filename or file.filename
        
        # 获取文件扩展名
        _, ext = os.path.splitext(filename)
        
        # 生成唯一的文件ID和安全的文件名
        file_id = str(uuid.uuid4())
        safe_filename = secure_filename(f"{file_id}{ext}")
        
        # 构建文件路径
        file_path = os.path.join(self.upload_folder, safe_filename)
        
        # 保存文件
        file.save(file_path)
        
        return {
            'file_id': file_id,
            'original_filename': filename,  # 保存原始文件名（包括中文）
            'file_path': file_path,
            'file_size': os.path.getsize(file_path)
        }