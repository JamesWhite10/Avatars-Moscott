const animationDir = '/3d/assets/animations/';

export const getAnimationFile = (animationName: string, extension: string): string => {
  return `${animationDir}${animationName}.${extension}`;
};
