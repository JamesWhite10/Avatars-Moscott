import { FC } from 'react';
import { Style } from '@app/types';
import Video from '@app/components/Video/Video';

export interface VideoMaterialsProps {
  items: Style[];
  videoId: string;
}

export const VideoMaterials: FC<VideoMaterialsProps> = (props) => {
  const {
    items,
    videoId,
  } = props;

  return (
    <>
      {items.map((style) => {
        return (
          <Video
            isPlayVideo={false}
            key={style.id}
            isVisible={false}
            id={videoId}
          >
            <source
              src={style.videoBackground[videoId]}
              type="video/webm"
            />
          </Video>
        );
      })}
    </>
  );
};
