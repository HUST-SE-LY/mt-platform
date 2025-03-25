from flask import Blueprint, request, jsonify, current_app

translation_bp = Blueprint('translation', __name__, url_prefix='/api/translation')

@translation_bp.route('/text', methods=['POST'])
def translate_text():
    data = request.get_json()
    
    # 获取请求参数
    text = data.get('text')
    source_lang = data.get('source_lang')
    target_lang = data.get('target_lang')
    
    # 检查必填字段
    if not text or not source_lang or not target_lang:
        return jsonify({'error': 'Missing required fields: text, source_lang, target_lang'}), 400
    
    try:
        # 通过 current_app 获取翻译器实例
        translated_text = current_app.translator.translate(text, source_lang, target_lang)
        return jsonify({
            'translated_text': translated_text,
            'source_lang': source_lang,
            'target_lang': target_lang
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500