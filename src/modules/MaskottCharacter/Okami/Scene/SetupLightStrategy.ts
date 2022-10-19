import * as THREE from 'three';
import { SetupLightStrategyInterface } from '../../../features/Scene/SetupLightStrategyInterface';

export class SetupLightStrategy implements SetupLightStrategyInterface {
  public setupLight(scene: THREE.Scene): THREE.SpotLight {
    const color = 0xffffff;

    const light = new THREE.SpotLight(color);
    light.position.set(2.86847, 2.8, 1.9024);
    light.target.position.set(2.86847, 0.63, 0);
    scene.add(light);
    light.angle = 0.3;
    light.castShadow = true;
    light.intensity = 1.7;

    light.shadow.mapSize.width = 4800;
    light.shadow.mapSize.height = 4800;
    light.shadow.camera.near = 1.9;
    light.shadow.camera.far = 1000;

    light.target.updateMatrixWorld();

    return light;
  }
}
