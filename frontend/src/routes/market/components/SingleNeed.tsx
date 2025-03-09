import { useNavigate } from '@modern-js/runtime/router';
import { NeedInfo } from '../home/page';
import { Avatar, Card, Tag } from '@douyinfe/semi-ui';
import { NeedStatus } from '@/consts';

export const SingleNeed = (props: {
  info: NeedInfo,
  path?: string,
  hideAvatar?: boolean;
}) => {
  const nav = useNavigate();
  const el = props.info;
  return (
    <div
      onClick={() => nav(`${props.path || ''}${el.id}`)}
      style={{
        cursor: 'pointer',
      }}
    >
      <Card
        shadows="hover"
        style={{
          width: 300,
        }}
        title={
          <div
            style={{
              fontWeight: 700,
            }}
          >
            {el.title}
            <span>（¥{el.price}）</span>
            <Tag color={el.status === NeedStatus.processing ? 'green' : 'grey'}>
              {el.status === NeedStatus.processing ? '进行中' : '已结束'}
            </Tag>
          </div>
        }
        footerLine={true}
        footerStyle={{
          padding: '12px 16px',
        }}
        footer={
          <Card.Meta
            avatar={
              props.hideAvatar || <Avatar
                size="small"
                color={
                  (
                    [
                      'blue',
                      'cyan',
                      'green',
                      'pink',
                      'violet',
                      'yellow',
                      'light-blue',
                      'light-green',
                      'lime',
                    ] as const
                  )[Math.floor(Math.random() * 6)]
                }
              >
                {el.author[0]}
              </Avatar>
            }
            description={
              <p>
                {props.hideAvatar || el.author}
                <span
                  style={{
                    marginLeft: props.hideAvatar ? 0 :8,
                    fontSize: 12,
                  }}
                >
                  {el.date || '2025-01-01'}
                </span>
              </p>
            }
          />
        }
      >
        <div
          style={{
            height: 100,
          }}
        >
          {el.desc}
        </div>
      </Card>
    </div>
  );
};
