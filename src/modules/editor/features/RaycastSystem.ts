import * as THREE from 'three';
import { SceneViewport } from '../scene/viewports/SceneViewport';

export class RaycastSystem {
  private raycaster = new THREE.Raycaster();

  public threeScene: SceneViewport;

  public threeCamera: THREE.PerspectiveCamera;

  private mouse = new THREE.Vector2();

  private touch = new THREE.Vector2();

  constructor(threeScene: SceneViewport, threeCamera: THREE.PerspectiveCamera) {
    this.threeScene = threeScene;
    this.threeCamera = threeCamera;
  }

  public mouseRaycast(event: MouseEvent, value: string): THREE.Intersection<THREE.Object3D<THREE.Event>>[] {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    return this.raycast(value, this.mouse);
  }

  public touchRaycast(event: TouchEvent, value: string): THREE.Intersection<THREE.Object3D<THREE.Event>>[] {
    const primaryTouchData = event.targetTouches[0];

    this.touch.x = (primaryTouchData.clientX / window.innerWidth) * 2 - 1;
    this.touch.y = -(primaryTouchData.clientY / window.innerHeight) * 2 + 1;

    return this.raycast(value, this.touch);
  }

  public raycast(value: string, position: THREE.Vector2): THREE.Intersection<THREE.Object3D<THREE.Event>>[] {
    this.raycaster.setFromCamera(position, this.threeCamera);
    const object = this.threeScene.vrmEditor.charactersData.find((item) => item.name === value);
    return this.raycaster.intersectObjects(object?.model.children || this.threeScene.threeScene.children, false);
  }
}
