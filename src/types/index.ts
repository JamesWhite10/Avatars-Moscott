export type AvatarName = 'Mira' | 'Yuki';

export type EnvironmentConfigType = {
  background: string;
  environment: string;
};

export type IdleAnimationType = {
  id: string;
  name: string;
};

export type Slot = 'hair' | 'eye' | 'costume' | 'base' | 'shoes' | string;

export type AvatarPart = {
  id: string;
  image: string;
  source?: string;
  eyeImage: Record<string, string>;
  texturesMap: Record<string, string>;
  slots: Slot[];
};

export type Avatar = {
  id: string;
  name: AvatarName;
  description?: string;
  basePart: Slot;
  image: string;
  renderImage?: string;
  icon: JSX.Element;
  parts: AvatarPart[];
  slots: Slot[];
  animations?: IdleAnimationType[];
};

export type Style = {
  id: string;
  background: { [key: string]: string };
  videoBackground: { [key: string]: string };
  name: string;
  parts: AvatarPart[];
  videoUrl: string;
  animations: IdleAnimationType[];
};

export type AnimationsType = {
  id: string;
  name: string;
  animation: string;
};

export type BackgroundPart = {
  id: string;
  image: string;
};
