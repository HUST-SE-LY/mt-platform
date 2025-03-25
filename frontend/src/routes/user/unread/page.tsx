import { http } from '@/utils/http';
import { Badge, Button, ButtonGroup, List, Toast } from '@douyinfe/semi-ui';
import { Link } from '@modern-js/runtime/router';
import { useEffect, useState } from 'react';

interface SingleMsg {
  id: number;
  title: string;
  text: string;
  target?: string;
  isRead: boolean;
  date: string;
}

export default () => {
  const [data, setData] = useState<SingleMsg[]>([]);
  const getMessages = () => {
    http.get<SingleMsg[]>('/user/messages').then(res => {
      setData([...res]);
    })
  }
  const readMsg = (id: number) => {
    http.post('/user/mark_message_as_read', {
      message_id: id,
    }).then(() => {
      Toast.success('已读成功')
      getMessages();
    }).catch(() => {
      Toast.error('已读失败')
    })
  }
  const deleteMsg = (id: number) => {
    http.post('/user/', {
      message_id: id
    }).then(() => {
      Toast.success('删除成功');
      getMessages();
    }).catch(() => {
      Toast.success('删除失败')
    })
  }
  useEffect(() => {
    getMessages();
  }, []);
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
                  <Button onClick={() => readMsg(item.id)} disabled={item.isRead}>已读</Button>
                  <Button onClick={() => deleteMsg(item.id)} type="danger">删除</Button>
                </ButtonGroup>
              </>
            }
          />
        )}
      />
    </div>
  );
};
