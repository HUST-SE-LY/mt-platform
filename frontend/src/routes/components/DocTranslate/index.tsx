import { useUserStore } from '@/stores/userStore';
import { http } from '@/utils/http';
import { IconLock, IconUpload } from '@douyinfe/semi-icons';
import { Button, Select, Table, Toast, Upload } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useNavigate } from '@modern-js/runtime/router';
import { useEffect, useState } from 'react';

interface Document {
  id: string;
  file_name: string;
  upload_time: string;
  file_size: number;
  is_translating: boolean;
}

export const DocTranslate = () => {
  const userStore = useUserStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [originLanguage, setOriginLanguage] = useState('英文');
  const [targetLanguage, setTargetLanguage] = useState('中文');
  const languages = ['英文', '中文', '日语'];
  const nav = useNavigate();
  const getDocuments = () => {
    http
      .get<{
        documents: Document[];
      }>('/user/documents')
      .then((res) => {
        setDocuments(res.documents);
      })
      .catch((err) => {
        Toast.error('获取历史文档错误');
      });
  };
  const uploadFile = ({
    fileName,
    fileInstance,
    onProgress,
    onSuccess,
  }: Record<string, any>) => {
    console.log(fileName);
    const formData = new FormData();
    formData.append('file', fileInstance);
    formData.append('fileName', fileName);
    formData.append('source_lang', originLanguage);
    formData.append('target_lang', targetLanguage);
    http.postFormData('/document/upload', formData).then(() => {
      onProgress(100, 100);
      onSuccess();
      Toast.success('上传完成，翻译开始');
      getDocuments();
    });
  };
  const deleteFile = (id: string) => {
    http.delete(`/document/delete/${id}`).then(() => {
      Toast.success('删除成功');
      getDocuments();
    }).catch(() => {
      Toast.error('删除失败');
    })
  }
  useEffect(() => {
    getDocuments();
    setInterval(() => {
      getDocuments();
      http.get<any>('/user/auto_login').then((res) => {
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
    }, 10000);
  }, []);
  const columns = [
    {
      title: '文件名',
      dataIndex: 'file_name',
    },
    {
      title: '上传时间',
      dataIndex: 'upload_time',
    },
    {
      title: '文件大小',
      dataIndex: 'file_size',
      render: (size: number) => `${(size / 1024).toFixed(2)} KB`,
    },
    {
      title: '当前状态',
      dataIndex: 'is_translating',
      render: (data: boolean) => {
        return data ? '翻译中' : '翻译结束';
      },
    },
    {
      title: '操作',
      render: (record: Document) => (
        <>
          <Button onClick={() => deleteFile(record.id)} type="danger">
            删除
          </Button>
          {!record.is_translating && (
            <Button
              theme="solid"
              type="primary"
              style={{
                marginLeft: 8
              }}
              onClick={() => nav(`/doc/${record.id}`)}
            >
              查看详情
            </Button>
          )}
        </>
      ),
    },
  ];

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
          <div
            style={{
              display: 'flex',
              gap: 64,
              marginTop: 16,
              marginBottom: 16,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                marginBottom: 8,
              }}
            >
              <span>源语言：</span>
              <Select
                value={originLanguage}
                onChange={(e) => setOriginLanguage(e as string)}
                style={{
                  width: 280,
                }}
                optionList={languages.map((el) => ({
                  label: el,
                  value: el,
                }))}
              />
            </div>
            <div>
              <div
                style={{
                  marginBottom: 8,
                }}
              >
                <span>目标语言：</span>
                <Select
                  style={{
                    width: 280,
                  }}
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e as string)}
                  optionList={languages.map((el) => ({
                    label: el,
                    value: el,
                  }))}
                />
              </div>
            </div>
          </div>
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
            customRequest={uploadFile}
            accept=".pdf,.txt,.docx"
            limit={1}
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
          <Title
            style={{
              marginTop: 16,
              marginBottom: 8,
            }}
            heading={6}
          >
            历史上传：
          </Title>
          <Table columns={columns} dataSource={documents} rowKey="id" />
        </div>
      ) : (
        <Button onClick={() => nav('/login')} icon={<IconLock />}>
          登录后查看
        </Button>
      )}
    </div>
  );
};
