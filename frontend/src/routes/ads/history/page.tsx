import { http } from '@/utils/http';
import { Button, Table, Toast } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useEffect, useState } from 'react';

export default () => {
  const [list, setList] = useState<any[]>([])
  const columns = [
    {
      title: '下单时间',
      dataIndex: 'created_at',
    },
    {
      title: '消费金额(元)',
      dataIndex: 'amount',
    },
    {
      title: '投放次数',
      dataIndex: 'click_count'
    },
    {
      title: '目标广告标题',
      dataIndex: 'ad_title',
    },
    {
      title: '消费类型',
      dataIndex: 'consumption_type',
      render: (type: string) => {
        return type === 'new_ad' ? '投放新广告' : '广告充值'
      }
    },
    {
      title: '操作',
      render: () => <Button>开发票</Button>
    }
  ]
  const getList = () => {
    http.get<any>('/ad/consumption_records').then((res) => {
      setList(res.records)
    }).catch(() => {
      Toast.error('获取列表失败');
    })
  }
  useEffect(() => {
    getList();
  }, [])
  
  return (
    <div>
      <Title
        style={{
          fontSize: 24,
        }}
      >
        广告充值/投放记录
      </Title>
      <Table columns={columns} dataSource={list} />
    </div>
  );
};
