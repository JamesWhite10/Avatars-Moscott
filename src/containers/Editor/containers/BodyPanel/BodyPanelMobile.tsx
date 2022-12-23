import React, { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { useBodyStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import Fade from '@app/components/Transition/Fade';
import classNames from '@app/containers/Editor/containers/HeadPanel/HeadPanel.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '@app/components/Card';
import { Swiper as SwiperClass } from 'swiper';
import { useClickAway } from 'react-use';
import { AvatarPart } from '@app/types';

const BodyPanelMobile: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    bodies, activeBody, controlElement, onBodyChange, showBodySelection, setShowBodySelection, isLoadingBody, panelId,
  } = useBodyStore();

  const areaRef = useRef<SwiperClass>(null);
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showBodySelection) return;
    if (!controlElement.contains(e.target as Node)) setShowBodySelection(false);
  });

  const cardCLickHandler = useCallback((body: AvatarPart) => {
    if (!isLoadingBody) onBodyChange(body);
  }, [isLoadingBody]);

  return (
    <Fade
      appear
      unmountOnExit
      enable={showBodySelection && activePanelId === panelId}
      className={classNames.sliderContainer}
    >
      <div className={classNames.sliderWrapper}>
        <Swiper
          ref={areaRef}
          freeMode
          slidesPerView="auto"
          spaceBetween={6}
        >
          {bodies.map((body) => (
            <SwiperSlide
              key={body.id}
              className={classNames.slideItem}
            >
              <Card
                contentType="image"
                image={body.image}
                active={body.id === activeBody}
                onClick={() => cardCLickHandler(body)}
                isLoading={isLoadingBody}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Fade>
  );
});

export default BodyPanelMobile;
