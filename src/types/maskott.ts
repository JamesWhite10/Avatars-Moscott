import { MaskottEnum } from '../enum/MaskottEnum';

// TODO описать структуру
export type Maskott = {
  name: MaskottEnum | string;
  description?: string;
  image: string;
  id: string;
  styles?: [];
  icon: JSX.Element;
};

export type MaskottStyle = {
  id: string;
  name: string;
  videoUrl: string;
};
