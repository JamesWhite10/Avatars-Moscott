import { SwiperProps as InnerSwiperProps } from 'swiper/react/swiper-react';
import { MutableRefObject } from 'react';

declare module 'swiper/react' {
  export interface SwiperProps extends InnerSwiperProps {
    ref?: MutableRefObject<Swiper>;
  }
}
