import React, {
  FC, PropsWithChildren, useCallback, useMemo, useRef, useState,
} from 'react';
import classNames from './Card.module.scss';
import cn from 'classnames';
import Spin from '@app/components/Spin/Spin';

export type ContentSize = 'lg' | 'sm';

export interface CardProps {
  image?: string;
  video?: string;
  active?: boolean;
  label?: string;
  contentType?: 'image' | 'video';
  onClick?: () => void;
  contentSize?: ContentSize;
  isLoading?: boolean;
}

const Card: FC<PropsWithChildren<CardProps>> = (props) => {
  const {
    image,
    video,
    active,
    contentType = 'image',
    label,
    isLoading = false,
    onClick = () => undefined,
    contentSize = 'lg',
  } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoopPlay, setLoopPlay] = useState<boolean>(false);

  const playVideoHandler = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.playsInline = true;
    videoRef.current.play();
    setLoopPlay(true);
  }, [videoRef]);

  const stopVideoHandler = useCallback(() => {
    if (!videoRef.current) return;
    setLoopPlay(false);
  }, [videoRef, isLoopPlay]);

  const needShowImage = useMemo(() => {
    return contentType === 'image';
  }, [contentType]);

  const needShowVideo = useMemo(() => {
    return contentType === 'video';
  }, [contentType]);

  return (
    <div
      className={cn(classNames.overlay, { [classNames.overlay_active]: active }, { [classNames.cardSmall]: contentSize === 'sm' })}
      onMouseEnter={playVideoHandler}
      onMouseLeave={stopVideoHandler}
      onTouchStart={playVideoHandler}
      onTouchEnd={stopVideoHandler}
    >
      <div
        className={cn(classNames.root, classNames[contentSize])}
        onClick={onClick}
      >
        <Spin
          isActive={active && isLoading}
          overlayBackgroundColor="rgba(255,255,255,0.5)"
          color="#4145A7"
          borderRadius={12}
          position="fullscreen"
          indicatorSize={44}
        />
        {needShowImage && <img
          className={cn(classNames.image, classNames[contentSize])}
          src={image}
          alt="image"
        />}
        {needShowVideo && <video
          ref={videoRef}
          className={cn(classNames[contentSize])}
          muted
          controls={false}
          loop={isLoopPlay}
        >
          <source
            src={`${video}#t=0.001`}
            type="video/mp4"
          />
        </video>}
        {label && (
          <div className={classNames.label_container}>
            <div className={classNames.label}>
              {label}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
