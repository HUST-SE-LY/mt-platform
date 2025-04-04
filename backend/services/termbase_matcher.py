from models import Term
import re

class TermbaseMatcher:
    def __init__(self):
        self.terms_cache = {}  # 缓存已加载的术语
        
    def load_terms(self, termbase_ids):
        """加载指定术语库的所有术语"""
        if not termbase_ids:
            return {}
            
        # 如果术语已在缓存中，直接返回
        cache_key = ','.join(map(str, termbase_ids))
        if cache_key in self.terms_cache:
            return self.terms_cache[cache_key]
            
        # 从数据库加载术语
        terms = {}
        for termbase_id in termbase_ids:
            entries = Term.query.filter_by(termbase_id=termbase_id).all()
            for entry in entries:
                if entry.source_term not in terms:
                    terms[entry.source_term] = {
                        'target': entry.target_term,
                        'description': entry.description,
                        'termbase_id': termbase_id
                    }
                    
        # 存入缓存
        self.terms_cache[cache_key] = terms
        return terms
        
    def find_terms(self, text, terms):
        """在文本中查找术语"""
        if not text or not terms:
            return []
            
        matches = []
        # 按术语长度降序排序，优先匹配较长的术语
        sorted_terms = sorted(terms.keys(), key=len, reverse=True)
        
        for term in sorted_terms:
            # 使用正则表达式查找完整的词
            pattern = r'\b' + re.escape(term) + r'\b'
            for match in re.finditer(pattern, text):
                matches.append({
                    'term': term,
                    'start': match.start(),
                    'end': match.end(),
                    'target': terms[term]['target'],
                    'description': terms[term]['description'],
                    'termbase_id': terms[term]['termbase_id']
                })
                
        # 按位置排序
        matches.sort(key=lambda x: x['start'])
        return matches 