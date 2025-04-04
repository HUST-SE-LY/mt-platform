import '@/routes/index.css';
import { Button, Form, Toast } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useEffect, useRef, useState } from 'react';
import { http } from '@/utils/http';
import { useNavigate } from '@modern-js/runtime/router';

// 语言选项
const languageOptions = [
  { label: '中文', value: 'zh' },
  { label: '英文', value: 'en' },
  { label: '日文', value: 'ja' },
  { label: '韩文', value: 'ko' },
  { label: '法文', value: 'fr' },
  { label: '德文', value: 'de' },
  { label: '西班牙文', value: 'es' },
  { label: '俄文', value: 'ru' },
];

interface Resource {
  id: string;
  name: string;
  source_lang: string;
  target_lang: string;
}

export default () => {
  const [memories, setMemories] = useState<Resource[]>([]);
  const [termbases, setTermbases] = useState<Resource[]>([]);
  const form = useRef<any>();
  const nav = useNavigate();

  // 获取可用的记忆库和术语库
  const fetchResources = async () => {
    try {
      const response = await http.get<any>('/project/resources');
      setMemories(response.memories || []);
      setTermbases(response.termbases || []);
    } catch (error: any) {
      Toast.error({
        content: error.message || '获取资源失败',
        duration: 3,
      });
    }
  };

  // 创建项目
  const handleSubmit = async (values: any) => {
    try {
      await http.post('/project', {
        name: values.name,
        source_lang: values.sourceLang,
        target_lang: values.targetLang,
        memory_ids: values.memories || [],
        termbase_ids: values.termbases || [],
        description: values.description,
      });

      Toast.success({
        content: '项目创建成功',
        duration: 3,
      });

      nav('/system/project');
    } catch (error: any) {
      Toast.error({
        content: error.message || '创建项目失败',
        duration: 3,
      });
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div>
      <Title heading={3}>新建翻译项目</Title>
      <Form
        ref={form}
        onSubmit={handleSubmit}
        labelWidth={96}
        labelPosition="left"
        style={{
          maxWidth: 800,
          padding: 24,
        }}
      >
        <Form.Input
          field="name"
          label="项目名称"
          rules={[
            {
              required: true,
              message: '请输入项目名称',
            },
          ]}
        />
        <Form.Select
          field="sourceLang"
          label="源语言"
          optionList={languageOptions}
          style={{ width: 280 }}
          rules={[
            {
              required: true,
              message: '请选择源语言',
            },
          ]}
        />
        <Form.Select
          field="targetLang"
          label="目标语言"
          optionList={languageOptions}
          style={{ width: 280 }}
          rules={[
            {
              required: true,
              message: '请选择目标语言',
            },
            {
              validator: (rule, value, callback) => {
                const sourceLang = form.current?.formApi.getValue('sourceLang');
                if (value === sourceLang) {
                  callback('源语言和目标语言不能相同');
                  return false;
                }
                callback();
                return true;
              },
            },
          ]}
        />
        <Form.Select
          field="memories"
          label="记忆库"
          multiple
          style={{ width: 280 }}
          optionList={memories.map((m) => ({
            label: `${m.name} (${m.source_lang}-${m.target_lang})`,
            value: m.id,
          }))}
          placeholder="可选择多个，按顺序排列优先级"
        />
        <Form.Select
          field="termbases"
          label="术语库"
          style={{ width: 280 }}
          multiple
          optionList={termbases.map((t) => ({
            label: `${t.name} (${t.source_lang}-${t.target_lang})`,
            value: t.id,
          }))}
          placeholder="可选择多个，按顺序排列优先级"
        />
        <Form.TextArea field="description" label="备注" placeholder="可选填" />
        <div style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">
            创建项目
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => nav('/system/project')}
          >
            取消
          </Button>
        </div>
      </Form>
    </div>
  );
};
