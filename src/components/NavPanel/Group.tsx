import React, { FC, PropsWithChildren } from 'react';
import classNames from './NavPanel.module.scss';
import { useMedia } from 'react-use';
import { screenSizes } from '@app/config/media';
import cn from 'classnames';
import Fade from '@app/components/Transition/Fade';

const Group: FC<PropsWithChildren> = (props) => {
  const {
    children,
  } = props;

  const isDesktop = useMedia(screenSizes.mqDesktop, false);

  return (
    <Fade className={cn(classNames.root_group, { [classNames.root_group_desktop]: isDesktop })}>
      { children }
    </Fade>
  );
};

export default Group;
