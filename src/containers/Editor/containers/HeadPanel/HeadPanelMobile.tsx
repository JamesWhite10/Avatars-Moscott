import React, { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { useHeadStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { Swiper as SwiperClass } from 'swiper';
import { useClickAway } from 'react-use';
import { AvatarPart } from '@app/types';
import Fade from '@app/components/Transition/Fade';
import classNames from './HeadPanel.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '@app/components/Card';

const HeadPanelMobile: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    heads,
    activeHead,
    onHeadChange,
    showHeadSelection,
    controlElement,
    setShowHeadSelection,
    isLoadingHead,
    panelId,
  } = useHeadStore();

  const areaRef = useRef<SwiperClass>(null);
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showHeadSelection) return;
    if (!controlElement.contains(e.target as Node)) setShowHeadSelection(false);
  });

  const cardCLickHandler = useCallback((head: AvatarPart) => {
    if (!isLoadingHead) onHeadChange(head);
  }, [isLoadingHead]);

  return (
    <Fade
      appear
      unmountOnExit
      enable={showHeadSelection && activePanelId === panelId}
      className={classNames.sliderContainer}
    >
      <div className={classNames.sliderWrapper}>
        <Swiper
          ref={areaRef}
          freeMode
          slidesPerView="auto"
          spaceBetween={6}
        >
          {heads.map((head) => (
            <SwiperSlide
              key={head.id}
              className={classNames.slideItem}
            >
              <Card
                contentType="image"
                image={head.image}
                active={head.id === activeHead}
                onClick={() => cardCLickHandler(head)}
                isLoading={isLoadingHead}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Fade>
  );
});

export default HeadPanelMobile;
