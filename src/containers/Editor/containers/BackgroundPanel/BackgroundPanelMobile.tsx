import React, { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { useBackgroundStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { Swiper as SwiperClass } from 'swiper';
import { useClickAway } from 'react-use';
import Fade from '@app/components/Transition/Fade';
import classNames from '@app/containers/Editor/containers/HeadPanel/HeadPanel.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '@app/components/Card';
import { BackgroundPart } from '@app/types';

const BackgroundPanelMobile: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    backgrounds,
    activeBackground,
    onBackgroundChange,
    showBackgroundSelection,
    controlElement,
    setShowBackgroundSelection,
    isLoadingBackground,
    panelId,
  } = useBackgroundStore();

  const areaRef = useRef<SwiperClass>(null);
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showBackgroundSelection) return;
    if (!controlElement.contains(e.target as Node)) setShowBackgroundSelection(false);
  });

  const cardCLickHandler = useCallback((background: BackgroundPart) => {
    if (!isLoadingBackground) onBackgroundChange(background);
  }, [isLoadingBackground]);

  return (
    <Fade
      appear
      unmountOnExit
      enable={showBackgroundSelection && activePanelId === panelId}
      className={classNames.sliderContainer}
    >
      <div className={classNames.sliderWrapper}>
        <Swiper
          ref={areaRef}
          freeMode
          slidesPerView="auto"
          spaceBetween={6}
        >
          {backgrounds.map((background) => (
            <SwiperSlide
              key={background.id}
              className={classNames.slideItem}
            >
              <Card
                contentType="image"
                image={background.image}
                active={background.id === activeBackground}
                onClick={() => cardCLickHandler(background)}
                isLoading={isLoadingBackground}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Fade>
  );
});

export default BackgroundPanelMobile;
