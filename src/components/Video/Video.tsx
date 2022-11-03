import { FC } from 'react';
import cn from 'classnames';
import classNames from './Video.module.scss';

export interface VideoProps {
  isVisible: boolean;
  error?: string;
  isLoop?: true;
  isMuted?: boolean;
  isPlayVideo?: boolean;
  id?: string;
  sourceUrl: string;
}

const Video: FC<VideoProps> = (props) => {
  const {
    isVisible = true,
    isLoop = true,
    isMuted = true,
    sourceUrl,
    isPlayVideo = true,
    id = 'video',
    error = 'Sorry, your browser doesnt support this video.',
  } = props;

  return (
    <video
      id={id}
      autoPlay={isPlayVideo}
      loop={isLoop}
      playsInline
      muted={isMuted}
      preload="metadata"
      crossOrigin="anonymous"
      className={cn({ [classNames.videoHide]: !isVisible })}
    >
      <source
        src={sourceUrl}
        type="video/mp4"
      />
      {error}
    </video>
  );
};

export default Video;
