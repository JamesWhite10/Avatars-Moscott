import { FC, PropsWithChildren } from 'react';
import classNames from './Modal.module.scss';

const Footer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={classNames.footer}>
      { children }
    </div>
  );
};

export default Footer;
