import React, { FC } from 'react';
import classNames from './NavPanel.module.scss';
import Group from '@app/components/NavPanel/Group';
import Fade from '@app/components/Transition/Fade';
import { NavPanelProps, NavPanelType } from '@app/components/NavPanel/NavPanel';

const NavPanelMobile: FC<NavPanelProps> & NavPanelType = ({ children }) => {
  return (
    <Fade className={classNames.root_mobile}>
      <div className={classNames.slider_wrapper}>
        { children }
      </div>
    </Fade>
  );
};

NavPanelMobile.Group = Group;

export default NavPanelMobile;
