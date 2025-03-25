import { UserType } from '@/consts';
import '@/routes/index.css';
import { http } from '@/utils/http';
import { Button, Card, Form, Toast } from '@douyinfe/semi-ui';
import { Link, useNavigate } from '@modern-js/runtime/router';

export default () => {
  const nav = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      // 调用注册接口
      const response = await http.post('/user/register', {
        username: values.username,
        password: values.password,
        phone: values.phone,
        email: values.email,
        user_type: values.userType,
        company_name: values.companyName
      });

      console.log(response);

      // 注册成功处理
        Toast.success({
          content: '注册成功',
          duration: 3
        });
        nav('/login');
    } catch (error: any) {
      // 错误处理
      Toast.error({
        content: error.message || '注册失败',
        duration: 3
      });
    }
  };
  return (
    <div>
      <Card
        title="用户登录"
        shadows="hover"
        style={{
          width: 500,
        }}
      >
        <Form onSubmit={handleSubmit}>
          {({ formState }) => (
            <>
              <Form.Input
                rules={[
                  {
                    required: true,
                    message: '请输入必填项',
                  },
                ]}
                field="phone"
                label="手机号"
              />
              <Form.Input
                rules={[
                  {
                    required: true,
                    message: '请输入必填项',
                  },
                ]}
                field="username"
                label="用户名"
              />
              <Form.Input field="email" label="邮箱" />
              <Form.Input
                rules={[
                  {
                    required: true,
                    message: '请输入必填项',
                  },
                ]}
                mode="password"
                field="password"
                label="密码"
              />
              <Form.Input
                rules={[
                  {
                    required: true,
                    message: '请输入必填项',
                  },
                ]}
                mode="password"
                field="secondPassword"
                label="再次输入密码"
              />
              <Form.RadioGroup
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]}
                field="userType"
                label="用户类型"
              >
                <Form.Radio value={UserType.Normal}>普通用户</Form.Radio>
                <Form.Radio value={UserType.Advertiser}>广告客户</Form.Radio>
                <Form.Radio value={UserType.Pro}>专业用户</Form.Radio>
                <Form.Radio value={UserType.Enterprise}>企业用户</Form.Radio>
              </Form.RadioGroup>
              {(formState.values.userType === UserType.Enterprise ||
                formState.values.userType === UserType.Advertiser) && (
                <Form.Input
                  rules={[
                    {
                      required: true,
                      message: '请输入必填项',
                    },
                  ]}
                  field="companyName"
                  label="企业名称"
                />
              )}
              <Button
                htmlType='submit'
                style={{
                  width: '100%',
                }}
              >
                注册
              </Button>
            </>
          )}
        </Form>
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'row-reverse',
          }}
        >
          <Link to="/login">已有账号？点击登录</Link>
        </div>
      </Card>
    </div>
  );
};
