import { FC, PropsWithChildren } from 'react';
import classNames from '../../About.module.scss';

const Header: FC<PropsWithChildren> = (props) => {
  const {
    children,
  } = props;
  return (
    <div className={classNames.header}>
      { children }
    </div>
  );
};

export default Header;
