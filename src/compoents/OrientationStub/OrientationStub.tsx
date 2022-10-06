import { FC } from 'react';
import classNames from './OrientationStub.module.scss';

const OrientationStub: FC = () => {
  return (
    <div className={classNames.root}>
      <div className={classNames.content}>
        <div className={classNames.text}>🤳</div>
        <div className={classNames.text}>
          Please, turn your device
          in portrait orientation
        </div>
      </div>
    </div>
  );
};

export default OrientationStub;
