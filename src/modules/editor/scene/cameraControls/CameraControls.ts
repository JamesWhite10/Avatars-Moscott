import * as THREE from 'three';
import { Vector2 } from 'three';

export interface ObjectControlsOptions {
  threeCamera: THREE.PerspectiveCamera;
  width: number;
  height: number;
}

export class CameraControls {
  public velocityMousePosition: Vector2 = new Vector2();

  public amplitude = 1;

  public mousePosition: THREE.Vector2 = new THREE.Vector2();

  public prevMousePosition: Vector2 = new Vector2();

  public diffMousePosition: THREE.Vector2 = new THREE.Vector2();

  public speedRotate = 5;

  public speedParallax = 0.05;

  public enableDamping = true;

  public dampingFactor = 0.1;

  public enableParallax = true;

  public rendererWidth: number;

  public rendererHeight: number;

  public object?: THREE.Object3D;

  public threeCamera: THREE.PerspectiveCamera;

  public lookVector = new THREE.Vector3(1.6, 1, 0);

  public isMoving = true;

  constructor(options: ObjectControlsOptions) {
    this.threeCamera = options.threeCamera;
    this.rendererHeight = options.height;
    this.rendererWidth = options.width;
  }

  public setObject(object: THREE.Object3D) {
    this.object = object;
  }

  public update(): void {
    this.updateObject();
    this.updateCameraParallax();
  }

  public updateCameraParallax() {
    if (!this.threeCamera) return;
    if (!this.mousePosition.length()) return;
    if (!this.enableParallax) return;

    this.threeCamera.position.x = this.mousePosition.x * this.speedParallax + 0.4;
    this.threeCamera.position.y = this.mousePosition.y * this.speedParallax + 1.4;
    this.threeCamera.lookAt(this.lookVector.x, this.lookVector.y, this.lookVector.z);
  }

  public setPrevPosition() {
    this.prevMousePosition.copy(this.mousePosition);
  }

  public updateObject() {
    if (!this.object) return;
    if (this.enableDamping) {
      this.object.rotation.y = this.mousePosition.x * this.speedRotate;
    } else {
      this.object.rotation.y -= this.amplitude * this.diffMousePosition.x;
    }

    if (this.enableDamping) {
      this.diffMousePosition.multiplyScalar(1 - this.dampingFactor);
    } else {
      this.diffMousePosition.set(0, 0);
    }
  }
}
