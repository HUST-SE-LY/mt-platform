import { Toast } from '@douyinfe/semi-ui';

export const copyText = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      Toast.success('复制文本成功');
    })
    .catch(() => {
      Toast.error('复制文本失败，请检查浏览器设置');
    });
};
