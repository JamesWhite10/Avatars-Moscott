import {
  FC, MutableRefObject, useCallback, useRef,
} from 'react';
import { observer } from 'mobx-react';
import { useStyleStore } from '@app/containers/Editor/hooks/useEditorStore';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '@app/components/Card';
import classNames from './BottomControls.module.scss';
import Fade from '@app/components/Transition/Fade';
import { useClickAway } from 'react-use';
import { Swiper as SwiperClass } from 'swiper';
import { Style } from '@app/types';

const Styles: FC = observer(() => {
  const {
    activeStyle,
    styles,
    onStyleChange,
    showStyleSelection,
    controlElement,
    setShowStyleSelection,
    isLoadingStyle,
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
      enable={showStyleSelection}
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
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Fade>
  );
});

export default Styles;
