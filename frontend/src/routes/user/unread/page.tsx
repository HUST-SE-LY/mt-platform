import { Badge, Button, ButtonGroup, List } from '@douyinfe/semi-ui';
import { Link } from '@modern-js/runtime/router';

interface SingleMsg {
  title: string;
  text: string;
  target?: string;
  isRead: boolean;
  date: string;
}

export default () => {
  const data: SingleMsg[] = [
    {
      title: '翻译市场邀请',
      text: '「用户xxxx」邀请您协助翻译。',
      target: '/market/114514',
      isRead: false,
      date: '2025-02-22',
    },
    {
      title: '翻译市场邀请',
      text: '「用户xxxx」邀请您协助翻译。',
      target: '/market/114514',
      isRead: false,
      date: '2025-02-22',
    },
    {
      title: '翻译市场邀请',
      text: '「用户xxxx」邀请您协助翻译。',
      target: '/market/114514',
      isRead: false,
      date: '2025-02-22',
    },
    {
      title: '翻译市场邀请',
      text: '「用户xxxx」邀请您协助翻译。',
      target: '/market/114514',
      isRead: false,
      date: '2025-02-22',
    },
    {
      title: '翻译市场邀请',
      text: '「用户xxxx」邀请您协助翻译。',
      target: '/market/114514',
      isRead: true,
      date: '2025-02-22',
    },
  ];
  return (
    <div>
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            style={{
              border: '1px solid var(--semi-color-border)',
              marginBottom: 12,
              borderRadius: 8,
            }}
            main={
              <div>
                <div>
                  <Badge dot={!item.isRead}>
                    <p
                      style={{
                        color: 'var(--semi-color-text-0)',
                        fontWeight: 500,
                        marginBottom: 12,
                      }}
                    >
                      {item.title}
                    </p>
                  </Badge>
                  <span
                    style={{
                      marginLeft: 12,
                      fontSize: 12,
                      color: 'gray',
                    }}
                  >
                    {item.date}
                  </span>
                </div>

                <span>{item.text}</span>
                {item.target && (
                  <Link
                    style={{
                      color: '#007cdc',
                    }}
                    to={item.target}
                  >
                    点击前往
                  </Link>
                )}
              </div>
            }
            extra={
              <>
                <ButtonGroup>
                  <Button disabled={item.isRead}>已读</Button>
                  <Button type="danger">删除</Button>
                </ButtonGroup>
              </>
            }
          />
        )}
      />
    </div>
  );
};
