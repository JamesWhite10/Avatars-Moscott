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
            sourceUrl={style.videoBackground[videoId]}
            isPlayVideo={false}
            key={style.id}
            isVisible={false}
            id={videoId}
          />
        );
      })}
    </>
  );
};
