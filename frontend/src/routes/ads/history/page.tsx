import { Button, Table } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';

export default () => {
  const columns = [
    {
      title: '下单时间',
      dataIndex: 'time',
    },
    {
      title: '消费金额(元)',
      dataIndex: 'spent',
    },
    {
      title: '投放次数',
      dataIndex: 'clickTimes'
    },
    {
      title: '目标广告标题',
      dataIndex: 'title',
    },
    {
      title: '消费类型',
      dataIndex: 'type',
      render: (type: string) => {
        return type === 'new' ? '投放新广告' : '广告充值'
      }
    },
    {
      title: '操作',
      render: () => <Button>开发票</Button>
    }
  ]
  const data = [
    {
      time: '2025-3-12 20:46:11',
      clickTimes: 10,
      spent: 20,
      type: 'new',
      title: '更好用的聊天软件'
    }
  ]
  return (
    <div>
      <Title
        style={{
          fontSize: 24,
        }}
      >
        广告充值/投放记录
      </Title>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};
