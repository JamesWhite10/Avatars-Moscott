import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const setupEnvironment = (renderer: THREE.WebGLRenderer, scene: THREE.Scene) => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  new RGBELoader()
    .load('/3d/environment/environment.hdr', (texture) => {
      scene.environment = pmremGenerator.fromEquirectangular(texture).texture;
      pmremGenerator.dispose();
    });

  const spotLight = new THREE.SpotLight(new THREE.Color(1, 1, 1));
  spotLight.intensity = 4.7;
  spotLight.distance = 7.79;
  spotLight.position.set(2.86, 1.9, 1.3);

  scene.add(spotLight);
};

export default setupEnvironment;
