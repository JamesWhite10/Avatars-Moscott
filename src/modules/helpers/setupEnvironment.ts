import * as THREE from 'three';

const setupEnvironment = (renderer: THREE.WebGLRenderer, scene: THREE.Scene) => {
  const spotLight = new THREE.SpotLight(new THREE.Color(1, 1, 1));
  spotLight.intensity = 4.7;
  spotLight.distance = 7.79;
  spotLight.position.set(2.86, 1.9, 1.3);

  scene.add(spotLight);
};

export default setupEnvironment;
