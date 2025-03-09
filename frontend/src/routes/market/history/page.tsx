import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useState } from 'react';
import { NeedInfo } from '../home/page';
import { SingleNeed } from '../components/SingleNeed';
import { NeedStatus } from '@/consts';

export default () => {
  const [needs, setNeeds] = useState<NeedInfo[]>([{
    id: '1',
    title: '测试需求',
    author: '用户名',
    price: 99,
    status: NeedStatus.processing,
    desc: '你好，这是一个测试需求，我想让您翻译一段文本，信守承诺',
  },
  {
    id: '1',
    title: '测试需求',
    author: '用户名',
    price: 99,
    status: NeedStatus.processing,
    desc: '你好，这是一个测试需求，我想让您翻译一段文本，信守承诺, 你好，这是一个测试需求，我想让您翻译一段文本，信守承诺',
  },]);
  return (
    <div>
      <Title heading={2}>我回答过的需求</Title>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          marginTop: 16,
        }}
      >
        {
          needs.map(el => <SingleNeed info={el} path='/market/home/' />)
        }
      </div>
    </div>
  );
};
