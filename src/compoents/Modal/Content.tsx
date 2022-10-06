import { FC, PropsWithChildren } from 'react';
import classNames from './Modal.module.scss';

const Content: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={classNames.content}>
      { children }
    </div>
  );
};

export default Content;
