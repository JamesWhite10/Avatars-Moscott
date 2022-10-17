import { MaskottEnum } from '../enum/MaskottEnum';

// TODO описать структуру
export type Maskott = {
  name: MaskottEnum;
  id?: string;
  styles: [];
};

export type MaskottStyle = {
  id: string;
  name: string;
  videoUrl: string;
};
