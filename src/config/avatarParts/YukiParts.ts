import { AvatarPart } from '../../types/index';

export const YukiBase: AvatarPart = {
  id: 'yuki_head',
  source: '/3d/assets/models/Yuki/vrms/yuki_base.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Base/yukiheadtail_color.jpg',
    base_alternate: '/3d/assets/models/Yuki/textures/Base/yukiheadtail_color_alternate.png',
  },
  slots: ['base'],
};

export const YukiEyes: AvatarPart = {
  id: 'yuki_eyes',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Base/blue_eyes.jpg',
    base_alternate: '/3d/assets/models/Yuki/textures/Base/blue_eyes_alternate.png',
  },
  slots: ['eye'],
};

export const YukiCostumeCoat = {
  id: 'yuki_costume_coat',
  source: '/3d/assets/models/Yuki/vrms/yuki_costume_coat.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Costumes/yukibasecostume_color.jpg',
    base_alternate: '/3d/assets/models/Yuki/textures/Costumes/yukibasecostume_color_alternate.png',
  },
  slots: ['costume'],
};

export const YukiCostumeHacker = {
  id: 'yuki_costume_hacker',
  source: '/3d/assets/models/Yuki/vrms/yuki_costume_hacker.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Costumes/yukihacker_color.jpg',
    base_alternate: '/3d/assets/models/Yuki/textures/Costumes/yukihacker_color_alternate.png',
  },
  slots: ['costume'],
};

export const YukiHairCoats = {
  id: 'yuki_hair_coats',
  source: '/3d/assets/models/Yuki/vrms/yuki_hair_coat.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Hair/hair_boy_color.jpg',
    base_alternate: '/3d/assets/models/Yuki/textures/Hair/hair_boy_color_alternate.png',
  },
  slots: ['hair'],
};

export const YukiHairHacker = {
  id: 'yuki_hair_hacker',
  source: '/3d/assets/models/Yuki/vrms/yuki_hair_hacker.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Hair/yukihairhacker_color.jpg',
    base_alternate: '/3d/assets/models/Yuki/textures/Hair/yukihairhacker_color_alternate.png',
  },
  slots: ['hair'],
};

export const YukiShoesCoat = {
  id: 'yuki_shoes_coat',
  source: '/3d/assets/models/Yuki/vrms/yuki_shoes_coat.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Shoes/yuki_shoes_coat.png',
    base_alternate: '/3d/assets/models/Yuki/textures/Shoes/yuki_shoes_coat_alternate.png',
  },
  slots: ['shoes'],
};

export const YukiShoesHacker = {
  id: 'yuki_shoes_hacker',
  source: '/3d/assets/models/Yuki/vrms/yuki_shoes_hacker.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Shoes/yuki_shoes_hacker.png',
    base_alternate: '/3d/assets/models/Yuki/textures/Shoes/yuki_shoes_hacker_alternate.png',
  },
  slots: ['shoes'],
};
