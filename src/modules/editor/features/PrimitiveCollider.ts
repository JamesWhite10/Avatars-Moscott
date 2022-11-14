import * as THREE from 'three';

export type PrimitiveOptions = {
  data?: {
    position?: THREE.Vector3;
    visible?: boolean;
    radiusTop?: number;
    radiusBottom?: number;
    height?: number;
  };
};

class PrimitiveCollider {
  public object: THREE.Object3D = new THREE.Object3D();

  constructor(options?: PrimitiveOptions) {
    const cylinder = new THREE.CylinderGeometry(
      options?.data?.radiusTop || 0.2,
      options?.data?.radiusBottom || 0.2,
      options?.data?.height || 1.9,
    );

    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true, wireframeLinewidth: 4 });
    const meshCylinder = new THREE.Mesh(cylinder, material);
    if (options && options.data && options.data.position) {
      meshCylinder.position.set(options.data.position.x, options.data.position.y, options.data.position.z);
    }

    this.object.rotateY(Math.PI);

    meshCylinder.visible = options?.data?.visible || false;

    this.object.add(meshCylinder);
  }
}

export default PrimitiveCollider;
