import { AvatarPart } from '@app/types';
import YukiCostume1 from '../../assets/scrolingPanel/yuki_costume_1.png';
import YukiCostume2 from '../../assets/scrolingPanel/yuki_costume_2.png';
import YukiShoes1 from '../../assets/scrolingPanel/yuki_shoes_1.png';
import YukiShoes2 from '../../assets/scrolingPanel/yuki_shoes_2.png';
import YukiHair1 from '../../assets/scrolingPanel/yuki_hair_1.png';
import YukiHair2 from '../../assets/scrolingPanel/yuki_hair_2.png';

export const YukiBase: AvatarPart = {
  id: 'yuki_head',
  image: '',
  source: '/3d/assets/models/Yuki/vrms/yuki_base.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Base/yukiheadtail_color.jpg',
    alternate: '/3d/assets/models/Yuki/textures/Base/yukiheadtail_color_alternate.png',
    yuki_eyes_base: '/3d/assets/models/Yuki/textures/Base/blue_eyes.jpg',
    yuki_eyes_alternate: '/3d/assets/models/Yuki/textures/Base/blue_eyes_alternate.png',
  },
  slots: ['base', 'eye'],
};

export const YukiCostumeCoat = {
  id: 'yuki_costume_coat',
  image: YukiCostume1.src,
  source: '/3d/assets/models/Yuki/vrms/yuki_costume_coat.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Costumes/yukibasecostume_color.jpg',
    alternate: '/3d/assets/models/Yuki/textures/Costumes/yukibasecostume_color_alternate.png',
  },
  slots: ['costume'],
};

export const YukiCostumeHacker = {
  id: 'yuki_costume_hacker',
  image: YukiCostume2.src,
  source: '/3d/assets/models/Yuki/vrms/yuki_costume_hacker.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Costumes/yukihacker_color.jpg',
    alternate: '/3d/assets/models/Yuki/textures/Costumes/yukihacker_color_alternate.png',
  },
  slots: ['costume'],
};

export const YukiHairCoats = {
  id: 'yuki_hair_coats',
  image: YukiHair1.src,
  source: '/3d/assets/models/Yuki/vrms/yuki_hair_coat.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Hair/hair_boy_color.jpg',
    alternate: '/3d/assets/models/Yuki/textures/Hair/hair_boy_color_alternate.png',
  },
  slots: ['hair'],
};

export const YukiHairHacker = {
  id: 'yuki_hair_hacker',
  image: YukiHair2.src,
  source: '/3d/assets/models/Yuki/vrms/yuki_hair_hacker.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Hair/yukihairhacker_color.jpg',
    alternate: '/3d/assets/models/Yuki/textures/Hair/yukihairhacker_color_alternate.png',
  },
  slots: ['hair'],
};

export const YukiShoesCoat = {
  id: 'yuki_shoes_coat',
  image: YukiShoes1.src,
  source: '/3d/assets/models/Yuki/vrms/yuki_shoes_coat.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Shoes/yuki_shoes_coat.png',
    alternate: '/3d/assets/models/Yuki/textures/Shoes/yuki_shoes_coat_alternate.png',
  },
  slots: ['shoes'],
};

export const YukiShoesHacker = {
  id: 'yuki_shoes_hacker',
  image: YukiShoes2.src,
  source: '/3d/assets/models/Yuki/vrms/yuki_shoes_hacker.vrm',
  texturesMap: {
    base: '/3d/assets/models/Yuki/textures/Shoes/yuki_shoes_hacker.png',
    alternate: '/3d/assets/models/Yuki/textures/Shoes/yuki_shoes_hacker_alternate.png',
  },
  slots: ['shoes'],
};
