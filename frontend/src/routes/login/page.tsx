import { UserType } from '@/consts';
import '@/routes/index.css';
import { useUserStore } from '@/stores/userStore';
import { Button, Card, Form } from '@douyinfe/semi-ui';
import { Link, useNavigate } from '@modern-js/runtime/router';

type FormValues = {
  phone: string;
  password: string;
  type: UserType;
  enterprise?: string;
};

export default () => {
  const userStore = useUserStore();
  const nav = useNavigate();
  const submit = async (values: FormValues) => {
    console.log(values);
    userStore.login();
    userStore.setInfo({
      name: '刘源',
      email: 'cheems1969@gmail.com',
      phone: '13965472080',
      enterprise: 'bytedance',
      userType: UserType.Normal,
      money: 1000,
      unread: 4,
    });
    nav('/');
  };
  return (
    <div>
      <Card
        shadows="hover"
        title="用户登录"
        style={{
          width: 500,
        }}
      >
        <Form onSubmit={submit}>
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
                mode="password"
                field="password"
                label="密码"
              />
              <Form.RadioGroup
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]}
                field="type"
                label="用户类型"
              >
                <Form.Radio value={UserType.Normal}>普通用户</Form.Radio>
                <Form.Radio value={UserType.Advertiser}>广告客户</Form.Radio>
                <Form.Radio value={UserType.Pro}>专业用户</Form.Radio>
                <Form.Radio value={UserType.Enterprise}>企业用户</Form.Radio>
                <Form.Radio value={UserType.Admin}>管理员</Form.Radio>
              </Form.RadioGroup>
              {(formState.values.type === UserType.Enterprise ||
                formState.values.type === UserType.Advertiser) && (
                <Form.Input
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  field="enterprise"
                  label="企业名称"
                />
              )}
              <Button
                htmlType="submit"
                style={{
                  width: '100%',
                }}
              >
                登录
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
          <Link to="/register">还没有账号？点击注册</Link>
        </div>
      </Card>
    </div>
  );
};
