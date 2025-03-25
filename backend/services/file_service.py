import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename

class FileService:
    """文件服务类，用于处理文件上传和存储"""
    
    def __init__(self, upload_folder='/Users/ly/mt-platform/uploads'):
        self.upload_folder = upload_folder
        if not os.path.exists(self.upload_folder):
            os.makedirs(self.upload_folder)

    def save_file(self, file, file_name=None):
        """保存上传的文件并返回文件信息"""
        if not file:
            raise ValueError("No file provided")
        
        # 使用传入的文件名，如果没有则使用原始文件名
        original_filename = file_name if file_name else secure_filename(file.filename)
        
        # 生成唯一文件名
        file_id = str(uuid.uuid4())
        file_ext = os.path.splitext(original_filename)[1]
        new_filename = f"{file_id}{file_ext}"
        
        # 保存文件
        file_path = os.path.join(self.upload_folder, new_filename)
        file.save(file_path)
        
        # 获取文件大小
        file_size = os.path.getsize(file_path)
        
        return {
            'file_id': file_id,
            'original_filename': original_filename,
            'file_path': file_path,
            'file_size': file_size
        }