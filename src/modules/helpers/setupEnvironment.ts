import * as THREE from 'three';

const setupEnvironment = (renderer: THREE.WebGLRenderer, scene: THREE.Scene) => {
  const color = 0xffffff;

  const light = new THREE.SpotLight(color);
  light.position.set(-0.12, 2, 1.72);
  light.target.position.set(0, 0.8, 0);
  scene.add(light);
  scene.add(light.target);
  light.castShadow = true;
  light.intensity = 1.7;

  light.shadow.mapSize.width = 4800;
  light.shadow.mapSize.height = 4800;
  light.shadow.camera.near = 1.9;
  light.shadow.camera.far = 1000;
};

export default setupEnvironment;
