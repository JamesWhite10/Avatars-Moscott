import React, { FC } from 'react';
import { observer } from 'mobx-react';
import NavButton from '@app/components/NavButton';
import BackgroundIcon from '@app/components/Icons/BackgroundIcon';

const BackgroundPanelNavItem: FC = observer(() => {
  return (
    <NavButton
      icon={<BackgroundIcon />}
      disabled
    />
  );
});

export default BackgroundPanelNavItem;
