import React, { FC } from 'react';
import { observer } from 'mobx-react';
import NavButton from '@app/components/NavButton';
import CostumeIcon from '@app/components/Icons/CostumeIcon';

const BodyPanelNavItem: FC = observer(() => {
  return (
    <NavButton
      icon={<CostumeIcon />}
      disabled
    />
  );
});

export default BodyPanelNavItem;
