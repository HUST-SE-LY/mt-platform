from openai import OpenAI
import os
from flask import current_app

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
        :param source_lang: 源语言代码 (如 '中文')
        :param target_lang: 目标语言代码 (如 '英文')
        :return: 翻译后的文本
        """
        if not self.api_key:
            current_app.logger.error("DeepSeek API key not configured")
            raise ValueError("DeepSeek API key not configured")

        try:
            completion = self.client.chat.completions.create(
                model="deepseek-chat",
                temperature=0.2,
                messages=[
                    {
                        "role": "system",
                        "content": f"你是一个{source_lang}和{target_lang}翻译专家，将用户输入的{source_lang}翻译成{target_lang}，或将用户输入的{target_lang}翻译成{source_lang}。翻译需符合信达雅标准。记住，除了输出翻译结果之外，不要输出任何东西，下面是我提供的文本"
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ]
            )
            return completion.choices[0].message.content
        except Exception as e:
            current_app.logger.error(f"DeepSeek API request failed: {str(e)}")
            raise Exception("Translation service unavailable")