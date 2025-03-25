import { http } from '@/utils/http';
import { popAdvertisement } from '@/utils/popAdvertisement';
import { IconUpload } from '@douyinfe/semi-icons';
import { Button, Form, Toast, Upload } from '@douyinfe/semi-ui';
import { useNavigate } from '@modern-js/runtime/router';
import { useState } from 'react';

export default () => {
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const nav = useNavigate();
  const uploadImg = ({
    fileName,
    fileInstance,
    onProgress,
    onSuccess,
  }: Record<string, any>) => {
    const formData = new FormData();
    formData.append('file', fileInstance);
    formData.append('filename', fileName);
    http.postFormData<any>('/ad/upload_image', formData).then((res) => {
      setCurrentImageUrl(res.image_url);
      onProgress(100, 100);
      onSuccess();
      Toast.success('上传完成');
    });
  };
  const createAd = (values: any) => {
    const {title, target, clickTimes} = values;
    http.post<any>('/ad/create_ad', {
      title,
      redirect_url: target,
      img_url: currentImageUrl,
      click_count: Number(clickTimes)
    }).then(() => {
      Toast.success('发布成功');
      nav('/ads/manage')
    }).catch(() => {
      Toast.error('发布失败，请检查余额')
    })
  }
  return (
    <div>
      <Form
        onSubmit={createAd}
        style={{
          width: 500,
        }}
      >
        {(data) => (
          <>
            <Form.Input
              field="title"
              label="广告标题"
              rules={[
                {
                  required: true,
                  message: '请填写必填项',
                },
              ]}
            />
            <Form.Input
              rules={[
                {
                  required: true,
                  message: '请填写必填项',
                },
              ]}
              field="target"
              label="广告跳转url"
            />
            <p style={{
              fontWeight: 'bold',
              fontSize: 14,
              marginTop: 12,
              marginBottom: 4
            }}>上传广告图片:</p>
            <Upload
              accept='.png,.jpg,.jpeg,.gif'
              customRequest={uploadImg}
            >
              <Button icon={<IconUpload />} theme="light">
                点击上传
              </Button>
            </Upload>
            <Form.Input
              rules={[
                {
                  required: true,
                  message: '请填写必填项',
                },
              ]}
              field="clickTimes"
              label="投放次数"
              helpText={`预计支付${(Number(data.values.clickTimes) || 0 ) * 2}元`}
            />
            <Button onClick={() => popAdvertisement({
              title: data.values.title,
              target: data.values.target,
              imgUrl: currentImageUrl
            })}>预览效果</Button>
            <Button htmlType='submit' style={{
              marginLeft: 16
            }}>支付并提交审核</Button>
          </>
        )}
      </Form>
    </div>
  );
};
