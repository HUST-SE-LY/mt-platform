import '@/routes/index.css';
import { Button, Form, Modal, Table, Toast, Upload } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useParams } from '@modern-js/runtime/router';
import { useEffect, useRef, useState } from 'react';
import { http } from '@/utils/http';

interface SingleMemory {
  id: string;
  source_text: string;
  target_text: string;
  created_at?: string;
}

export default () => {
  const params = useParams();
  const [list, setList] = useState<SingleMemory[]>([]);
  const [loading, setLoading] = useState(false);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const editForm = useRef<any>();
  const addForm = useRef<any>();
  const [showAddModal, setShowAddModal] = useState(false);

  // 获取记忆库详情
  const fetchMemoryInfo = async () => {
    try {
      const response = await http.get(`/translation_memory/${params.id}`);
      setMemoryInfo(response);
    } catch (error: any) {
      Toast.error({
        content: error.message || '获取记忆库详情失败',
        duration: 3,
      });
    }
  };

  // 获取记忆库条目
  const fetchMemoryEntries = async () => {
    setLoading(true);
    try {
      const response = await http.get<any>(
        `/translation_memory/${params.id}/entries`
      );
      setList(response || []);
    } catch (error: any) {
      Toast.error({
        content: error.message || '获取记忆库条目失败',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  // 添加记忆对
  const addMemoryEntry = async () => {
    try {
      const values = await addForm.current?.formApi.validate();

      await http.post(`/translation_memory/${params.id}/entries`, {
        source_text: values.source_text,
        target_text: values.target_text,
      });

      Toast.success({
        content: '添加成功',
        duration: 3,
      });

      setShowAddModal(false);
      addForm.current?.formApi.reset();
      fetchMemoryEntries(); // 刷新列表
    } catch (error: any) {
      Toast.error({
        content: error.message || '添加失败',
        duration: 3,
      });
    }
  };

  // 编辑记忆对
  const editSingleMemory = (id: string, data: SingleMemory) => {
    Modal.info({
      title: '编辑单条内容',
      content: (
        <>
          <Form ref={editForm} initValues={data}>
            <Form.Input
              field="source_text"
              label="源语言"
              rules={[
                {
                  required: true,
                  message: '请输入必填项',
                },
              ]}
            />
            <Form.Input
              field="target_text"
              label="目标语言"
              rules={[
                {
                  required: true,
                  message: '请输入必填项',
                },
              ]}
            />
          </Form>
        </>
      ),
      onOk: async () => {
        try {
          const values = await editForm.current?.formApi.validate();

          await http.put(`/translation_memory/${params.id}/entries/${id}`, {
            source_text: values.source_text,
            target_text: values.target_text,
          });

          Toast.success({
            content: '更新成功',
            duration: 3,
          });

          fetchMemoryEntries(); // 刷新列表
        } catch (error: any) {
          Toast.error({
            content: error.message || '更新失败',
            duration: 3,
          });
        }
      },
    });
  };

  // 删除记忆对
  const deleteMemoryEntry = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记忆对吗？此操作不可恢复。',
      onOk: async () => {
        try {
          await http.delete(`/translation_memory/${params.id}/entries/${id}`);

          Toast.success({
            content: '删除成功',
            duration: 3,
          });

          fetchMemoryEntries(); // 刷新列表
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
      title: '源语言',
      dataIndex: 'source_text',
    },
    {
      title: '目标语言',
      dataIndex: 'target_text',
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (id: string, data: SingleMemory) => {
        return (
          <>
            <Button onClick={() => editSingleMemory(id, data)}>编辑</Button>
            <Button
              type="danger"
              style={{
                marginLeft: 8,
              }}
              onClick={() => deleteMemoryEntry(id)}
            >
              删除
            </Button>
          </>
        );
      },
    },
  ];

  // 添加导出函数
  const handleExport = async () => {
    try {
      // 使用fetch直接下载文件
      const response = await fetch(
        `/api/translation_memory/${params.id}/export`
      );
      if (!response.ok) throw new Error('导出失败');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memory_${params.id}.tmx`;
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

  useEffect(() => {
    if (params.id) {
      fetchMemoryInfo();
      fetchMemoryEntries();
    }
  }, [params.id]);

  return (
    <div>
      <Title heading={3}>
        {memoryInfo ? `记忆库：${memoryInfo.name}` : '记忆库内容'}
      </Title>
      <div style={{ margin: '16px 0', display: 'flex', gap: 8 }}>
        <Button onClick={() => setShowAddModal(true)}>添加记忆对</Button>
        <Button onClick={() => handleExport()}>导出TMX</Button>
        <Upload
          action={`/api/translation_memory/${params.id}/import`}
          accept=".tmx"
          showUploadList={false}
          data={
            {
              // 如果需要额外的表单数据可以在这里添加
            }
          }
          name="file"
          onSuccess={(response) => {
            Toast.success({
              content: `导入成功，共导入 ${response.count} 条记录`,
              duration: 3,
            });
            fetchMemoryEntries();
          }}
          onError={(error) => {
            Toast.error({
              content: error.message || '导入失败',
              duration: 3,
            });
          }}
        >
          <Button>导入TMX</Button>
        </Upload>
      </div>
      <Table columns={columns} dataSource={list} loading={loading} />

      {/* 添加记忆对的模态框 */}
      <Modal
        title="添加记忆对"
        visible={showAddModal}
        onOk={addMemoryEntry}
        onCancel={() => {
          setShowAddModal(false);
          addForm.current?.formApi.reset();
        }}
        okText="提交"
      >
        <Form ref={addForm}>
          <Form.Input
            field="source_text"
            label="源语言"
            rules={[
              {
                required: true,
                message: '请输入源语言文本',
              },
            ]}
          />
          <Form.Input
            field="target_text"
            label="目标语言"
            rules={[
              {
                required: true,
                message: '请输入目标语言文本',
              },
            ]}
          />
        </Form>
      </Modal>
    </div>
  );
};
