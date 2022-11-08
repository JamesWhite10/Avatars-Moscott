import { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { useAnimationStore } from '@app/containers/Editor/hooks/useEditorStore';
import Fade from '@app/components/Transition/Fade';
import { Swiper, SwiperSlide } from 'swiper/react';
import AnimatedButton from '@app/components/AnimatedButton';
import classNames from './BottomControls.module.scss';
import { Swiper as SwiperClass, FreeMode } from 'swiper';
import { useClickAway } from 'react-use';

const AnimationsMobile: FC = observer(() => {
  const {
    controlElement,
    showAnimationSelection,
    animations,
    activeAnimationId,
    progress,
    setActiveAnimationId,
    setShowAnimationSelection,
    isPaused,
    setIsPaused,
    onStop,
  } = useAnimationStore();
  const areaRef = useRef<SwiperClass>();
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showAnimationSelection) return;
    if (!controlElement.contains(e.target as Node)) {
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
  }, [activeAnimationId, isPaused]);

  const animationIsActive = useCallback((id: string) => {
    return id === activeAnimationId && !isPaused;
  }, [activeAnimationId, isPaused]);

  return (
    <Fade
      appear
      unmountOnExit
      enable={showAnimationSelection}
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

export default AnimationsMobile;