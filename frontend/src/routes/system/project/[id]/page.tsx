import '@/routes/index.css';
import {
  Button,
  Descriptions,
  Table,
  Toast,
  Tag,
  Upload,
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useNavigate, useParams } from '@modern-js/runtime/router';
import { useEffect, useMemo, useState } from 'react';
import { http } from '@/utils/http';

interface ProjectInfo {
  id: string;
  name: string;
  source_lang: string;
  target_lang: string;
  description?: string;
  created_at: string;
  creator?: string;
  doc_count: number;
  memories: Array<{
    id: string;
    name: string;
    priority: number;
  }>;
  termbases: Array<{
    id: string;
    name: string;
    priority: number;
  }>;
  documents: Array<{
    id: string;
    name: string;
    size: number;
    status: string;
    created_at: string;
    creator?: string;
  }>;
}

interface DocInfo {
  id: string;
  name: string;
  size: number;
  status: string;
  created_at: string;
  creator?: string;
}

// 语言选项映射
const languageMap: Record<string, string> = {
  zh: '中文',
  en: '英文',
  ja: '日文',
  ko: '韩文',
  fr: '法文',
  de: '德文',
  es: '西班牙文',
  ru: '俄文',
};

// 状态映射
const statusMap: Record<string, string> = {
  pending: '待翻译',
  translating: '翻译中',
  completed: '已完成',
  error: '翻译失败',
  processing: '处理中',
};

// 状态对应的颜色
const statusColorMap: Record<
  string,
  'blue' | 'amber' | 'green' | 'red' | 'grey'
> = {
  pending: 'grey',
  translating: 'amber',
  completed: 'green',
  error: 'red',
  processing: 'blue',
};

// 添加文档详情接口定义
interface DocumentInfo {
  id: string;
  name: string;
  status: string;
  created_at: string;
  segments: Array<{
    id: string;
    sequence: number;
    source_text: string;
    target_text: string | null;
    status: string;
  }>;
}

