import '@/routes/index.css';
import { http } from '@/utils/http';
import { Button, Card, Form, Toast } from '@douyinfe/semi-ui';
import { Link, useNavigate } from '@modern-js/runtime/router';

export default () => {
  const nav = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      const response = await http.post('/company/register', {
        name: values.companyName,
        org_code: values.orgCode,
        contact_person: values.legalPerson,
        contact_phone: values.contactPhone,
        address: values.address,
      });

      Toast.success({
        content: '公司注册成功',
        duration: 3,
      });
      nav('/login');
    } catch (error: any) {
      Toast.error({
        content: error.message || '注册失败',
        duration: 3,
      });
    }
  };

  return (
    <div
      style={{
        marginTop: 20,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Card
        title="公司注册"
        shadows="hover"
        style={{
          width: 500,
        }}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Input
            rules={[{ required: true, message: '请输入公司名称' }]}
            field="companyName"
            label="公司名称"
          />
          <Form.Input
            rules={[
              { required: true, message: '请输入机构代码' },
              {
                pattern: /^\d{6}$/,
                message: '机构代码必须是6位数字',
              },
            ]}
            field="orgCode"
            label="机构代码"
            placeholder="请输入6位数字的机构代码"
          />
          <Form.Input
            rules={[{ required: true, message: '请输入法人代表姓名' }]}
            field="legalPerson"
            label="法人代表"
          />
          <Form.Input
            rules={[
              { required: true, message: '请输入联系电话' },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入正确的手机号码',
              },
            ]}
            field="contactPhone"
            label="联系电话"
          />
          <Form.Input
            rules={[{ required: true, message: '请输入公司地址' }]}
            field="address"
            label="公司地址"
          />
          <Button
            htmlType="submit"
            style={{
              width: '100%',
            }}
          >
            注册
          </Button>
        </Form>
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'row-reverse',
            gap: 12,
          }}
        >
          <Link to="/login">已有账号？点击登录</Link>
          <Link to="/register">返回用户注册</Link>
        </div>
      </Card>
    </div>
  );
};
