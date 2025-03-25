import { Button, Form, Modal, Table } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useNavigate } from '@modern-js/runtime/router';
import { useEffect, useRef, useState } from 'react';

interface Term {
  id: number;
  title: string;
  originLanguage: string;
  targetLanguage: string;
  tag: string[];
  num: number;
}

export default () => {
  const [data, setData] = useState<Term[]>([]);
  const [showNew, setShowNew] = useState(false);
  const form = useRef<any>();
  const nav = useNavigate();
  const columns = [
    {
      title: '名称',
      dataIndex: 'title',
    },
    {
      title: '源语言',
      dataIndex: 'originLanguage',
    },
    {
      title: '目标语言',
      dataIndex: 'targetLanguage',
    },
    {
      title: '标签',
      dataIndex: 'tag',
    },
    {
      title: '条目数量',
      dataIndex: 'num',
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (data: string) => {
        console.log(data)
        return (
          <>
            <Button onClick={() => nav(`${data}`)}>查看</Button>
            <Button
              type="danger"
              style={{
                marginLeft: 8,
              }}
            >
              删除
            </Button>
            <Button
              style={{
                marginLeft: 8,
              }}
            >
              导入
            </Button>
            <Button
              style={{
                marginLeft: 8,
              }}
            >
              导出
            </Button>
          </>
        );
      },
    },
  ];
  const createTerm = () => {
    form.current?.formApi.validate().then(() => {
      
    })
  }
  useEffect(() => {
    setData([
      {
        id: 1,
        title: '计算机知识',
        originLanguage: '中文',
        targetLanguage: '英文',
        tag: ['计算机', '操作系统'],
        num: 9999,
      },
      {
        id: 2,
        title: '计算机知识',
        originLanguage: '中文',
        targetLanguage: '英文',
        tag: ['计算机', '操作系统'],
        num: 9999,
      },
      {
        id: 3,
        title: '计算机知识',
        originLanguage: '中文',
        targetLanguage: '英文',
        tag: ['计算机', '操作系统'],
        num: 9999,
      },
    ]);
  }, []);
  return (
    <div>
      <Title heading={3}>术语库</Title>
      <Button
        onClick={() => setShowNew(true)}
        style={{
          margin: '16px 0',
        }}
      >
        新建
      </Button>
      <Table columns={columns} dataSource={data} />
      <Modal onCancel={() => setShowNew(false)} onOk={createTerm} okText='提交' title="新建术语库" visible={showNew}>
        <Form ref={form}>
          <Form.Input
            label="术语库名称"
            field="name"
            rules={[
              {
                required: true,
                message: '请输入必填项',
              },
            ]}
          />
          <Form.Select
            style={{
              width: '100%',
            }}
            label="源语言"
            field="originLanguage"
            rules={[
              {
                required: true,
                message: '请选择',
              },
            ]}
          />
          <Form.Select
            style={{
              width: '100%',
            }}
            label="目标语言"
            field="targetLanguage"
            rules={[
              {
                required: true,
                message: '请选择',
              },
            ]}
          />
          <Form.TagInput
            style={{
              width: '100%',
            }}
            label="标签"
            field="tag"
            rules={[
              {
                required: true,
                message: '输入',
              },
            ]}
          />
        </Form>
      </Modal>
    </div>
  );
};