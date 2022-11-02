import { FC, PropsWithChildren } from 'react';
import classNames from '../../About.module.scss';

const Footer: FC<PropsWithChildren> = (props) => {
  const {
    children,
  } = props;

  return (
    <div className={classNames.footer}>
      { children }
    </div>
  );
};

export default Footer;
