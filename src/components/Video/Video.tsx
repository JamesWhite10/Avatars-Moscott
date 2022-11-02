import { FC, ReactNode } from 'react';
import cn from 'classnames';
import classNames from './Video.module.scss';

export interface VideoProps {
  isVisible: boolean;
  children: ReactNode;
  error?: string;
  isLoop?: true;
  isMuted?: boolean;
  isPlayVideo?: boolean;
  id?: string;
}

const Video: FC<VideoProps> = (props) => {
  const {
    isVisible = true,
    children,
    isLoop = true,
    isMuted = true,
    isPlayVideo = true,
    id = 'video',
    error = 'Sorry, your browser doesnt support this video.',
  } = props;

  return (
    <video
      id={id}
      autoPlay={isPlayVideo}
      loop={isLoop}
      muted={isMuted}
      preload="metadata"
      crossOrigin="anonymous"
      className={cn({ [classNames.videoHide]: !isVisible })}
    >
      {children}
      {error}
    </video>
  );
};

export default Video;
