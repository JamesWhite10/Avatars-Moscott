import React, { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { usePanelsStore, useShoesStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useClickAway } from 'react-use';
import { AvatarPart } from '@app/types';
import Fade from '@app/components/Transition/Fade';
import classNames from '@app/containers/Editor/containers/HeadPanel/HeadPanel.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '@app/components/Card';
import { Swiper as SwiperClass } from 'swiper';

const ShoesPanelMobile: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    shoes,
    activeShoes,
    onShoesChange,
    showShoesSelection,
    controlElement,
    setShowShoesSelection,
    isLoadingShoes,
    panelId,
  } = useShoesStore();

  const areaRef = useRef<SwiperClass>(null);
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showShoesSelection) return;
    if (!controlElement.contains(e.target as Node)) setShowShoesSelection(false);
  });

  const cardCLickHandler = useCallback((head: AvatarPart) => {
    if (!isLoadingShoes) onShoesChange(head);
  }, [isLoadingShoes]);

  return (
    <Fade
      appear
      unmountOnExit
      enable={showShoesSelection && activePanelId === panelId}
      className={classNames.sliderContainer}
    >
      <div className={classNames.sliderWrapper}>
        <Swiper
          ref={areaRef}
          freeMode
          slidesPerView="auto"
          spaceBetween={6}
        >
          {shoes.map((shoe) => (
            <SwiperSlide
              key={shoe.id}
              className={classNames.slideItem}
            >
              <Card
                contentType="image"
                image={shoe.image}
                active={shoe.id === activeShoes}
                onClick={() => cardCLickHandler(shoe)}
                isLoading={isLoadingShoes}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Fade>
  );
});

export default ShoesPanelMobile;
