import React, { FC, MutableRefObject, useRef } from 'react';
import { observer } from 'mobx-react';
import { useAvatarStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { Swiper as SwiperClass } from 'swiper';
import { useClickAway } from 'react-use';
import Fade from '@app/components/Transition/Fade';
import classNames from './AvatarPanel.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '@app/components/Card';

const AvatarPanelMobile: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    isPrepared,
    showCharacterSelection,
    onCharacterChange,
    character,
    characters,
    setShowCharacterSelection,
    controlElement,
    panelId,
  } = useAvatarStore();

  const areaRef = useRef<SwiperClass>();
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showCharacterSelection) return;
    if (!controlElement.contains(e.target as Node)) setShowCharacterSelection(false);
  });

  if (!isPrepared) return null;

  return (
    <Fade
      appear
      unmountOnExit
      enable={showCharacterSelection && activePanelId === panelId}
      className={classNames.sliderContainer}
    >
      <div
        className={classNames.sliderWrapper}
        onClick={() => setShowCharacterSelection(false)}
      >
        <Swiper
          ref={areaRef}
          freeMode
          slidesPerView="auto"
          spaceBetween={6}
        >
          {characters.map((_character) => (
            <SwiperSlide
              key={_character.id}
              className={classNames.slideItem}
            >
              <Card
                contentType="image"
                active={_character.id === character?.id}
                image={_character.image}
                label={_character.name}
                onClick={() => onCharacterChange(_character.id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Fade>
  );
});

export default AvatarPanelMobile;
