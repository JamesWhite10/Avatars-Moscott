import React, { FC } from 'react';
import { observer } from 'mobx-react';
import HairstyleIcon from '@app/components/Icons/HairstyleIcon';
import NavButton from '@app/components/NavButton';

const HeadPanel: FC = observer(() => {
  return (
    <NavButton
      icon={<HairstyleIcon />}
    />
  );
});

export default HeadPanel;
