import * as ThreeVRM from '@pixiv/three-vrm';
import { GLTFLoader as ThreeGLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const loadVRM = (url: string): Promise<ThreeVRM.VRM> => {
  return new Promise((resolve) => {
    const loader = new ThreeGLTFLoader();
    loader.register((parser) => new ThreeVRM.VRMLoaderPlugin(parser));
    loader.crossOrigin = 'anonymous';
    loader.load(url, (gltf) => {
      ThreeVRM.VRMUtils.removeUnnecessaryVertices(gltf.scene);
      ThreeVRM.VRMUtils.removeUnnecessaryJoints(gltf.scene);
      if (gltf.userData.vrm) {
        const { vrm } = gltf.userData;
        resolve(vrm);
      }
    });
  });
};

export default loadVRM;
