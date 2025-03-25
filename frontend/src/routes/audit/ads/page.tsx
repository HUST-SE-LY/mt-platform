import { Button, Image, Table, Toast } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useEffect, useState } from 'react';
import { http } from '@/utils/http';
import '@/routes/index.css';

interface AdInfo {
  id: string;
  title: string;
  redirect_url: string;
  image_url: string;
  user_name: string;
  company_name: string;
}

export default () => {
  const [ads, setAds] = useState<AdInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingAds = async () => {
    setLoading(true);
    try {
      const response = await http.get<any>('/ad/pending_ads');
      setAds(response.ads);
    } catch (error) {
      Toast.error('获取待审核广告失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAds();
  }, []);

  const handleAudit = async (adId: string, action: 'approve' | 'reject') => {
    try {
      await http.post(`/ad/audit_ad/${adId}`, { action });
      Toast.success(`已${action === 'approve' ? '通过' : '拒绝'}该广告`);
      fetchPendingAds(); // 刷新列表
    } catch (error) {
      Toast.error('操作失败');
    }
  };

  const columns = [
    {
      title: '广告标题',
      dataIndex: 'title',
    },
    {
      title: '广告图片',
      dataIndex: 'image_url',
      render: (imgUrl: string) => (
        <Image width={80} height={60} src={imgUrl} preview />
      ),
    },
    {
      title: '跳转链接',
      dataIndex: 'redirect_url',
      render: (url: string) => (
        <a href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: '广告主',
      dataIndex: 'user_name',
    },
    {
      title: '所属企业',
      dataIndex: 'company_name',
    },
    {
      title: '操作',
      render: (_: any, record: AdInfo) => (
        <>
          <Button 
            type="primary" 
            style={{ marginRight: 8 }}
            onClick={() => handleAudit(record.id, 'approve')}
          >
            通过
          </Button>
          <Button 
            type="danger"
            onClick={() => handleAudit(record.id, 'reject')}
          >
            拒绝
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Title heading={3}>待审核广告</Title>
      <Table
        columns={columns}
        dataSource={ads}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};