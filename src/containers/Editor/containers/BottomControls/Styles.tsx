import {
  FC, MutableRefObject, useMemo, useRef,
} from 'react';
import { observer } from 'mobx-react';
import useEditorStore from '@app/containers/Editor/hooks/useEditorStore';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '@app/components/Card';
import classNames from './BottomControls.module.scss';
import Fade from '@app/components/Transition/Fade';
import { useClickAway } from 'react-use';
import { Swiper as SwiperClass } from 'swiper';

export interface StylesProps {
  onClose?: (e: Event) => void;
}

const Styles: FC<StylesProps> = observer((props) => {
  const {
    onClose = () => undefined,
  } = props;
  const {
    activeProperty,
    activeStyle,
    onStyleChange,
    styles,
  } = useEditorStore().controlsStore;

  const needShowStyles = useMemo(() => {
    return activeProperty === 'style';
  }, [activeProperty]);

  const areaRef = useRef<SwiperClass>();

  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    onClose(e);
  });

  return (
    <>
      <Fade
        appear
        unmountOnExit
        enable={needShowStyles}
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
                  onClick={() => onStyleChange(style.id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Fade>
    </>
  );
});

export default Styles;
