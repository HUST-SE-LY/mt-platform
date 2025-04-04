import xml.etree.ElementTree as ET
from datetime import datetime
import uuid

def generate_tbx(terms, termbase):
    """生成TBX格式的XML文件"""
    # 创建根元素
    root = ET.Element('tbx', version="TBX-Basic")
    root.set('xml:lang', termbase.source_lang)
    
    # 添加头部信息
    header = ET.SubElement(root, 'tbxHeader')
    header.set('creationtool', 'MT Platform')
    header.set('creationtoolversion', '1.0')
    header.set('segtype', 'term')
    header.set('creationdate', datetime.now().strftime('%Y%m%dT%H%M%SZ'))
    
    # 添加正文
    body = ET.SubElement(root, 'text')
    body_content = ET.SubElement(body, 'body')
    
    # 添加术语条目
    for term in terms:
        termEntry = ET.SubElement(body_content, 'termEntry')
        termEntry.set('id', term.id)
        
        # 源语言术语
        langSet_src = ET.SubElement(termEntry, 'langSet')
        langSet_src.set('xml:lang', termbase.source_lang)
        tig_src = ET.SubElement(langSet_src, 'tig')
        term_src = ET.SubElement(tig_src, 'term')
        term_src.text = term.source_term
        
        # 目标语言术语
        langSet_tgt = ET.SubElement(termEntry, 'langSet')
        langSet_tgt.set('xml:lang', termbase.target_lang)
        tig_tgt = ET.SubElement(langSet_tgt, 'tig')
        term_tgt = ET.SubElement(tig_tgt, 'term')
        term_tgt.text = term.target_term
        
        # 添加描述信息
        if term.description:
            note = ET.SubElement(tig_tgt, 'note')
            note.text = term.description
    
    # 生成XML字符串
    return ET.tostring(root, encoding='utf-8', xml_declaration=True)

def parse_tbx(tbx_content, termbase_id):
    """解析TBX文件内容，返回术语列表"""
    terms = []
    
    # 解析XML
    root = ET.fromstring(tbx_content)
    
    # 获取源语言
    src_lang = root.get('{http://www.w3.org/XML/1998/namespace}lang')
    
    # 遍历术语条目
    for term_entry in root.findall('.//termEntry'):
        source_term = ''
        target_term = ''
        target_lang = ''
        description = ''
        
        # 获取源语言和目标语言术语
        for lang_set in term_entry.findall('langSet'):
            lang = lang_set.get('{http://www.w3.org/XML/1998/namespace}lang')
            term_text = lang_set.find('.//term').text
            
            if lang == src_lang:
                source_term = term_text
            else:
                target_term = term_text
                target_lang = lang
                # 获取描述信息
                note = lang_set.find('.//note')
                if note is not None:
                    description = note.text
        
        # 创建术语条目
        if source_term and target_term:
            terms.append({
                'id': str(uuid.uuid4()),
                'termbase_id': termbase_id,
                'source_term': source_term,
                'target_term': target_term,
                'description': description,
                'created_at': datetime.now()
            })
    
    return terms, src_lang, target_lang 