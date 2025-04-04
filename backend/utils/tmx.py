import xml.etree.ElementTree as ET
from datetime import datetime
import uuid

def generate_tmx(memory_entries):
    """生成TMX格式的XML文件"""
    # 创建根元素
    root = ET.Element('tmx', version='1.4')
    
    # 添加头部信息
    header = ET.SubElement(root, 'header')
    header.set('creationtool', 'MT Platform')
    header.set('creationtoolversion', '1.0')
    header.set('segtype', 'sentence')
    header.set('adminlang', 'en')
    header.set('srclang', memory_entries[0].memory.source_lang if memory_entries else 'en')
    header.set('datatype', 'plaintext')
    header.set('creationdate', datetime.now().strftime('%Y%m%dT%H%M%SZ'))
    
    # 添加正文
    body = ET.SubElement(root, 'body')
    
    # 添加翻译单元
    for entry in memory_entries:
        tu = ET.SubElement(body, 'tu')
        tu.set('creationdate', entry.created_at.strftime('%Y%m%dT%H%M%SZ'))
        
        # 源语言
        tuv_src = ET.SubElement(tu, 'tuv')
        tuv_src.set('xml:lang', entry.memory.source_lang)
        seg_src = ET.SubElement(tuv_src, 'seg')
        seg_src.text = entry.source_text
        
        # 目标语言
        tuv_tgt = ET.SubElement(tu, 'tuv')
        tuv_tgt.set('xml:lang', entry.memory.target_lang)
        seg_tgt = ET.SubElement(tuv_tgt, 'seg')
        seg_tgt.text = entry.target_text
    
    # 生成XML字符串
    return ET.tostring(root, encoding='utf-8', xml_declaration=True)

def parse_tmx(tmx_content, memory_id):
    """解析TMX文件内容，返回记忆库条目列表"""
    entries = []
    
    # 解析XML
    root = ET.fromstring(tmx_content)
    
    # 获取源语言和目标语言
    header = root.find('header')
    src_lang = header.get('srclang')
    
    # 遍历翻译单元
    for tu in root.findall('.//tu'):
        # 获取源文本和目标文本
        source_text = ''
        target_text = ''
        target_lang = ''
        
        for tuv in tu.findall('tuv'):
            lang = tuv.get('{http://www.w3.org/XML/1998/namespace}lang')
            seg = tuv.find('seg')
            if lang == src_lang:
                source_text = seg.text
            else:
                target_text = seg.text
                target_lang = lang
        
        # 创建记忆库条目
        if source_text and target_text:
            entries.append({
                'id': str(uuid.uuid4()),
                'memory_id': memory_id,
                'source_text': source_text,
                'target_text': target_text,
                'created_at': datetime.now()
            })
    
    return entries, src_lang, target_lang 