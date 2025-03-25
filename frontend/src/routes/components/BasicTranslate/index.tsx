import { http } from '@/utils/http';
import { popAdvertisement } from '@/utils/popAdvertisement';
import { IconArrowRight } from '@douyinfe/semi-icons';
import { Button, Select, TextArea, Toast } from '@douyinfe/semi-ui';
import { useState } from 'react';
export const BasicTranslate = () => {
  const [originLanguage, setOriginLanguage] = useState('英文');
  const [targetLanguage, setTargetLanguage] = useState('中文');
  const [originText, setOriginText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const languages = ['英文', '中文', '日语'];
  const translateText = () => {
    if(isLoading) return;
    setTargetText('');
    setIsLoading(true);
    http.post<{
      translated_text: string
    }>('/translation/text', {
      text: originText,
      source_lang: originLanguage,
      target_lang: targetLanguage,
    }).then((res) => {
      setTargetText(res.translated_text);
    }).catch(() => {
      Toast.error('翻译失败')
    }).finally(() => {
      setIsLoading(false);
    })
  }
  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <p
        style={{
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        文本翻译
      </p>
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              marginBottom: 8,
            }}
          >
            <span>源语言：</span>
            <Select
              value={originLanguage}
              onChange={(e) => setOriginLanguage(e as string)}
              style={{
                width: 280,
              }}
              optionList={languages.map((el) => ({
                label: el,
                value: el,
              }))}
            />
          </div>
          <TextArea
            placeholder="请输入文本"
            onChange={(e) => setOriginText(e)}
            value={originText}
            style={{
              width: 470,
              height: 200,
              borderRadius: 12,
            }}
          />
        </div>
        <IconArrowRight />
        <div>
          <div
            style={{
              marginBottom: 8,
            }}
          >
            <span>目标语言：</span>
            <Select
              style={{
                width: 280,
              }}
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e as string)}
              optionList={languages.map((el) => ({
                label: el,
                value: el,
              }))}
            />
            <Button
              onClick={() => {popAdvertisement(); translateText()}}
              style={{
                marginLeft: 16,
                width: 72,
              }}
            >
              翻译
            </Button>
          </div>
          <TextArea
            value={targetText}
            placeholder={isLoading ? "翻译中" : "翻译结果"}
            
            style={{
              width: 470,
              height: 200,
              borderRadius: 12,
              fontSize: 18,
              color: 'red'
            }}
          />
        </div>
      </div>
    </div>
  );
};
