import * as THREE from 'three';

export class RaycastSystem {
  private raycaster = new THREE.Raycaster();

  public threeScene: THREE.Scene;

  public threeCamera: THREE.PerspectiveCamera;

  private mouse = new THREE.Vector2();

  constructor(threeScene: THREE.Scene, threeCamera: THREE.PerspectiveCamera) {
    this.threeScene = threeScene;
    this.threeCamera = threeCamera;
  }

  public raycast(event: MouseEvent, value: string): THREE.Intersection<THREE.Object3D<THREE.Event>>[] {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.threeCamera);

    const object = this.threeScene.getObjectByName(value);

    return this.raycaster.intersectObjects(object?.children || this.threeScene.children, false);
  }
}
