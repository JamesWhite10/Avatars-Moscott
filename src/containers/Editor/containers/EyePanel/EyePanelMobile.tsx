import React, { FC, MutableRefObject, useCallback, useMemo, useRef } from 'react';
import { observer } from 'mobx-react';
import { useEyeStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useClickAway } from 'react-use';
import Fade from '@app/components/Transition/Fade';
import classNames from '@app/containers/Editor/containers/HeadPanel/HeadPanel.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '@app/components/Card';
import { Swiper as SwiperClass } from 'swiper';

const EyePanelMobile: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    eyes,
    activeEye,
    onEyeChange,
    showEyeSelection,
    controlElement,
    setShowEyeSelection,
    isLoadingEye,
    panelId,
  } = useEyeStore();

  const areaRef = useRef<SwiperClass>(null);
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showEyeSelection) return;
    if (!controlElement.contains(e.target as Node)) setShowEyeSelection(false);
  });

  const cardCLickHandler = useCallback((eye: string) => {
    if (!isLoadingEye) onEyeChange(eye);
  }, [isLoadingEye]);

  const eyesTexture = useMemo(() => {
    const texture: string[] = [];
    eyes.forEach((eye) => {
      if (eye.texturesMap) {
        Object.keys(eye.texturesMap).forEach((item) => {
          if (item.includes('eyes')) texture.push(eye.texturesMap[item]);
        });
      }
    });
    return texture;
  }, [eyes]);

  return (
    <Fade
      appear
      unmountOnExit
      enable={showEyeSelection && activePanelId === panelId}
      className={classNames.sliderContainer}
    >
      <div className={classNames.sliderWrapper}>
        <Swiper
          ref={areaRef}
          freeMode
          slidesPerView="auto"
          spaceBetween={6}
        >
          {eyesTexture.map((eye) => (
            <SwiperSlide
              key={eye}
              className={classNames.slideItem}
            >
              <Card
                contentType="image"
                image={eye}
                active={eye === activeEye}
                onClick={() => cardCLickHandler(eye)}
                isLoading={isLoadingEye}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Fade>
  );
});

export default EyePanelMobile;
