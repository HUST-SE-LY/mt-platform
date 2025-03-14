import '@/routes/index.css';
import { Button, Form } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';

export default () => {
  return (
    <div>
      <Title heading={3}>新建翻译项目</Title>
      <Form
        labelWidth={96}
        labelPosition="left"
        style={{
          display: 'flex',
          gap: '0px 108px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <Form.Input
          style={{
            width: 400,
          }}
          field="name"
          label="项目名称"
          rules={[
            {
              required: true,
              message: '请输入必填项',
            },
          ]}
        />
        <Form.Select
          style={{
            width: 400,
          }}
          field="memory"
          label="记忆库"
          multiple
        />
        <Form.Select
          style={{
            width: 400,
          }}
          field="term"
          label="术语库"
          multiple
        />
        <Form.Select
          rules={[
            {
              required: true,
              message: '请选择',
            },
          ]}
          style={{
            width: 400,
          }}
          field="originLanguage"
          label="源语言"
        />
        <Form.Select
          rules={[
            {
              required: true,
              message: '请选择',
            },
          ]}
          style={{
            width: 400,
          }}
          field="originLanguage"
          label="目标语言"
        />
        <Button htmlType='submit'>提交并创建</Button>
      </Form>
    </div>
  );
};
