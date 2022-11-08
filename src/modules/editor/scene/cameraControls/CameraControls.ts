import * as THREE from 'three';
import { Vector2 } from 'three';

export interface ObjectControlsOptions {
  threeCamera: THREE.PerspectiveCamera;
  width: number;
  height: number;
}

export class CameraControls {
  public velocityMousePosition: Vector2 = new Vector2();

  public mousePosition: THREE.Vector2 = new THREE.Vector2();

  public prevMousePosition: Vector2 = new Vector2();

  public diffMousePosition: THREE.Vector2 = new THREE.Vector2();

  public speedRotate: number = 5;

  public speedParallax: number = 0.05;

  public enableParallax: boolean = true;

  public rendererWidth: number;

  public rendererHeight: number;

  public object?: THREE.Object3D = undefined;

  public threeCamera: THREE.PerspectiveCamera;

  public lookVector = new THREE.Vector3(1.6, 1, 0);

  public isMovingCamera: boolean = true;

  public targetRotationX: number = 0;

  public clientXClickDown: number = 0;

  public targetRotationOnMouseDownX: number = 0;

  constructor(options: ObjectControlsOptions) {
    this.threeCamera = options.threeCamera;
    this.rendererHeight = options.height;
    this.rendererWidth = options.width;
  }

  public onUpdate(): void {
    this.rotateObject();
  }

  public setObject(object: THREE.Object3D) {
    this.object = object;
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

  public rotateObject(): void {
    if (this.object) {
      this.object.rotation.y += (this.targetRotationX - this.object.rotation.y) * 0.01;
    }
  }
}