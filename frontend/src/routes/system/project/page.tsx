import { Button, Card, Toast } from '@douyinfe/semi-ui';
import { NewProject } from './components/NewProject';
import { useEffect, useState } from 'react';
import { useNavigate } from '@modern-js/runtime/router';
import { http } from '@/utils/http';

interface Project {
  id: string;
  name: string;
  source_lang: string;
  target_lang: string;
  doc_count: number;
  created_at: string;
  description?: string;
}

// 语言选项映射
const languageMap: Record<string, string> = {
  zh: '中文',
  en: '英文',
  ja: '日文',
  ko: '韩文',
  fr: '法文',
  de: '德文',
  es: '西班牙文',
  ru: '俄文',
};

export default () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // 获取项目列表
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await http.get<Project[]>('/project');
      setProjects(response || []);
    } catch (error: any) {
      Toast.error({
        content: error.message || '获取项目列表失败',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  // 删除项目
  const handleDelete = async (id: string) => {
    try {
      await http.delete(`/project/${id}`);
      Toast.success({
        content: '删除成功',
        duration: 3,
      });
      fetchProjects();
    } catch (error: any) {
      Toast.error({
        content: error.message || '删除失败',
        duration: 3,
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <NewProject onSuccess={fetchProjects} />
      {projects.map((project) => (
        <Card
          key={project.id}
          shadows="hover"
          loading={loading}
          style={{
            width: 300,
            borderRadius: 12,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: 24,
            height: 240,
            gap: 8,
          }}
        >
          <h3
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            {project.name}
          </h3>
          <div
            style={{
              marginBottom: 16,
              display: 'flex',
              gap: 8,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <p>
              源语言：{languageMap[project.source_lang] || project.source_lang}
            </p>
            <p>
              目标语言：
              {languageMap[project.target_lang] || project.target_lang}
            </p>
            <p>文档数：{project.doc_count}</p>
            {project.description && (
              <p style={{ color: 'var(--semi-color-text-2)' }}>
                备注：{project.description}
              </p>
            )}
          </div>
          <div>
            <Button
              onClick={() => nav(`${project.id}`)}
              style={{
                borderRadius: 999,
                width: 72,
              }}
            >
              查看
            </Button>
            <Button
              type="danger"
              style={{
                marginLeft: 16,
                borderRadius: 999,
                width: 72,
              }}
              onClick={() => handleDelete(project.id)}
            >
              删除
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
