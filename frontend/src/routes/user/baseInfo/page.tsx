import { UserType } from '@/consts';
import { useUserStore } from '@/stores/userStore';
import { http } from '@/utils/http';
import { Button, Form, Switch, Toast } from '@douyinfe/semi-ui';
import Paragraph from '@douyinfe/semi-ui/lib/es/typography/paragraph';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useRef, useState } from 'react';

export default () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const form = useRef<any>();
  const userStore = useUserStore();
  const freshInfo = () => {
    http.get<any>('/user/auto_login').then((res) => {
      console.log(res);
      userStore.login();
      const {
        balance,
        company_name,
        email,
        phone,
        unread_message_count,
        user_type,
        username,
      } = res;
      userStore.setInfo({
        money: balance,
        enterprise: company_name || '',
        email: email || '',
        phone,
        unread: unread_message_count,
        userType: user_type,
        name: username,
      });
    });
  };
  const changePassword = () => {
    const { password, secondPassword } = form.current.formApi.getValues();
    if (!password || !secondPassword || password !== secondPassword) {
      Toast.error('两次输入的密码不一致');
      return;
    }
    http
      .post('/user/change_password', {
        password,
      })
      .then(() => {
        setIsChangePassword(false);
        Toast.success('修改密码成功');
      })
      .catch(() => {
        Toast.error('修改失败');
      });
  };
  const changeInfo = () => {
    const { email, name } = form.current.formApi.getValues();
    http
      .post('/user/update_profile', {
        username: name,
        email,
      })
      .then(() => {
        Toast.success('修改信息成功');
        setIsEdit(false);
        freshInfo();
      })
      .catch(() => {
        Toast.error('修改信息失败');
      });
  };
  const charge = (number: number) => {
    if (!(number > 0)) {
      Toast.error('请输入合理的充值金额');
      return;
    }
    http
      .post('/user/recharge', {
        amount: number,
      })
      .then(() => {
        Toast.success('充值成功');
        freshInfo();
      })
      .catch(() => {
        Toast.error('充值失败');
      });
  };
  const logout = () => {
    http.post('/user/logout').then(() => {
      window.location.reload();
    });
  };

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
        onSubmit={changeInfo}
        ref={form}
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
            <Form.Input required field="name" label="用户名" />
            <Form.Input field="email" label="邮箱" />
            {isChangePassword && (
              <>
                <Form.Input
                  disabled={false}
                  mode="password"
                  label="新密码"
                  field="password"
                />
                <Form.Input
                  disabled={false}
                  mode="password"
                  label="再次输入密码"
                  field="secondPassword"
                />
                <Button
                  onClick={changePassword}
                  style={{ width: 500, marginTop: 8 }}
                >
                  确认修改密码
                </Button>
              </>
            )}
            {isEdit && (
              <Button htmlType="submit" style={{ width: 500, marginTop: 8 }}>
                保存
              </Button>
            )}
            <Button
              style={{ width: 500, marginTop: 8 }}
              type="danger"
              onClick={logout}
            >
              退出登录
            </Button>
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
      <Form
        onSubmit={({ chargeType }) => charge(Number(chargeType))}
        style={{ width: 900 }}
      >
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
