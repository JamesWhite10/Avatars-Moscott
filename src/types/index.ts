import { MaskottEnum } from '../enum/MaskottEnum';

export type AvatarName = 'Mira' | 'Yuki';

export type EnvironmentConfigType = {
  background: string;
  environment: string;
};

/**
 * FROM Editor
 */
export type StaticAnimationType = {
  id: string;
  name: string;
};

// TODO возможно будет доработано после реализации анимаций
export type IdleAnimationType = {
  idle: true;
} & StaticAnimationType;

export type Avatar = {
  id: string;
  name: MaskottEnum | string;
  description?: string;
  image: string;
  icon: JSX.Element;
  model: string;
  animations?: IdleAnimationType[];
};

export type Style = {
  id: string;
  background: { [key: string]: string };
  name: string;
  model?: string;
  videoUrl: string;
};
