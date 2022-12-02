import { AnimationsType, Avatar, EnvironmentConfigType, Style } from '@app/types';
import { CyberfoxIcon, Web3devIcon } from '../components/Icons/index';
import MiraImage from '@app/assets/mira.png';
import YukiImage from '@app/assets/yuki.png';
import MiraImageRender from '@app/assets/about/MiraAbout.png';
import YukiImageRender from '@app/assets/about/YukiAbout.png';
import {
  MiraBase,
  MiraCostumeDress,
  MiraLashes,
  MiraCostumeSpace,
  MiraEyes,
  MiraHairBraids,
  MiraHairTail,
  MiraShoesDress,
  MiraShoesSpace,
} from '@app/config/avatarParts/MiraParts';
import {
  YukiBase,
  YukiCostumeCoat,
  YukiCostumeHacker,
  YukiEyes,
  YukiHairCoats,
  YukiHairHacker,
  YukiShoesCoat,
  YukiShoesHacker,
} from '@app/config/avatarParts/YukiParts';

const avatars: Avatar[] = [
  {
    id: 'mira',
    basePart: 'base',
    image: MiraImage.src,
    renderImage: MiraImageRender.src,
    animations: [
      { id: 'forgivenessMira', name: 'forgiveness' },
      { id: 'inActiveMira', name: 'inActive' },
    ],
    slots: ['hair', 'eye', 'costume', 'base', 'shoes', 'lashes'],
    name: 'Mira',
    description: 'Cyberfox',
    icon: <CyberfoxIcon />,
    parts: [
      MiraBase,
      MiraEyes,
      MiraCostumeDress,
      MiraCostumeSpace,
      MiraShoesDress,
      MiraLashes,
      MiraShoesSpace,
      MiraHairBraids,
      MiraHairTail,
    ],
  },
  {
    id: 'yuki',
    basePart: 'base',
    image: YukiImage.src,
    renderImage: YukiImageRender.src,
    animations: [
      { id: 'forgivenessYuki', name: 'forgiveness' },
      { id: 'inActiveYuki', name: 'inActive' },
    ],
    slots: ['hair', 'eye', 'costume', 'base', 'shoes'],
    parts: [
      YukiBase,
      YukiEyes,
      YukiCostumeCoat,
      YukiCostumeHacker,
      YukiShoesCoat,
      YukiShoesHacker,
      YukiHairCoats,
      YukiHairHacker,
    ],
    name: 'Yuki',
    description: 'web3dev',
    icon: <Web3devIcon />,
  },
];

