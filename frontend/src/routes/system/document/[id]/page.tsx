import { useEffect, useState } from 'react';
import { useParams } from '@modern-js/runtime/router';
import { Table, Toast, Typography, Tag } from '@douyinfe/semi-ui';
import { http } from '@/utils/http';
import SegmentView from './components/TranslationEditor';

interface Term {
  term: string;
  start: number;
  end: number;
  target: string;
  description: string;
  termbase_id: string;
}

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
    terms?: Term[];
  }>;
}

const { Title } = Typography;

// 添加文本段状态映射
const segmentStatusMap: Record<string, string> = {
  pending: '待翻译',
  translating: '翻译中',
  completed: '初译完成',
  error: '翻译失败',
  reviewed: '已审核',
  confirmed: '已确认',
};

// 添加状态对应的颜色
const segmentStatusColorMap: Record<
  string,
  'blue' | 'amber' | 'green' | 'red' | 'grey'
> = {
  pending: 'grey',
  translating: 'amber',
  completed: 'blue', // 初译完成用蓝色
  error: 'red',
  reviewed: 'amber', // 已审核用琥珀色
  confirmed: 'green', // 已确认用绿色
};

export default () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [docInfo, setDocInfo] = useState<DocumentInfo>();

  const fetchDocumentInfo = async () => {
    setLoading(true);
    try {
      const response = await http.get<DocumentInfo>(`/project/documents/${id}`);
      setDocInfo(response);
    } catch (error: any) {
      Toast.error({
        content: error.message || '获取文档详情失败',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDocumentInfo();
    }
  }, [id]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'sequence',
      width: 80,
    },
    {
      title: '原文',
      dataIndex: 'source_text',
      width: '45%',
      render: (text: string, record: DocumentInfo['segments'][0]) => (
        <SegmentView sourceText={text} terms={record.terms || []} />
      ),
    },
    {
      title: '译文',
      dataIndex: 'target_text',
      width: '45%',
      render: (text: string | null) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={segmentStatusColorMap[status] || 'default'}>
          {segmentStatusMap[status] || status}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title heading={4} style={{ marginBottom: 24 }}>
        {docInfo?.name}
      </Title>
      <Table
        columns={columns}
        dataSource={docInfo?.segments || []}
        loading={loading}
        pagination={{
          pageSize: 20,
        }}
        scroll={{ y: 'calc(100vh - 200px)' }}
      />
    </div>
  );
};
