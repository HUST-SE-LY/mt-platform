import { UserType } from '@/consts';
import { useUserStore } from '@/stores/userStore';
import { Button, Form, Switch } from '@douyinfe/semi-ui';
import Paragraph from '@douyinfe/semi-ui/lib/es/typography/paragraph';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useState } from 'react';

export default () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const userStore = useUserStore();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p
          style={{
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          个人信息
        </p>
        <Title heading={6} style={{ margin: 8, marginLeft: 32 }}>
          编辑信息
        </Title>
        <Switch
          uncheckedText="关"
          checkedText="开"
          checked={isEdit}
          onChange={() => setIsEdit((v) => !v)}
        />
        <Title heading={6} style={{ margin: 8, marginLeft: 32 }}>
          修改密码
        </Title>
        <Switch
          uncheckedText="关"
          checkedText="开"
          checked={isChangePassword}
          onChange={() => setIsChangePassword((v) => !v)}
        />
      </div>
      <Form
        initValues={userStore.userInfo}
        disabled={!isEdit}
        labelPosition="left"
        style={{
          width: 500,
        }}
      >
        {() => (
          <>
            <Form.Input disabled label="手机号" field="phone" />
            {(userStore.userInfo.userType === UserType.Enterprise ||
              userStore.userInfo.userType === UserType.Advertiser) && (
              <Form.Input disabled field="enterprise" label="企业名称" />
            )}
            <Form.Input disabled field="money" label="余额" suffix="¥" />
            <Form.Input field="email" label="邮箱" />
            {isChangePassword && (
              <>
                <Form.Input mode="password" label="新密码" field="password" />
                <Form.Input
                  mode="password"
                  label="再次输入密码"
                  field="secondPassword"
                />
              </>
            )}
            {(isEdit || isChangePassword) && (
              <Button style={{ width: 500, marginTop: 8 }}>保存</Button>
            )}
          </>
        )}
      </Form>
      <p
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginTop: 16,
        }}
      >
        充值
      </p>
      <Form style={{ width: 900 }}>
        <Form.RadioGroup
          field="chargeType"
          label="选择充值金额"
          type="card"
          rules={[
            {
              required: true,
              message: '请选择充值金额',
            },
          ]}
        >
          <Form.Radio
            value={6}
            style={{ width: 280, border: '1px solid rgba(0, 0, 0, 0.1)' }}
          >
            6元
          </Form.Radio>
          <Form.Radio
            value={30}
            style={{ width: 280, border: '1px solid rgba(0, 0, 0, 0.1)' }}
          >
            30元
          </Form.Radio>
          <Form.Radio
            value={68}
            style={{ width: 280, border: '1px solid rgba(0, 0, 0, 0.1)' }}
          >
            68元
          </Form.Radio>
          <Form.Radio
            value={98}
            style={{ width: 280, border: '1px solid rgba(0, 0, 0, 0.1)' }}
          >
            98元
          </Form.Radio>
          <Form.Radio
            value={198}
            style={{ width: 280, border: '1px solid rgba(0, 0, 0, 0.1)' }}
          >
            198元
          </Form.Radio>
          <Form.Radio
            value={398}
            style={{ width: 280, border: '1px solid rgba(0, 0, 0, 0.1)' }}
          >
            398元
          </Form.Radio>
        </Form.RadioGroup>
        <Button style={{ width: 280 }} htmlType="submit">
          充值
        </Button>
      </Form>
    </div>
  );
};
