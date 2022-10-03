import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loadGLB = (url: string): Promise<GLTF> => {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.crossOrigin = 'anonymous';
    loader.load(
      url,
      (gltf) => {
        resolve(gltf);
      },
      (xhr) => {
        window.dispatchEvent(new CustomEvent('scene_prg', { detail: { prg: (xhr.loaded / 33935200) * 100 } }));
      },
    );
  });
};

export default loadGLB;
