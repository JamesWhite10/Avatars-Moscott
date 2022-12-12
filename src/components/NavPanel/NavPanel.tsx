import React, { FC, ReactNode } from 'react';
import classNames from '@app/components/NavPanel/NavPanel.module.scss';
import Group from '@app/components/NavPanel/Group';
import Fade from '@app/components/Transition/Fade';

export type NavPanelType = {
  Group: typeof Group;
};

export interface NavPanelProps {
  children: ReactNode;
}

const NavPanel: FC<NavPanelProps> & NavPanelType = ({ children }) => {
  return (
    <Fade className={classNames.root}>
      <div className={classNames.scroll_wrapper}>
        {children}
      </div>
    </Fade>
  );
};

NavPanel.Group = Group;

export default NavPanel;
