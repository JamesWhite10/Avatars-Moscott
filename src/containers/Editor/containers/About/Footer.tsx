import { FC, PropsWithChildren } from 'react';
import classNames from './About.module.scss';
import { useMedia } from 'react-use';
import { screenSizes } from '@app/config/media';

const Footer: FC<PropsWithChildren> = (props) => {
  const {
    children,
  } = props;

  const isMobile = useMedia(screenSizes.mqMobile, false);

  return (
    <div className={`${isMobile ? classNames.footerModal : classNames.footer}`}>
      { children }
    </div>
  );
};

export default Footer;
