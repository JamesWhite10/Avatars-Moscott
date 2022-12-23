import React, { FC } from 'react';
import { observer } from 'mobx-react';
import ShoesIcon from '@app/components/Icons/ShoesIcon';
import NavButton from '@app/components/NavButton';

const ShoesPanelNavItem: FC = observer(() => {
  return (
    <NavButton
      icon={<ShoesIcon />}
      disabled
    />
  );
});

export default ShoesPanelNavItem;
