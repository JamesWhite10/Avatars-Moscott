import React, { FC } from 'react';
import { observer } from 'mobx-react';
import classNames from './BottomControls.module.scss';
import { useMedia } from 'react-use';
import { screenSizes } from '@app/config/media';
import NavPanelMobile from '@app/components/NavPanel';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import AvatarPanelNavItem from '../AvatarPanel/AvatarPanelNavItem';
import StylePanelNavItem from '@app/containers/Editor/containers/StylePanel/StylePanelNavItem';
import HeadPanelNavItem from '../HeadPanel/HeadPanelNavItem';
import EyePanelNavItem from '../EyePanel/EyePanelNavItem';
import BodyPanelNavItem from '../BodyPanel/BodyPanelNavItem';
import BackgroundPanelNavItem from '../BackgroundPanel/BackgroundPanelNavItem';
import AnimationsPanelNavItem from '../AnimationsPanel/AnimationsPanelNavItem';
import ShoesPanelNavItem from '@app/containers/Editor/containers/ShoesPanel/ShoesPanelNavItem';
import AnimationsPanelMobile from '@app/containers/Editor/containers/AnimationsPanel/AnimationsPanelMobile';
import AvatarPanelMobile from '@app/containers/Editor/containers/AvatarPanel/AvatarPanelMobile';
import StylePanelMobile from '@app/containers/Editor/containers/StylePanel/StylePanelMobile';

const BottomControls: FC = observer(() => {
  const isDesktop = useMedia(screenSizes.mqDesktop, false);

  return (
    <>
      {!isDesktop && <NavPanelMobile>
        <Swiper
          freeMode
          slidesPerView="auto"
          spaceBetween={12}
          modules={[FreeMode]}
        >
          <SwiperSlide className={classNames.animationsSlideItem}>
            <NavPanelMobile.Group>
              <AvatarPanelNavItem />
              <StylePanelNavItem />
            </NavPanelMobile.Group>
          </SwiperSlide>
          <SwiperSlide className={classNames.animationsSlideItem}>
            <NavPanelMobile.Group>
              <HeadPanelNavItem />
              <EyePanelNavItem />
              <BodyPanelNavItem />
              <ShoesPanelNavItem />
              <BackgroundPanelNavItem />
            </NavPanelMobile.Group>
          </SwiperSlide>
          <SwiperSlide className={classNames.animationsSlideItem}>
            <NavPanelMobile.Group>
              <AnimationsPanelNavItem />
            </NavPanelMobile.Group>
          </SwiperSlide>
        </Swiper>
      </NavPanelMobile>}
      {!isDesktop && <AvatarPanelMobile />}
      {!isDesktop && <AnimationsPanelMobile />}
      {!isDesktop && <StylePanelMobile />}
    </>
  );
});

export default BottomControls;
