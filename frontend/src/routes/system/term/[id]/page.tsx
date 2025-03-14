import '@/routes/index.css';
import { Button, Form, Modal, Table } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useParams } from '@modern-js/runtime/router';
import { useEffect, useRef, useState } from 'react';

interface SingleTerm {
  id: number;
  origin: string;
  target: string;
  info: string;
}

export default () => {
  const params = useParams();
  const [list, setList] = useState<SingleTerm[]>([]);
  const editForm = useRef<any>();
  const editSingleTerm = (id: number, data: SingleTerm) => {
    Modal.info({
      title: '编辑单条内容',
      content: <>
        <Form ref={editForm} initValues={data}>
          <Form.Input field='origin' label='源语言' rules={[{
            required: true,
            message: '请输入必填项'
          }]} />
          <Form.Input field='target' label='目标语言' rules={[{
            required: true,
            message: '请输入必填项'
          }]} />
          <Form.Input field='info' label='附加信息' rules={[{
            required: true,
            message: '请输入必填项'
          }]} />
        </Form>
      </>,
      onOk: () => {
        editForm.current?.formApi.validate().then((value: SingleTerm) => {
          console.log(value)
        })
      }
    })
  }
  const columns = [{
    title: '源语言',
    dataIndex: 'origin'
  },{
    title: '目标语言',
    dataIndex: 'target'
  },{
    title: '附加信息',
    dataIndex: 'info'
  }, {
    title: '操作',
    dataIndex: 'id',
    render: (id: number, data: SingleTerm) => {
      return <>
        <Button onClick={() => editSingleTerm(id, data)}>编辑</Button>
        <Button style={{
          marginLeft: 8
        }}>删除</Button>
      </>
    }
  }];
  useEffect(() => {
    setList([{
      id: 1,
      origin: '中文',
      target: 'Chinese',
      info: '中文是中国的文字'
    },{
      id: 2,
      origin: '你好',
      target: 'hello',
      info: '你好是中国人用来打招呼的方式'
    }])
  })
  return <div>
    <Title heading={3}>记忆库内容</Title>
    <Table columns={columns} dataSource={list} />
  </div>
}