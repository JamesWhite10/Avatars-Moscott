import React, { FC } from 'react';
import { observer } from 'mobx-react';
import NavButton from '@app/components/NavButton';
import HairstyleIcon from '@app/components/Icons/HairstyleIcon';

const HeadPanelNavItem: FC = observer(() => {
  return (
    <NavButton
      icon={<HairstyleIcon />}
      disabled
    />
  );
});

export default HeadPanelNavItem;
