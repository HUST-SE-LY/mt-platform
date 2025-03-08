import { AdsStatusEnum } from '@/consts';
import { Button, Image } from '@douyinfe/semi-ui';
import Table from '@douyinfe/semi-ui/lib/es/table/Table';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { AdsStatus } from './components/AdsStatus';
import { useState } from 'react';

export default () => {
  const [currentPage, setCurrentPage] = useState(1);
  const data = [
    {
      imgUrl: 'https://w.wallhaven.cc/full/3l/wallhaven-3lv8j6.jpg',
      title: '更好用的聊天软件',
      target: 'https://web.telegram.org/',
      clickTimes: 20,
      spent: 200,
      status: AdsStatusEnum.Normal,
    },
    {
      imgUrl: 'https://w.wallhaven.cc/full/3l/wallhaven-3lv8j6.jpg',
      title: '更好用的聊天软件11',
      target: 'https://web.telegram.org/',
      clickTimes: 20,
      spent: 200,
      status: AdsStatusEnum.Illegal,
    },
  ];
  const columns = [
    {
      title: '广告标题',
      dataIndex: 'title',
    },
    {
      title: '广告图片',
      dataIndex: 'imgUrl',
      render: (imgUrl: string) => {
        return <Image width={80} height={60} src={imgUrl} preview />;
      },
    },
    {
      title: '广告跳转链接',
      dataIndex: 'target',
      render: (target: string) => (
        <a href={target} target="_blank">
          {target}
        </a>
      ),
    },
    {
      title: '剩余点击次数',
      dataIndex: 'clickTimes',
    },
    {
      title: '累计消费',
      dataIndex: 'spent',
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      render: (data: AdsStatusEnum) => {
        return <AdsStatus status={data} />;
      },
    },
    {
      title: '操作',
      render: () => (
        <div
          style={{
            display: 'flex',
            gap: 8,
          }}
        >
          <Button>充值</Button>
          <Button type="warning">暂停展示</Button>
          <Button type="danger">删除</Button>
        </div>
      ),
    },
  ];
  const handlePageChange = async () => {
    
  }
  return (
    <div>
      <Title
        style={{
          fontSize: 24,
        }}
      >
        我的广告
      </Title>
      <Table
        pagination={{
          currentPage,
          pageSize: 5,
          total: data.length,
          onPageChange: handlePageChange,
        }}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};
