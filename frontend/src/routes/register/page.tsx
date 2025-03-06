import { UserType } from '@/consts';
import '@/routes/index.css';
import { Button, Card, Form } from '@douyinfe/semi-ui';
import { Link } from '@modern-js/runtime/router';

export default () => {
  return (
    <div>
      <Card
        title="用户登录"
        shadows="hover"
        style={{
          width: 500,
        }}
      >
        <Form>
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
                field="type"
                label="用户类型"
              >
                <Form.Radio value={UserType.Normal}>普通用户</Form.Radio>
                <Form.Radio value={UserType.Advertiser}>广告客户</Form.Radio>
                <Form.Radio value={UserType.Pro}>专业用户</Form.Radio>
                <Form.Radio value={UserType.Enterprise}>企业用户</Form.Radio>
              </Form.RadioGroup>
              {(formState.values.type === UserType.Enterprise ||
                formState.values.type === UserType.Advertiser) && (
                <Form.Input
                  rules={[
                    {
                      required: true,
                      message: '请输入必填项',
                    },
                  ]}
                  field="enterprise"
                  label="企业名称"
                />
              )}
              <Button
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
