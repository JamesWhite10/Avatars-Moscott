import { AnimationsType, Avatar, EnvironmentConfigType, Style } from '@app/types';
import { CyberfoxIcon, Web3devIcon } from '../components/Icons/index';
import MiraImage from '@app/assets/mira.png';
import YukiImage from '@app/assets/yuki.png';
import MiraImageRender from '@app/assets/about/MiraAbout.png';
import YukiImageRender from '@app/assets/about/YukiAbout.png';

const avatars: Avatar[] = [
  {
    id: 'mira',
    image: MiraImage.src,
    renderImage: MiraImageRender.src,
    model: '/3d/assets/models/miraBase.vrm',
    animations: [
      { id: 'forgivenessMira', name: 'forgiveness' },
      { id: 'inActiveMira', name: 'inActive' },
    ],
    name: 'Mira',
    description: 'Cyberfox',
    icon: <CyberfoxIcon />,
  },
  {
    id: 'yuki',
    image: YukiImage.src,
    renderImage: YukiImageRender.src,
    animations: [
      { id: 'forgivenessYuki', name: 'forgiveness' },
      { id: 'inActiveYuki', name: 'inActive' },
    ],
    model: '/3d/assets/models/yukiBase.vrm',
    name: 'Yuki',
    description: 'web3dev',
    icon: <Web3devIcon />,
  },
];

const styles: Style[] = [
  {
    id: 'mira_base',
    name: 'Base',
    model: '/3d/assets/models/miraBase.vrm',
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
    model: '/3d/assets/models/mira_space.vrm',
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
    model: '/3d/assets/models/yukiBase.vrm',
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
    model: '/3d/assets/models/yuki_hacker.vrm',
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
    id: 'dance',
    name: 'Dance',
    animation: '/3d/assets/animations/animationsUi/dance.fbx',
  },
  {
    id: 'foolAround',
    name: 'Fool around',
    animation: '/3d/assets/animations/animationsUi/foolAround.fbx',
  },
];

export const appConfig = {
  avatars,
  styles,
  sceneConfig,
  animations,
};
