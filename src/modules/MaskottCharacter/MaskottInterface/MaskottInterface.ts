import * as THREE from 'three';

export interface MaskottInterface {
  character: THREE.Object3D | null;

  characterLight: THREE.SpotLight | null;

  initForPreview(threeScene: THREE.Scene): void;
}
