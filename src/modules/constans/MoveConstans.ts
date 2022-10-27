import * as THREE from 'three';
import { MaskottDataFromOrTo } from '../MaskottScene/views/MainScene';

export interface MoveConstansOptions {
  Mira: {
    moveTo: THREE.Vector3;
    rotate: number;
    maskottObjectTo: MaskottDataFromOrTo;
    maskottObjectFrom: MaskottDataFromOrTo;
  };
  Yuki: {
    moveTo: THREE.Vector3;
    rotate: number;
    maskottObjectTo: MaskottDataFromOrTo;
    maskottObjectFrom: MaskottDataFromOrTo;
  };
}

export const MoveConstans: MoveConstansOptions = {
  Mira: {
    moveTo: new THREE.Vector3(1.6, 1.2, 1.4),
    rotate: -Math.PI * 0.12,
    maskottObjectTo: {
      yukiPositionZ: -1.6,
      miraPositionZ: 0,
      yukiBlending: 0.0,
      miraBlending: 1.0,
    },
    maskottObjectFrom: {
      yukiPositionZ: 0,
      miraPositionZ: -1.6,
      yukiBlending: 1.0,
      miraBlending: 0.0,
    },
  },
  Yuki: {
    moveTo: new THREE.Vector3(3.7, 1.2, 1.5),
    rotate: Math.PI * 0.1,
    maskottObjectTo: {
      yukiPositionZ: 0,
      miraPositionZ: -1.6,
      yukiBlending: 1.0,
      miraBlending: 0.0,
    },
    maskottObjectFrom: {
      yukiPositionZ: -1.6,
      miraPositionZ: 0,
      yukiBlending: 0.0,
      miraBlending: 1.0,
    },
  },
};
