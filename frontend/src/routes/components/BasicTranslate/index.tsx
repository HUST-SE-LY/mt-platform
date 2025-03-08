import { popAdvertisement } from '@/utils/popAdvertisement';
import { IconArrowRight } from '@douyinfe/semi-icons';
import { Button, Select, TextArea } from '@douyinfe/semi-ui';
import { useState } from 'react';
export const BasicTranslate = () => {
  const [originLanguage, setOriginLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Chinese');
  const [originText, setOriginText] = useState('');
  const [targetText, setTargetText] = useState('21212121212');
  const languages = [
    {
      label: '英语',
      value: 'English',
    },
    {
      label: '中文',
      value: 'Chinese',
    },
  ];
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
              optionList={languages}
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
              optionList={languages}
            />
            <Button onClick={() => popAdvertisement()} style={{
              marginLeft: 16,
              width: 72
            }}>翻译</Button>
          </div>
          <TextArea
            value={targetText}
            placeholder="翻译结果"
            disabled
            style={{
              width: 470,
              height: 200,
              borderRadius: 12,
              fontSize: 18,
              color: 'gray',
            }}
          />
        </div>
      </div>
    </div>
  );
};
