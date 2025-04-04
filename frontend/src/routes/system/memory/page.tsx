import { Button, Form, Modal, Table, Toast } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useNavigate } from '@modern-js/runtime/router';
import { useEffect, useRef, useState } from 'react';
import { http } from '@/utils/http';

interface Memory {
  id: string;
  name: string;
  source_lang: string;
  target_lang: string;
  tags: string[];
  entry_count: number;
}

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

export default () => {
  const [data, setData] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const form = useRef<any>();
  const nav = useNavigate();

  // 获取记忆库列表
  const fetchMemories = async () => {
    setLoading(true);
    try {
      const response = await http.get<any>('/translation_memory');
      setData(response || []);
    } catch (error: any) {
      Toast.error({
        content: error.message || '获取记忆库列表失败',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  // 创建记忆库
  const createMemory = async () => {
    try {
      const values = await form.current?.formApi.validate();

      const response = await http.post('/translation_memory', {
        name: values.name,
        source_lang: values.sourceLang,
        target_lang: values.targetLang,
        tags: values.tags || [],
      });

      Toast.success({
        content: '创建记忆库成功',
        duration: 3,
      });

      setShowNew(false);
      fetchMemories(); // 刷新列表
    } catch (error: any) {
      Toast.error({
        content: error.message || '创建记忆库失败',
        duration: 3,
      });
    }
  };

  // 删除记忆库
  const deleteMemory = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个记忆库吗？此操作不可恢复。',
      onOk: async () => {
        try {
          await http.delete(`/translation_memory/${id}`);
          Toast.success({
            content: '删除成功',
            duration: 3,
          });
          fetchMemories(); // 刷新列表
        } catch (error: any) {
          Toast.error({
            content: error.message || '删除失败',
            duration: 3,
          });
        }
      },
    });
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '源语言',
      dataIndex: 'source_lang',
      render: (lang: string) => {
        const option = languageOptions.find((opt) => opt.value === lang);
        return option ? option.label : lang;
      },
    },
    {
      title: '目标语言',
      dataIndex: 'target_lang',
      render: (lang: string) => {
        const option = languageOptions.find((opt) => opt.value === lang);
        return option ? option.label : lang;
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (tags: string[]) => tags.join(', '),
    },
    {
      title: '条目数量',
      dataIndex: 'entry_count',
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (id: string) => {
        return (
          <>
            <Button onClick={() => nav(`${id}`)}>查看</Button>
            <Button
              type="danger"
              style={{
                marginLeft: 8,
              }}
              onClick={() => deleteMemory(id)}
            >
              删除
            </Button>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    fetchMemories();
  }, []);

  return (
    <div>
      <Title heading={3}>记忆库</Title>
      <Button
        onClick={() => setShowNew(true)}
        style={{
          margin: '16px 0',
        }}
      >
        新建
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 10,
        }}
      />
      <Modal
        onCancel={() => setShowNew(false)}
        onOk={createMemory}
        okText="提交"
        title="新建记忆库"
        visible={showNew}
      >
        <Form ref={form}>
          <Form.Input
            label="记忆库名称"
            field="name"
            rules={[
              {
                required: true,
                message: '请输入记忆库名称',
              },
            ]}
          />
          <Form.Select
            style={{
              width: '100%',
            }}
            label="源语言"
            field="sourceLang"
            optionList={languageOptions}
            rules={[
              {
                required: true,
                message: '请选择源语言',
              },
            ]}
          />
          <Form.Select
            style={{
              width: '100%',
            }}
            label="目标语言"
            field="targetLang"
            optionList={languageOptions}
            rules={[
              {
                required: true,
                message: '请选择目标语言',
              },
              {
                validator: (rule, value, callback) => {
                  const sourceLang =
                    form.current?.formApi.getValue('sourceLang');
                  if (value === sourceLang) {
                    callback('源语言和目标语言不能相同');
                    return false
                  } else {
                    callback();
                    return true
                  }
                },
              },
            ]}
          />
          <Form.TagInput
            style={{
              width: '100%',
            }}
            label="标签"
            field="tags"
            placeholder="输入标签后按回车添加"
          />
        </Form>
      </Modal>
    </div>
  );
};
