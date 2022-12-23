import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { useMedia } from 'react-use';
import NavPanel from '@app/components/NavPanel/NavPanel';
import AvatarPanelNavItem from '../AvatarPanel/AvatarPanelNavItem';
import StylePanelNavItem from '@app/containers/Editor/containers/StylePanel/StylePanelNavItem';
import HeadPanelNavItem from '../HeadPanel/HeadPanelNavItem';
import EyePanelNavItem from '../EyePanel/EyePanelNavItem';
import BodyPanelNavItem from '../BodyPanel/BodyPanelNavItem';
import ShoesPanelNavItem from '../ShoesPanel/ShoesPanelNavItem';
import BackgroundPanelNavItem from '../BackgroundPanel/BackgroundPanelNavItem';
import AnimationsPanelNavItem from '../AnimationsPanel/AnimationsPanelNavItem';
import { screenSizes } from '@app/config/media';
import AnimationsPanel from '@app/containers/Editor/containers/AnimationsPanel/AnimationsPanel';
import AvatarPanel from '@app/containers/Editor/containers/AvatarPanel/AvatarPanel';
import StylePanel from '@app/containers/Editor/containers/StylePanel/StylePanel';
import HeadPanel from '@app/containers/Editor/containers/HeadPanel/HeadPanel';
import BodyPanel from '../BodyPanel/BodyPanel';
import ShoesPanel from '../ShoesPanel/ShoesPanel';
import BackgroundPanel from '../BackgroundPanel/BackgroundPanel';
import EyePanel from '../EyePanel/EyePanel';

const LeftControls: FC = observer(() => {
  const isDesktop = useMedia(screenSizes.mqDesktop, false);

  return (
    <>
      {isDesktop && <NavPanel>
        <NavPanel.Group>
          <AvatarPanelNavItem />
          <StylePanelNavItem />
        </NavPanel.Group>
        <NavPanel.Group>
          <HeadPanelNavItem />
          <EyePanelNavItem />
          <BodyPanelNavItem />
          <ShoesPanelNavItem />
          <BackgroundPanelNavItem />
        </NavPanel.Group>
        <NavPanel.Group>
          <AnimationsPanelNavItem />
        </NavPanel.Group>
      </NavPanel>}
      {isDesktop && <AnimationsPanel /> }
      {isDesktop && <AvatarPanel /> }
      {isDesktop && <StylePanel /> }
      {isDesktop && <HeadPanel /> }
      {isDesktop && <BodyPanel /> }
      {isDesktop && <ShoesPanel /> }
      {isDesktop && <BackgroundPanel /> }
      {isDesktop && <EyePanel /> }
    </>
  );
});

export default LeftControls;
