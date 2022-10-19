import * as THREE from 'three';

export interface SetupLightStrategyInterface {
  setupLight(scene: THREE.Scene): THREE.SpotLight;
}
