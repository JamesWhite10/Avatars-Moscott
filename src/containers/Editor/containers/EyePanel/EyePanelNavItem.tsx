import React, { FC } from 'react';
import { observer } from 'mobx-react';
import EyesIcon from '@app/components/Icons/EyesIcon';
import NavButton from '@app/components/NavButton';

const EyePanelNavItem: FC = observer(() => {
  return (
    <NavButton
      icon={<EyesIcon />}
      disabled
    />
  );
});

export default EyePanelNavItem;
