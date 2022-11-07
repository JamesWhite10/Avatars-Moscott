import React, { FC } from 'react';
import classNames from '../../About.module.scss';

interface AvatarImageProps {
  image?: string;
}

const AvatarImage: FC<AvatarImageProps> = (props) => {
  const { image } = props;
  return (
    <img
      className={classNames.image}
      src={image}
      alt="icon"
    />
  );
};

export default AvatarImage;