export default () => {
  const [basicInfo, setBasicInfo] = useState<ProjectInfo>();
  const [docList, setDocList] = useState<DocInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const nav = useNavigate();

  // 添加翻译进度的状态
  const [translatingDocId, setTranslatingDocId] = useState<string | null>(null);
  const [translationProgress, setTranslationProgress] = useState(0);

  // 获取项目详情
  const fetchProjectInfo = async () => {
    setLoading(true);
    try {
      const response = await http.get<ProjectInfo>(`/project/${id}`);
      setBasicInfo(response);
      setDocList(response.documents || []);
    } catch (error: any) {
      Toast.error({
        content: error.message || '获取项目详情失败',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const descInfo = useMemo(() => {
    if (!basicInfo) return [];

    const {
      name,
      source_lang,
      target_lang,
      doc_count,
      creator,
      description,
      memories,
      termbases,
    } = basicInfo;

    return [
      {
        key: '项目名称',
        value: name,
      },
      {
        key: '源语言',
        value: languageMap[source_lang] || source_lang,
      },
      {
        key: '目标语言',
        value: languageMap[target_lang] || target_lang,
      },
      {
        key: '文档数',
        value: doc_count,
      },
      {
        key: '创建人',
        value: creator || '-',
      },
      {
        key: '备注',
        value: description || '-',
      },
      {
        key: '记忆库',
        value: memories.length ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {memories.map((memory) => (
              <Tag
                key={memory.id}
                color="blue"
                type="light"
                style={{ cursor: 'pointer' }}
                onClick={() => nav(`/system/memory/${memory.id}`)}
              >
                {memory.name}
              </Tag>
            ))}
          </div>
        ) : (
          '-'
        ),
      },
      {
        key: '术语库',
        value: termbases.length ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {termbases.map((termbase) => (
              <Tag
                key={termbase.id}
                color="green"
                type="light"
                style={{ cursor: 'pointer' }}
                onClick={() => nav(`/system/term/${termbase.id}`)}
              >
                {termbase.name}
              </Tag>
            ))}
          </div>
        ) : (
          '-'
        ),
      },
    ];
  }, [basicInfo, nav]);

  const columns = [
    {
      title: '文档名',
      dataIndex: 'name',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      render: (text: string) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '大小',
      dataIndex: 'size',
      render: (size: number) => `${size}KB`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>
          {statusMap[status] || status}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (id: string, record: DocInfo) => (
        <>
          <Button onClick={() => nav(`/system/document/${id}`)}>查看</Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => handleTranslate(id)}
            loading={id === translatingDocId}
            disabled={
              record.status === 'completed' || record.status === 'translating'
            }
            type={record.status === 'error' ? 'warning' : 'primary'}
          >
            {id === translatingDocId
              ? `翻译中 ${translationProgress}%`
              : record.status === 'error'
              ? '重新翻译'
              : 'AI初译'}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => handleExport(id)}>
            导出
          </Button>
          <Button
            type="danger"
            style={{ marginLeft: 8 }}
            onClick={() => handleDelete(id)}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (id) {
      fetchProjectInfo();
    }
  }, [id]);

  const handleExport = async (id: string) => {
    // TODO: 实现文档导出功能
    Toast.info('文档导出功能开发中');
  };

  const handleDelete = async (id: string) => {
    // TODO: 实现文档删除功能
    Toast.info('文档删除功能开发中');
  };

  // 修改翻译处理函数
  const handleTranslate = async (id: string) => {
    let eventSource: EventSource | null = null;

    try {
      setTranslatingDocId(id);
      setTranslationProgress(0);

      // 创建 EventSource 开始监听进度
      eventSource = new EventSource(
        `${http.getBaseUrl()}/project/documents/${id}/translate/progress`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setTranslationProgress(data.progress);

        if (data.status !== 'translating') {
          eventSource?.close();
          setTranslatingDocId(null);
          fetchProjectInfo(); // 刷新文档列表

          Toast.success({
            content: `翻译任务完成，共 ${data.total} 个段落，成功 ${data.success} 个，失败 ${data.error} 个`,
            duration: 3,
          });
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
        setTranslatingDocId(null);
        fetchProjectInfo(); // 刷新文档列表
        Toast.error({
          content: '获取翻译进度失败',
          duration: 3,
        });
      };

      // 启动翻译任务
      await http.post<any>(`/project/documents/${id}/translate`);
    } catch (error: any) {
      eventSource?.close();
      setTranslatingDocId(null);
      fetchProjectInfo();
      Toast.error({
        content: error.message || '翻译任务失败',
        duration: 3,
      });
    }

    // 添加清理函数
    return () => {
      if (eventSource) {
        eventSource.close();
        fetchProjectInfo();
      }
    };
  };

  return (
    <div>
      <Title
        heading={4}
        style={{
          marginBottom: 16,
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        基本信息
      </Title>
      <Descriptions data={descInfo} />
      <Title
        heading={4}
        style={{
          marginBottom: 16,
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        文档列表
      </Title>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Upload
          action={`/api/project/${id}/documents`}
          accept=".txt,.docx,.pdf"
          showUploadList={false}
          data={{}}
          name="file"
          headers={{
            Authorization: localStorage.getItem('token') || '',
          }}
          maxSize={50 * 1024 * 1024}
          customRequest={({ fileInstance, onSuccess, onError }) => {
            const formData = new FormData();
            formData.append('file', fileInstance);

            http
              .postFormData(`/project/${id}/documents`, formData)
              .then((response) => {
                onSuccess(response);
              })
              .catch((error) => {
                onError(error);
              });
          }}
          onSuccess={(response) => {
            Toast.success({
              content: `文档上传成功，共 ${response.segment_count} 个段落`,
              duration: 3,
            });
            fetchProjectInfo();
          }}
          onError={(error) => {
            Toast.error({
              content: error.message || '上传失败',
              duration: 3,
            });
          }}
        >
          <Button>上传文档</Button>
        </Upload>
      </div>
      <Table
        columns={columns}
        dataSource={docList}
        loading={loading}
        pagination={{
          pageSize: 10,
        }}
        style={{
          backgroundColor: 'var(--semi-color-bg-2)',
          borderRadius: 8,
        }}
      />
    </div>
  );
};
