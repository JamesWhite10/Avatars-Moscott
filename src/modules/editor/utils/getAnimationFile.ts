const animationDir = '/3d/assets/animations/idleAnimation/';

export const getAnimationFile = (animationName: string, extension: string): string => {
  return `${animationDir}${animationName}.${extension}`;
};
