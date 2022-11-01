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
      mountains_mesh: '/3d/assets/texture/miraBaseTheme/miraBase/mountains_blue_color.png',
      planet_mesh: '/3d/assets/texture/miraBaseTheme/miraBase/planet_blue_color.png',
      portal_mesh: '/3d/assets/texture/miraBaseTheme/miraBase/portal_blue_color.jpg',
      sky_mesh: '/3d/assets/texture/miraBaseTheme/miraBase/sky_blue_color.jpg',
      floor_mesh: '/3d/assets/texture/miraBaseTheme/miraBase/floor_blue_color.jpg',
    },
  },
  {
    id: 'mira_hacker',
    name: 'Hacker',
    videoUrl: '/avatars/mira_style2.MP4',
    background: {},
    model: '',
  },
  {
    id: 'yuki_base',
    name: 'Base',
    videoUrl: '/avatars/mira_style1.MP4',
    background: {
      mountains_mesh: '/3d/assets/texture/YukiBaseTheme/YukiBase/mountains_orange_color.png',
      planet_mesh: '/3d/assets/texture/YukiBaseTheme/YukiBase/planet_orange_color.png',
      portal_mesh: '/3d/assets/texture/YukiBaseTheme/YukiBase/portal_orange_color.jpg',
      sky_mesh: '/3d/assets/texture/YukiBaseTheme/YukiBase/sky_orange_color.jpg',
      floor_mesh: '/3d/assets/texture/YukiBaseTheme/YukiBase/floor_orange_color.jpg',
    },
  },
  {
    id: 'yuki_hacker',
    name: 'Hacker',
    videoUrl: '/avatars/mira_style2.MP4',
    background: {
      mountains_mesh: '/3d/assets/texture/hacker/mountainshacker_color.png',
      planet_mesh: '/3d/assets/texture/hacker/planetshacker_color.png',
      portal_mesh: '/3d/assets/texture/hacker/portalhacker_color.jpg',
      sky_mesh: '/3d/assets/texture/hacker/skyhacker_color.jpg',
      floor_mesh: '/3d/assets/texture/hacker/floorhacker_color.jpg',
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
