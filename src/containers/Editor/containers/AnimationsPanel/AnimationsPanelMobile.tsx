import React, { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import Fade from '@app/components/Transition/Fade';
import classNames from './AnimationsPanel.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Swiper as SwiperClass } from 'swiper';
import AnimatedButton from '@app/components/AnimatedButton';
import { useAnimationsStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useClickAway } from 'react-use';

const AnimationsPanelMobile: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    controlElements,
    showAnimationSelection,
    animations,
    activeAnimationId,
    progress,
    setActiveAnimationId,
    setShowAnimationSelection,
    isPaused,
    setIsPaused,
    onStop,
    panelId,
  } = useAnimationsStore();
  const areaRef = useRef<SwiperClass>();
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElements || !e.target || !showAnimationSelection) return;
    const control = controlElements.find((item) => item.contains(e.target as Node));
    if (!control) {
      setShowAnimationSelection(false);
      onStop();
    }
  });

  const animationSelectHandler = useCallback((id: string) => {
    if (activeAnimationId === id) {
      setIsPaused(!isPaused);
      return;
    }
    setActiveAnimationId(id);
    setIsPaused(false);
  }, [activeAnimationId, isPaused]);

  const animationIsActive = useCallback((id: string) => {
    return id === activeAnimationId;
  }, [activeAnimationId]);

  return (
    <Fade
      appear
      unmountOnExit
      enable={showAnimationSelection && activePanelId === panelId}
      className={classNames.animationSliderContainer}
    >
      <div className={classNames.sliderWrapper}>
        <Swiper
          ref={areaRef}
          freeMode
          slidesPerView="auto"
          spaceBetween={6}
          modules={[FreeMode]}
        >
          {animations.map((animation) => (
            <SwiperSlide
              key={animation.id}
              className={classNames.animationsSlideItem}
            >
              <AnimatedButton
                isPaused={isPaused}
                progress={progress}
                onClick={() => animationSelectHandler(animation.id)}
                active={animationIsActive(animation.id)}
              >
                { animation.name }
              </AnimatedButton>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Fade>
  );
});

export default AnimationsPanelMobile;
