import {
  FC, PropsWithChildren, useCallback, useMemo, useRef, useState,
} from 'react';
import classNames from './Card.module.scss';
import cn from 'classnames';

export interface CardProps {
  image?: string;
  video?: string;
  active?: boolean;
  label?: string;
  contentType?: 'image' | 'video';
  onClick?: () => void;
}

const Card: FC<PropsWithChildren<CardProps>> = (props) => {
  const {
    image,
    video,
    active,
    contentType = 'image',
    label,
    onClick = () => undefined,
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
      className={cn(classNames.overlay, { [classNames.overlay_active]: active })}
      onMouseEnter={playVideoHandler}
      onMouseLeave={stopVideoHandler}
      onTouchStart={playVideoHandler}
      onTouchEnd={stopVideoHandler}
    >
      <div
        className={classNames.root}
        onClick={onClick}
      >
        {needShowImage && <img
          className={classNames.image}
          src={image}
          alt="image"
        />}
        {needShowVideo && <video
          ref={videoRef}
          style={{ width: 80, height: 160 }}
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
