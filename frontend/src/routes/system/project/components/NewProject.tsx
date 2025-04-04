import { Card } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';
import { useNavigate } from '@modern-js/runtime/router';

interface Props {
  onSuccess?: () => void;
}

export const NewProject = ({ onSuccess }: Props) => {
  const nav = useNavigate();

  return (
    <Card
      shadows="hover"
      style={{
        width: 300,
        height: 240,
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        border: '1px dashed var(--semi-color-border)',
      }}
      onClick={() => nav('new')}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <IconPlus size="large" />
        <span>新建项目</span>
      </div>
    </Card>
  );
};
