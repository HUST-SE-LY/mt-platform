import { AdsStatusEnum } from '@/consts';
import { Button, Image, InputNumber, Modal, Toast } from '@douyinfe/semi-ui';
import Table from '@douyinfe/semi-ui/lib/es/table/Table';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { AdsStatus } from './components/AdsStatus';
import { useEffect, useState } from 'react';
import { http } from '@/utils/http';

export default () => {
  const [list, setList] = useState<any[]>([]);
  const [chargeTimes, setChargeTimes] = useState(1);
  const [currentAd, setCurrentAd] = useState('');
  const [showCharge, setShowCharge] = useState(false);
  const handlePauseAd = async (adId: string) => {
    try {
      await http.post(`/ad/pause_ad/${adId}`);
      Toast.success('广告已暂停');
      getList(); // 刷新列表
    } catch (error) {
      Toast.error('操作失败');
    }
  };
  const handleResumeAd = async (adId: string) => {
    try {
      await http.post(`/ad/resume_ad/${adId}`);
      Toast.success('广告已恢复');
      getList(); // 刷新列表
    } catch (error) {
      Toast.error('操作失败');
    }
  };
  const handleChargeAd = async () => {
    try {
      const amount = chargeTimes * 2; // 每次两元
      await http.post(`/ad/recharge_ad/${currentAd}`, { 
        amount,
        times: chargeTimes 
      });
      Toast.success('充值成功');
      setShowCharge(false);
      getList(); // 刷新列表
    } catch (error) {
      Toast.error('充值失败');
    }
  }
  const columns = [
    {
      title: '广告标题',
      dataIndex: 'title',
    },
    {
      title: '广告图片',
      dataIndex: 'image_url',
      render: (imgUrl: string) => {
        return <Image width={80} height={60} src={imgUrl} preview />;
      },
    },
    {
      title: '广告跳转链接',
      dataIndex: 'redirect_url',
      render: (target: string) => (
        <a href={target} target="_blank">
          {target}
        </a>
      ),
    },
    {
      title: '剩余点击次数',
      dataIndex: 'remaining_clicks',
    },
    {
      title: '累计消费',
      dataIndex: 'total_spent',
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
      render: (data: any) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {data.status === AdsStatusEnum.Normal && (
            <>
              <Button onClick={() => handlePauseAd(data.id)}>暂停</Button>
              <Button onClick={() => {
                setShowCharge(true)
                setCurrentAd(data.id)
              }}>充值</Button>
            </>
          )}
          {data.status === AdsStatusEnum.Stop && (
            <Button onClick={() => handleResumeAd(data.id)}>恢复</Button>
          )}
          <Button type="danger" onClick={() => deleteAds(data.id)}>删除</Button>
        </div>
      ),
    },
  ];
  const getList = () => {
    http.get<any>('/ad/list').then((res) => {
      setList(res.ads);
    });
  };
  const deleteAds = (id: string) => {
    http.delete(`/ad/delete/${id}`).then(() => {
      Toast.success('删除广告成功');
    }).catch(() => {
      Toast.error('删除广告失败')
    })
  }
  useEffect(() => {
    getList();
  }, []);
  return (
    <div>
      <Title
        style={{
          fontSize: 24,
        }}
      >
        我的广告
      </Title>
      <Table columns={columns} dataSource={list} />
      <Modal onOk={handleChargeAd} visible={showCharge} onCancel={() => setShowCharge(false)}  title="输入投放次数(一次两元)">
        <InputNumber precision={0} hideButtons min={1} value={chargeTimes} onChange={(num) => setChargeTimes(Number(num))} />
      </Modal>
    </div>
  );
};
