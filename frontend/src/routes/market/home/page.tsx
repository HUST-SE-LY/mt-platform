import { NeedStatus } from '@/consts';
import { IconSearch } from '@douyinfe/semi-icons';
import { Avatar, Button, Card, Input, Tag } from '@douyinfe/semi-ui';
import { useNavigate } from '@modern-js/runtime/router';
import { useState } from 'react';
import { SingleNeed } from '../components/SingleNeed';

export interface NeedInfo {
  id: string;
  title: string;
  author: string;
  price: number;
  status: NeedStatus;
  desc: string;
  date?: string;
}

export default () => {
  const [needs, setNeeds] = useState<NeedInfo[]>([
    {
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
    },
    {
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
      desc: '你好，这是一个测试需求，我想让您翻译一段文本，信守承诺',
    },
    {
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
      desc: '你好，这是一个测试需求，我想让您翻译一段文本，信守承诺',
    },
    {
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
      author: '用户名1',
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
      desc: '你好，这是一个测试需求，我想让您翻译一段文本，信守承诺',
    },
    {
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
      desc: '你好，这是一个测试需求，我想让您翻译一段文本，信守承诺',
    },
    {
      id: '1',
      title: '测试需求',
      author: '用户名',
      price: 99,
      status: NeedStatus.processing,
      desc: '你好，这是一个测试需求，我想让您翻译一段文本，信守承诺',
    },
  ]);
  const nav = useNavigate();
  return (
    <div
      style={{
        padding: 16,
        height: 'calc(100vh - 60px)',
        overflow: 'scroll',
      }}
    >
      <div
        style={{
          marginBottom: 24,
        }}
      >
        <Input
          style={{
            borderRadius: 999,
            width: 250,
          }}
          placeholder="搜索需求标题"
          prefix={<IconSearch />}
          showClear
        ></Input>
        <Button
          style={{
            borderRadius: 999,
            width: 72,
            marginLeft: 16,
          }}
        >
          搜索
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        {needs.map((el) => (
          <SingleNeed info={el} />
        ))}
      </div>
    </div>
  );
};
