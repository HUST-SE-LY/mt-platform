import '@/routes/index.css';
import { Button, Form, Modal, Table, Toast, Upload } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useParams } from '@modern-js/runtime/router';
import { useEffect, useRef, useState } from 'react';
import { http } from '@/utils/http';

interface SingleTerm {
  id: string;
  source_term: string;
  target_term: string;
  description: string;
  created_at: string;
}

export default () => {
  const params = useParams();
  const [list, setList] = useState<SingleTerm[]>([]);
  const [loading, setLoading] = useState(false);
  const [termbaseInfo, setTermbaseInfo] = useState<any>(null);
  const editForm = useRef<any>();
  const addForm = useRef<any>();
  const [showAddModal, setShowAddModal] = useState(false);

  // 获取术语库详情
  const fetchTermbaseInfo = async () => {
    try {
      const response = await http.get(`/termbase/${params.id}`);
      setTermbaseInfo(response);
    } catch (error: any) {
      Toast.error({
        content: error.message || '获取术语库详情失败',
        duration: 3,
      });
    }
  };

  // 获取术语列表
  const fetchTerms = async () => {
    setLoading(true);
    try {
      const response = await http.get<SingleTerm[]>(
        `/termbase/${params.id}/terms`
      );
      setList(response || []);
    } catch (error: any) {
      Toast.error({
        content: error.message || '获取术语列表失败',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  // 添加术语
  const addTerm = async () => {
    try {
      const values = await addForm.current?.formApi.validate();

      await http.post(`/termbase/${params.id}/terms`, {
        source_term: values.source_term,
        target_term: values.target_term,
        description: values.description,
      });

      Toast.success({
        content: '添加成功',
        duration: 3,
      });

      setShowAddModal(false);
      addForm.current?.formApi.reset();
      fetchTerms();
    } catch (error: any) {
      Toast.error({
        content: error.message || '添加失败',
        duration: 3,
      });
    }
  };

  // 编辑术语
  const editSingleTerm = (id: string, data: SingleTerm) => {
    Modal.info({
      title: '编辑术语',
      content: (
        <Form ref={editForm} initValues={data}>
          <Form.Input
            field="source_term"
            label="源语言术语"
            rules={[
              {
                required: true,
                message: '请输入源语言术语',
              },
            ]}
          />
          <Form.Input
            field="target_term"
            label="目标语言术语"
            rules={[
              {
                required: true,
                message: '请输入目标语言术语',
              },
            ]}
          />
          <Form.Input field="description" label="附加说明" />
        </Form>
      ),
      onOk: async () => {
        try {
          const values = await editForm.current?.formApi.validate();

          await http.put(`/termbase/${params.id}/terms/${id}`, values);

          Toast.success({
            content: '更新成功',
            duration: 3,
          });

          fetchTerms();
        } catch (error: any) {
          Toast.error({
            content: error.message || '更新失败',
            duration: 3,
          });
        }
      },
    });
  };

  // 删除术语
  const deleteTerm = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个术语吗？此操作不可恢复。',
      onOk: async () => {
        try {
          await http.delete(`/termbase/${params.id}/terms/${id}`);

          Toast.success({
            content: '删除成功',
            duration: 3,
          });

          fetchTerms();
        } catch (error: any) {
          Toast.error({
            content: error.message || '删除失败',
            duration: 3,
          });
        }
      },
    });
  };

  // 添加导出函数
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/termbase/${params.id}/export`);
      if (!response.ok) throw new Error('导出失败');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `termbase_${params.id}.tbx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Toast.success({
        content: '导出成功',
        duration: 3,
      });
    } catch (error: any) {
      Toast.error({
        content: error.message || '导出失败',
        duration: 3,
      });
    }
  };

  const columns = [
    {
      title: '源语言术语',
      dataIndex: 'source_term',
    },
    {
      title: '目标语言术语',
      dataIndex: 'target_term',
    },
    {
      title: '附加说明',
      dataIndex: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (id: string, data: SingleTerm) => (
        <>
          <Button onClick={() => editSingleTerm(id, data)}>编辑</Button>
          <Button
            type="danger"
            style={{
              marginLeft: 8,
            }}
            onClick={() => deleteTerm(id)}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (params.id) {
      fetchTermbaseInfo();
      fetchTerms();
    }
  }, [params.id]);

  return (
    <div>
      <Title heading={3}>
        {termbaseInfo ? `术语库：${termbaseInfo.name}` : '术语库内容'}
      </Title>
      <div style={{ margin: '16px 0', display: 'flex', gap: 8 }}>
        <Button onClick={() => setShowAddModal(true)}>添加术语</Button>
        <Button onClick={() => handleExport()}>导出TBX</Button>
        <Upload
          action={`/api/termbase/${params.id}/import`}
          accept=".tbx"
          showUploadList={false}
          data={{}}
          name="file"
          onSuccess={(response) => {
            Toast.success({
              content: `导入成功，共导入 ${response.count} 条记录`,
              duration: 3,
            });
            fetchTerms();
          }}
          onError={(error) => {
            Toast.error({
              content: error.message || '导入失败',
              duration: 3,
            });
          }}
        >
          <Button>导入TBX</Button>
        </Upload>
      </div>
      <Table columns={columns} dataSource={list} loading={loading} />

      {/* 添加术语的模态框 */}
      <Modal
        title="添加术语"
        visible={showAddModal}
        onOk={addTerm}
        onCancel={() => {
          setShowAddModal(false);
          addForm.current?.formApi.reset();
        }}
        okText="提交"
      >
        <Form ref={addForm}>
          <Form.Input
            field="source_term"
            label="源语言术语"
            rules={[
              {
                required: true,
                message: '请输入源语言术语',
              },
            ]}
          />
          <Form.Input
            field="target_term"
            label="目标语言术语"
            rules={[
              {
                required: true,
                message: '请输入目标语言术语',
              },
            ]}
          />
          <Form.Input field="description" label="附加说明" />
        </Form>
      </Modal>
    </div>
  );
};
