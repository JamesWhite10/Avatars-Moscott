import { AvatarPart } from '../../types/index';
import MiraCostume1 from '../../assets/scrolingPanel/mira_costume_1.png';
import MiraCostume2 from '../../assets/scrolingPanel/mira_costume_2.png';
import MiraShoes1 from '../../assets/scrolingPanel/mira_shoes_1.png';
import MiraShoes2 from '../../assets/scrolingPanel/mira_shoes_2.png';
import MiraHair1 from '../../assets/scrolingPanel/mira_hair_1.png';
import MiraHair2 from '../../assets/scrolingPanel/mira_hair_2.png';

export const MiraBase: AvatarPart = {
  id: 'mira_head',
  image: '',
  source: '/3d/assets/models/Mira/vrms/mira_base.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Base/miraheadtail_color.jpg',
    alternate: '/3d/assets/models/Mira/textures/Base/miraheadtail_color_alternate.png',
    mira_eyes_base: '/3d/assets/models/Mira/textures/Base/blue_eyes.jpg',
    mira_eyes_alternate: '/3d/assets/models/Mira/textures/Base/blue_eyes_alternate.png',
    mira_lashes_base: '/3d/assets/models/Mira/textures/Base/lashes_color.png',
    mira_lashes_alternate: '/3d/assets/models/Mira/textures/Base/lashes_color_alternate.png',

  },
  slots: ['base', 'eye', 'lashes'],
};

export const MiraCostumeDress = {
  id: 'mira_costume_dress',
  image: MiraCostume1.src,
  source: '/3d/assets/models/Mira/vrms/mira_costume_dress.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Costumes/mirabasedress_color.jpg',
    alternate: '/3d/assets/models/Mira/textures/Costumes/mirabasedress_color_alternate.png',
  },
  slots: ['costume'],
};

export const MiraCostumeSpace = {
  id: 'mira_costume_space',
  image: MiraCostume2.src,
  source: '/3d/assets/models/Mira/vrms/mira_costume_space.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Costumes/mira_space_color.jpg',
    alternate: '/3d/assets/models/Mira/textures/Costumes/mira_space_color_alternate.png',
  },
  slots: ['costume'],
};

export const MiraHairBraids = {
  id: 'mira_hair_braids',
  image: MiraHair1.src,
  source: '/3d/assets/models/Mira/vrms/mira_hair_braids.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Hair/hair_braids_color.jpg',
    alternate: '/3d/assets/models/Mira/textures/Hair/hair_braids_color_alternate.png',
  },
  slots: ['hair'],
};

export const MiraHairTail = {
  id: 'mira_hair_tail',
  image: MiraHair2.src,
  source: '/3d/assets/models/Mira/vrms/mira_hair_tail.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Hair/hair_tail_color.jpg',
    alternate: '/3d/assets/models/Mira/textures/Hair/hair_tail_color_alternate.png',
  },
  slots: ['hair'],
};

export const MiraShoesDress = {
  id: 'mira_shoes_dress',
  image: MiraShoes1.src,
  source: '/3d/assets/models/Mira/vrms/mira_shoes_dress.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Shoes/mira_shoes_dress.png',
    alternate: '/3d/assets/models/Mira/textures/Shoes/mira_shoes_dress_alternate.png',
  },
  slots: ['shoes'],
};

export const MiraShoesSpace = {
  id: 'mira_shoes_space',
  image: MiraShoes2.src,
  source: '/3d/assets/models/Mira/vrms/mira_shoes_space.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Shoes/mira_shoes_space.png',
    alternate: '/3d/assets/models/Mira/textures/Shoes/mira_shoes_space_alternate.png',
  },
  slots: ['shoes'],
};
