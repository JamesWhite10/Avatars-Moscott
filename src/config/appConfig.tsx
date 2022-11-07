import { Avatar, EnvironmentConfigType, Style } from '@app/types';
import MiraImage from '../assets/mira.png';
import { CyberfoxIcon, Web3devIcon } from '../components/Icons/index';
import YukiImage from '@app/assets/yuki.png';

const avatars: Avatar[] = [
  {
    id: 'mira',
    image: MiraImage.src,
    model: '/3d/assets/models/miraBase.vrm',
    name: 'Mira',
    description: 'Cyberfox',
    icon: <CyberfoxIcon />,
  },
  {
    id: 'yuki',
    image: YukiImage.src,
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
    videoUrl: '/avatars/mira_style1.MP4',
    background: {
      mountains_mesh: '/3d/assets/texture/miraBase/mountains_blue_color.png',
      planet_mesh: '/3d/assets/texture/miraBase/planet_blue_color.png',
      portal_mesh: '/3d/assets/texture/miraBase/portal_blue_color.jpg',
      sky_mesh: '/3d/assets/texture/miraBase/sky_blue_color.jpg',
      floor_mesh: '/3d/assets/texture/miraBase/floor_blue_color.jpg',
      plane: '/3d/assets/texture/miraBase/transparentsmoke_blue.png',
    },
    videoBackground: {
      portal_video: '/3d/assets/texture/video/Bear.mp4',
    },
  },
  {
    id: 'mira_retro',
    name: 'Retro',
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
      portal_video: '',
    },
    model: '',
  },
  {
    id: 'yuki_base',
    name: 'Base',
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
      portal_video: '/3d/assets/texture/video/Bear.mp4',
    },
  },
  {
    id: 'yuki_hacker',
    name: 'Hacker',
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
      portal_video: '',
    },
  },
];

const sceneConfig: EnvironmentConfigType = {
  background: '/3d/assets/scene/portal.glb',
  environment: '/3d/hdr/environment.hdr',
};

export const appConfig = {
  avatars,
  styles,
  sceneConfig,
};
