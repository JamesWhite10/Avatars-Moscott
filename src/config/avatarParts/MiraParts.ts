import { AvatarPart } from '../../types/index';

export const MiraBase: AvatarPart = {
  id: 'mira_head',
  source: '/3d/assets/models/Mira/vrms/mira_base.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Base/miraheadtail_color.jpg',
    base_alternate: '/3d/assets/models/Mira/textures/Base/miraheadtail_color_alternate.png',
  },
  slots: ['base'],
};

export const MiraLashes: AvatarPart = {
  id: 'mira_lashes',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Base/lashes_color.png',
    base_alternate: '/3d/assets/models/Mira/textures/Base/lashes_color_alternate.png',
  },
  slots: ['lashes'],
};

export const MiraEyes: AvatarPart = {
  id: 'mira_eyes',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Base/blue_eyes.jpg',
    base_alternate: '/3d/assets/models/Mira/textures/Base/blue_eyes_alternate.png',
  },
  slots: ['eye'],
};

export const MiraCostumeDress = {
  id: 'mira_costume_dress',
  source: '/3d/assets/models/Mira/vrms/mira_costume_dress.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Costumes/mirabasedress_color.jpg',
    base_alternate: '/3d/assets/models/Mira/textures/Costumes/mirabasedress_color_alternate.png',
  },
  slots: ['costume'],
};

export const MiraCostumeSpace = {
  id: 'mira_costume_space',
  source: '/3d/assets/models/Mira/vrms/mira_costume_space.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Costumes/mira_space_color.jpg',
    base_alternate: '/3d/assets/models/Mira/textures/Costumes/mira_space_color_alternate.png',
  },
  slots: ['costume'],
};

export const MiraHairBraids = {
  id: 'mira_hair_braids',
  source: '/3d/assets/models/Mira/vrms/mira_hair_braids.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Hair/hair_braids_color.jpg',
    base_alternate: '/3d/assets/models/Mira/textures/Hair/hair_braids_color_alternate.png',
  },
  slots: ['hair'],
};

export const MiraHairTail = {
  id: 'mira_hair_tail',
  source: '/3d/assets/models/Mira/vrms/mira_hair_tail.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Hair/hair_tail_color.jpg',
    base_alternate: '/3d/assets/models/Mira/textures/Hair/hair_tail_color_alternate.png',
  },
  slots: ['hair'],
};

export const MiraShoesDress = {
  id: 'mira_shoes_dress',
  source: '/3d/assets/models/Mira/vrms/mira_shoes_dress.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Shoes/mira_shoes_dress.png',
    base_alternate: '/3d/assets/models/Mira/textures/Shoes/mira_shoes_dress_alternate.png',
  },
  slots: ['shoes'],
};

export const MiraShoesSpace = {
  id: 'mira_shoes_space',
  source: '/3d/assets/models/Mira/vrms/mira_shoes_space.vrm',
  texturesMap: {
    base: '/3d/assets/models/Mira/textures/Shoes/mira_shoes_space.png',
    base_alternate: '/3d/assets/models/Mira/textures/Shoes/mira_shoes_space_alternate.png',
  },
  slots: ['shoes'],
};
