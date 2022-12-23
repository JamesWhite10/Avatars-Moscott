import React, { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import Fade from '@app/components/Transition/Fade';
import classNames from './StylePanel.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '@app/components/Card';
import { usePanelsStore, useStyleStore } from '@app/containers/Editor/hooks/useEditorStore';
import { Swiper as SwiperClass } from 'swiper';
import { useClickAway } from 'react-use';
import { Style } from '@app/types';

const StylePanelMobile: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    activeStyle,
    styles,
    onStyleChange,
    showStyleSelection,
    controlElement,
    setShowStyleSelection,
    isLoadingStyle,
    panelId,
  } = useStyleStore();

  const areaRef = useRef<SwiperClass>();
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showStyleSelection) return;
    if (!controlElement.contains(e.target as Node)) setShowStyleSelection(false);
  });

  const cardCLickHandler = useCallback((style: Style) => {
    if (!isLoadingStyle) onStyleChange(style.id);
  }, [isLoadingStyle]);

  return (
    <Fade
      appear
      unmountOnExit
      enable={showStyleSelection && activePanelId === panelId}
      className={classNames.sliderContainer}
    >
      <div className={classNames.sliderWrapper}>
        <Swiper
          ref={areaRef}
          freeMode
          slidesPerView="auto"
          spaceBetween={6}
        >
          {styles.map((style) => (
            <SwiperSlide
              key={style.id}
              className={classNames.slideItem}
            >
              <Card
                contentType="video"
                active={style.id === activeStyle}
                video={style.videoUrl}
                onClick={() => cardCLickHandler(style)}
                isLoading={isLoadingStyle}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Fade>
  );
});

export default StylePanelMobile;