const styles: Style[] = [
  {
    id: 'mira_base',
    name: 'Base',
    parts: [MiraBase, MiraEyes, MiraCostumeDress, MiraShoesDress, MiraLashes, MiraHairTail],
    videoUrl: '/avatars/mira_style1.MP4',
    animations: [
      { id: 'activeMiraBaseStart', name: 'activeStart' },
      { id: 'activeMiraBaseBack', name: 'activeBack' },
      { id: 'lookAroundMiraBase', name: 'switchStyle' },
    ],
    background: {
      mountains_mesh: '/3d/assets/texture/miraBase/mountains_blue_color.png',
      planet_mesh: '/3d/assets/texture/miraBase/planet_blue_color.png',
      portal_mesh: '/3d/assets/texture/miraBase/portal_blue_color.jpg',
      sky_mesh: '/3d/assets/texture/miraBase/sky_blue_color.jpg',
      floor_mesh: '/3d/assets/texture/miraBase/floor_blue_color.jpg',
      plane: '/3d/assets/texture/miraBase/transparentsmoke_blue.png',
    },
    videoBackground: {
      portal_video: '/3d/assets/texture/video/mira_base_portal.mp4',
    },
  },
  {
    id: 'mira_retro',
    name: 'Retro',
    animations: [
      { id: 'activeMiraRetroStart', name: 'activeStart' },
      { id: 'activeMiraRetroBack', name: 'activeBack' },
      { id: 'lookAroundMiraRetro', name: 'switchStyle' },
    ],
    parts: [MiraBase, MiraEyes, MiraCostumeSpace, MiraLashes, MiraShoesSpace, MiraHairBraids],
    videoUrl: '/avatars/mira_style2.MP4',
    background: {
      mountains_mesh: '/3d/assets/texture/retro/mountains_retro_color.png',
      planet_mesh: '/3d/assets/texture/retro/planet_retro_color.png',
      portal_mesh: '/3d/assets/texture/retro/portal_retro_color.jpg',
      sky_mesh: '/3d/assets/texture/retro/sky_retro_color.jpg',
      floor_mesh: '/3d/assets/texture/retro/floor_retro_color.jpg',
      plane: '/3d/assets/texture/retro/transparentsmoke_retro.png',
    },
    videoBackground: {
      portal_video: '/3d/assets/texture/video/mira_retro_portal.mp4',
    },
  },
  {
    id: 'yuki_base',
    name: 'Base',
    animations: [
      { id: 'activeYukiBaseStart', name: 'activeStart' },
      { id: 'activeYukiBaseBack', name: 'activeBack' },
      { id: 'lookAroundYukiBase', name: 'switchStyle' },
    ],
    parts: [YukiBase, YukiEyes, YukiCostumeCoat, YukiShoesCoat, YukiHairCoats],
    videoUrl: '/avatars/mira_style1.MP4',
    background: {
      mountains_mesh: '/3d/assets/texture/YukiBase/mountains_orange_color.png',
      planet_mesh: '/3d/assets/texture/YukiBase/planet_orange_color.png',
      portal_mesh: '/3d/assets/texture/YukiBase/portal_orange_color.jpg',
      sky_mesh: '/3d/assets/texture/YukiBase/sky_orange_color.jpg',
      floor_mesh: '/3d/assets/texture/YukiBase/floor_orange_color.jpg',
      plane: '/3d/assets/texture/YukiBase/transparentsmoke_orange.png',
    },
    videoBackground: {
      portal_video: '/3d/assets/texture/video/yuki_base_portal.mp4',
    },
  },
  {
    id: 'yuki_hacker',
    name: 'Hacker',
    animations: [
      { id: 'activeYukiHackerStart', name: 'activeStart' },
      { id: 'activeYukiHackerBack', name: 'activeBack' },
      { id: 'lookAroundYukiHacker', name: 'switchStyle' },
    ],
    parts: [YukiEyes, YukiCostumeHacker, YukiShoesHacker, YukiHairHacker],
    videoUrl: '/avatars/mira_style2.MP4',
    background: {
      mountains_mesh: '/3d/assets/texture/hacker/mountains_hacker_color.png',
      planet_mesh: '/3d/assets/texture/hacker/planet_hacker_color.png',
      portal_mesh: '/3d/assets/texture/hacker/portal_hacker_color.jpg',
      sky_mesh: '/3d/assets/texture/hacker/sky_hacker_color.jpg',
      floor_mesh: '/3d/assets/texture/hacker/floor_hacker_color.jpg',
      plane: '/3d/assets/texture/hacker/transparentsmoke_hacker.png',
    },
    videoBackground: {
      portal_video: '/3d/assets/texture/video/yuki_hacker_portal.mp4',
    },
  },
];

const sceneConfig: EnvironmentConfigType = {
  background: '/3d/assets/scene/portal.glb',
  environment: '/3d/hdr/environment.hdr',
};

const animations: AnimationsType[] = [
  {
    id: 'retroDance',
    name: 'New Dance',
    animation: '/3d/assets/animations/animationsUi/retroDance.fbx',
  },
  {
    id: 'foolAround',
    name: 'Fool around',
    animation: '/3d/assets/animations/animationsUi/foolAround.fbx',
  },
  {
    id: 'dance',
    name: 'Dance',
    animation: '/3d/assets/animations/animationsUi/dance.fbx',
  },
];

export const appConfig = {
  avatars,
  styles,
  sceneConfig,
  animations,
};
