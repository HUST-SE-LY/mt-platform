import { Divider } from '@douyinfe/semi-ui';
import { BasicTranslate } from './components/BasicTranslate';
import './index.css';
import { DocTranslate } from './components/DocTranslate';

export default () => (
  <div>
    <BasicTranslate />
    <Divider margin="12px" />
    <DocTranslate />
  </div>
);
