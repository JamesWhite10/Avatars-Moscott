import { FC } from 'react';
import { observer } from 'mobx-react';
import classNames from './TopControls.module.scss';
import RightControls from './RightControls';
import LeftControls from './LeftControls';

const TopControls: FC = observer(() => {
  return (
    <div className={classNames.root}>
      <div className={classNames.leftGroup_container}>
        <LeftControls />
      </div>
      <div className={classNames.rightGroup_container}>
        <RightControls />
      </div>
    </div>
  );
});

export default TopControls;
