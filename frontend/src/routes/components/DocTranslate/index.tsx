import { useUserStore } from '@/stores/userStore';
import { IconLock, IconUpload } from '@douyinfe/semi-icons';
import { Button, Upload } from '@douyinfe/semi-ui';
import { useNavigate } from '@modern-js/runtime/router';

export const DocTranslate = () => {
  const userStore = useUserStore();
  const nav = useNavigate();
  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <p
        style={{
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        文档翻译
      </p>
      {userStore.isLogin ? (
        <div>
          当前账户余额：{userStore.userInfo.money}¥{' '}
          <Button
            onClick={() => nav('/user/baseInfo')}
            style={{
              marginLeft: 8,
            }}
          >
            充值
          </Button>
          <Upload
            prompt={
              <div
                style={{
                  color: 'grey',
                  fontSize: 14,
                  marginTop: 4,
                }}
              >
                支持上传.txt，.docx，.pdf格式的文件，按文本量收费
              </div>
            }
            promptPosition="bottom"
            style={{
              marginTop: 16,
            }}
          >
            <Button icon={<IconUpload />} theme="light">
              点击上传
            </Button>
          </Upload>
        </div>
      ) : (
        <Button onClick={() => nav('/login')} icon={<IconLock />}>
          登录后查看
        </Button>
      )}
    </div>
  );
};
