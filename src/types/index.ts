export type AvatarName = 'Mira' | 'Yuki';

export type EnvironmentConfigType = {
  background: string;
  environment: string;
};

export type IdleAnimationType = {
  id: string;
  name: string;
};

export type Avatar = {
  id: string;
  name: string;
  description?: string;
  image: string;
  renderImage?: string;
  icon: JSX.Element;
  model: string;
  animations?: IdleAnimationType[];
};

export type Style = {
  id: string;
  background: { [key: string]: string };
  videoBackground: { [key: string]: string };
  name: string;
  model?: string;
  videoUrl: string;
  animations: IdleAnimationType[];
};

export type AnimationsType = {
  id: string;
  name: string;
  animation: string;
};
