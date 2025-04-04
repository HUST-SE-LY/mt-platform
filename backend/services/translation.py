from openai import OpenAI
import os
from flask import current_app

# 语言代码映射
LANGUAGE_MAP = {
    'zh': '中文',
    'en': '英文',
    'ja': '日文',
    'ko': '韩文',
    'fr': '法文',
    'de': '德文',
    'es': '西班牙文',
    'ru': '俄文'
}

class DeepSeekTranslator:
    def __init__(self):
        self.api_key = os.getenv('DEEPSEEK_API_KEY')
        if not self.api_key:
            raise ValueError("DeepSeek API key not configured")
            
        self.client = OpenAI(
            base_url="https://api.deepseek.com/",
            api_key=self.api_key
        )

    def translate(self, text, source_lang, target_lang):
        """
        调用 DeepSeek API 进行文本翻译
        :param text: 要翻译的文本
        :param source_lang: 源语言代码 (如 'zh')
        :param target_lang: 目标语言代码 (如 'en')
        :return: 翻译后的文本
        """
        if not text:
            return None

        try:
            # 将语言代码转换为语言名称
            source_lang_name = LANGUAGE_MAP.get(source_lang, source_lang)
            target_lang_name = LANGUAGE_MAP.get(target_lang, target_lang)

            completion = self.client.chat.completions.create(
                model="deepseek-chat",
                temperature=0.2,
                messages=[
                    {
                        "role": "system",
                        "content": f"你是一个{source_lang_name}和{target_lang_name}翻译专家，将用户输入的{source_lang_name}翻译成{target_lang_name}，或将用户输入的{target_lang_name}翻译成{source_lang_name}。翻译需符合信达雅标准。记住，除了输出翻译结果之外，不要输出任何东西。"
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ]
            )
            
            translation = completion.choices[0].message.content.strip()
            if not translation:
                raise ValueError("Empty translation result")
                
            return translation
            
        except Exception as e:
            current_app.logger.error(f"Translation error: {str(e)}")
            raise Exception(f"Translation failed: {str(e)}")