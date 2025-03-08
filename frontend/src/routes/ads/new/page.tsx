import { popAdvertisement } from '@/utils/popAdvertisement';
import { IconUpload } from '@douyinfe/semi-icons';
import { Button, Form } from '@douyinfe/semi-ui';
import Paragraph from '@douyinfe/semi-ui/lib/es/typography/paragraph';

export default () => {
  return (
    <div>
      <Form
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
            <Form.Upload
              rules={[
                {
                  required: true,
                  message: '请填写必填项',
                },
              ]}
              field="imgUrl"
              label="上传广告图片"
              action=""
            >
              <Button icon={<IconUpload />} theme="light">
                点击上传
              </Button>
            </Form.Upload>
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
            <Button onClick={() => popAdvertisement(data.values)}>预览效果</Button>
            <Button style={{
              marginLeft: 16
            }}>支付并提交审核</Button>
          </>
        )}
      </Form>
    </div>
  );
};
