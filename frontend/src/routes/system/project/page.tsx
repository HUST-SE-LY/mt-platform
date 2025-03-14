import { Button, Card } from '@douyinfe/semi-ui';
import { NewProject } from './components/NewProject';
import { useEffect, useState } from 'react';
import { useNavigate } from '@modern-js/runtime/router';

interface Project {
  id: number;
  name: string;
  docNum: number;
}

export default () => {
  const [project, setProject] = useState<Project[]>([]);
  const nav = useNavigate();
  useEffect(() => {
    setProject([
      {
        id: 1,
        name: '项目1',
        docNum: 2,
      },
      {
        id: 2,
        name: '项目2',
        docNum: 1,
      },
      {
        id: 3,
        name: '项目3',
        docNum: 3,
      },
    ]);
  });
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <NewProject />
      {project.map((el) => (
        <Card
          shadows="hover"
          style={{
            width: 250,
            height: 175,
            borderRadius: 12,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            {el.name}
          </p>
          <p style={{
              textAlign: 'center',
              marginBottom: 16,
            }}>文档数：{el.docNum}</p>
          <div>
            <Button
              onClick={() => nav(`${el.id}`)}
              style={{
                marginLeft: 16,
                borderRadius: 999,
                width: 72
              }}
            >
              查看
            </Button>
            <Button
              type='danger'
              style={{
                marginLeft: 16,
                borderRadius: 999,
                width: 72
              }}
            >
              删除
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
