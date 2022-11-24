import * as THREE from 'three';
import { CameraControls, ObjectControlsOptions } from './CameraControls';

export class MouseControls extends CameraControls {
  public zoomSpeed: number = 2;

  public currentZoom: number = 33;

  public minZoom: number = 33;

  public maxZoom: number = 45;

  public isLockZoom: boolean = false;

  constructor({ threeCamera, width, height }: ObjectControlsOptions) {
    super({ threeCamera, width, height });
  }

  public onMouseUp() {
    this.isMovingCamera = true;
  }

  public onMouseDown(event: MouseEvent) {
    this.isMovingCamera = false;
    this.isRotateObject = false;

    if (!this.isLockRotate) {
      this.prevMousePosition.copy(this.getPosition(event));
      this.clientXClickDown = event.clientX - (this.rendererWidth / 2);
      this.targetRotationOnMouseDownX = this.targetRotationX;
    }
  }

  public onMouseMove(event: MouseEvent) {
    this.setPosition(event);
    this.setPrevPosition();

    if (!this.isMovingCamera && this.object && !this.isLockRotate) {
      this.isRotateObject = true;
      const clientX = event.clientX - this.rendererWidth / 2;
      this.targetRotationX = this.targetRotationOnMouseDownX + (clientX - this.clientXClickDown) * -0.01;
    }
  }

  public onMouseWheel(event: WheelEvent): void {
    if (this.threeCamera && !this.isLockZoom) {
      const delta = event.deltaY < 0 ? -1 : 1;
      this.currentZoom += Math.sin(delta) * this.zoomSpeed;
      if (this.currentZoom < this.maxZoom && this.currentZoom > this.minZoom) {
        this.threeCamera.fov = this.currentZoom;
        this.threeCamera.updateProjectionMatrix();
        this.threeCamera.lookAt(this.lookVector.x, this.lookVector.y, this.lookVector.z);
      } else {
        this.changeScale(this.currentZoom);
      }
    }
  }

  public changeScale(value: number): void {
    if (value > this.maxZoom) this.currentZoom = this.maxZoom;
    if (value < this.minZoom) this.currentZoom = this.minZoom;
  }

  public setPosition(event: MouseEvent) {
    this.mousePosition.copy(this.getPosition(event));
    this.diffMousePosition = this.prevMousePosition.clone().sub(this.mousePosition);
    this.velocityMousePosition = this.velocityMousePosition.add(this.diffMousePosition.clone().multiplyScalar(1));
    this.prevMousePosition.copy(this.mousePosition);
  }

  public onStartRotate(event: MouseEvent) {
    this.prevMousePosition.copy(this.getPosition(event));
  }

  protected getPosition(event: MouseEvent): THREE.Vector2 {
    const { rendererWidth, rendererHeight } = this;
    const result = new THREE.Vector2();
    result.x = (event.clientX / rendererWidth) * 2 - 1;
    result.y = -(event.clientY / rendererHeight) * 2 + 1;

    return result;
  }
}
