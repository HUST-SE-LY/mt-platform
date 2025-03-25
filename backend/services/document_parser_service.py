import os
from docx import Document
import PyPDF2
from typing import List

class DocumentParserService:
    """文档解析服务类，用于解析不同格式的文档"""
    
    def parse_file(self, file_path: str) -> List[str]:
        """根据文件类型解析文档"""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == '.txt':
            return self._parse_txt(file_path)
        elif ext == '.docx':
            return self._parse_docx(file_path)
        elif ext == '.pdf':
            return self._parse_pdf(file_path)
        else:
            raise ValueError(f"Unsupported file type: {ext}")

    def _parse_txt(self, file_path: str) -> List[str]:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # 按换行符分割，并过滤空字符串
            return [line.strip() for line in content.split('\n') if line.strip()]
    
    def _parse_docx(self, file_path: str) -> List[str]:
        doc = Document(file_path)
        segments = []
        current_segment = ""
        
        for para in doc.paragraphs:
            text = para.text.strip()
            if text:
                # 如果当前段落不为空，则添加换行符
                if current_segment:
                    current_segment += "\n"
                current_segment += text
        
        # 按换行符分割，并过滤空字符串
        if current_segment:
            segments = [line.strip() for line in current_segment.split('\n') if line.strip()]
        
        return segments
    
    def _parse_pdf(self, file_path: str) -> List[str]:
        text = ""
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        # 按换行符分割，并过滤空字符串
        return [line.strip() for line in text.split('\n') if line.strip()]