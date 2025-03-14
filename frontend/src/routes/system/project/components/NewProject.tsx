import { IconPlus } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { useNavigate } from '@modern-js/runtime/router';

export const NewProject = () => {
  const nav = useNavigate();
  return (
    <div
      style={{
        width: 250,
        height: 175,
        borderRadius: 12,
        border: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8
      }}
    >
      <Button onClick={() => nav('new')} icon={<IconPlus />} style={
        {
          borderRadius: 999
        }
      } >新建项目</Button>
    </div>
  );
};
