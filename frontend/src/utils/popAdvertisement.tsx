import { IconLikeHeart } from '@douyinfe/semi-icons'
import {Modal} from '@douyinfe/semi-ui'

type AdsInfo = {
  imgUrl: string;
  title: string;
  target: string;
}

export const popAdvertisement = async (info?: AdsInfo) => {
  const testAdsInfo = {
    imgUrl: 'https://w.wallhaven.cc/full/3l/wallhaven-3lv8j6.jpg',
    title: '更好用的聊天软件',
    target: 'https://web.telegram.org/'
  }
  const onClick = (url: string) => {
    window.open(url, '_blank')
  }
  Modal.info({
    title: '赞助商广告',
    icon: <IconLikeHeart />,
    maskClosable: false,
    content: <div onClick={() => onClick(info?.target || testAdsInfo.target)} style={
      {
        cursor: 'pointer',
        width: 300,
        height: 225,
        position: 'relative',
        marginBottom: 32,
      }
    }>
      <img src={info?.imgUrl || testAdsInfo.imgUrl} style={{
        width: '100%',
        height: '100%',
        borderRadius: 8,
      }} />
      <p style={{
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'rgba(0, 0, 0, 0.1)',
        color: 'white',
        fontSize: 28,
        padding: 8,
        borderRadius: 8,
      }}>{info?.title || testAdsInfo.title}</p>
    </div>,
    footer: ""
  })
}