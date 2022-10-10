import * as THREE from 'three';

const setupEnvironment = (renderer: THREE.WebGLRenderer, scene: THREE.Scene) => {
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.SpotLight(color, intensity);
  light.position.set(0, 1.8, 1);
  light.target.position.set(0, 0, 0);
  scene.add(light);
  scene.add(light.target);
  light.castShadow = true;
  light.intensity = 10;

  light.shadow.mapSize.width = 4800;
  light.shadow.mapSize.height = 4800;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 1000;
};

export default setupEnvironment;
