import { IconLikeHeart } from '@douyinfe/semi-icons';
import { Modal } from '@douyinfe/semi-ui';
import { http } from './http';

type AdsInfo = {
  imgUrl: string;
  title: string;
  target: string;
};

export const popAdvertisement = async (info?: AdsInfo) => {
  const onClick = (url: string, id?: string) => {
    if(id) {
      http.post(`/click_ad/${id}`);
    }
    window.open(url, '_blank');
  };
  if (info) {
    Modal.info({
      title: '赞助商广告',
      icon: <IconLikeHeart />,
      maskClosable: false,
      content: (
        <div
          onClick={() => onClick(info?.target)}
          style={{
            cursor: 'pointer',
            width: 300,
            height: 225,
            position: 'relative',
            marginBottom: 32,
          }}
        >
          <img
            src={info?.imgUrl}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
            }}
          />
          <p
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              background: 'rgba(0, 0, 0, 0.1)',
              color: 'white',
              fontSize: 28,
              padding: 8,
              borderRadius: 8,
            }}
          >
            {info?.title}
          </p>
        </div>
      ),
      footer: '',
    });
  } else {
    const res = (await http.get<any>('/ad/random_ad')).ad;
    Modal.info({
      title: '赞助商广告',
      icon: <IconLikeHeart />,
      maskClosable: false,
      content: (
        <div
          onClick={() => onClick(res?.redirect_url, res.id)}
          style={{
            cursor: 'pointer',
            width: 300,
            height: 225,
            position: 'relative',
            marginBottom: 32,
          }}
        >
          <img
            src={res?.image_url}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
            }}
          />
          <p
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              background: 'rgba(0, 0, 0, 0.1)',
              color: 'white',
              fontSize: 28,
              padding: 8,
              borderRadius: 8,
            }}
          >
            {res?.title}
          </p>
        </div>
      ),
      footer: '',
    });
  }
};
