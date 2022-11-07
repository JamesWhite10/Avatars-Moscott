import { FC, PropsWithChildren } from 'react';
import classNames from '../../About.module.scss';

const Title: FC<PropsWithChildren> = (props) => {
  const {
    children,
  } = props;
  return (
    <div className={classNames.title}>
      { children }
    </div>
  );
};

export default Title;
