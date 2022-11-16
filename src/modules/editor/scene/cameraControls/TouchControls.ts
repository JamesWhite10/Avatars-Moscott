import * as THREE from 'three';
import { CameraControls, ObjectControlsOptions } from './CameraControls';

export class TouchControls extends CameraControls {
  constructor({ threeCamera, width, height }: ObjectControlsOptions) {
    super({ threeCamera, width, height });
  }

  public onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.speedRotate = 0.1;
      this.isMovingCamera = false;
      this.handleTouchStartRotate(event);

      this.clientXClickDown = event.targetTouches[0].clientX - (window.innerWidth / 2);

      this.targetRotationOnMouseDownX = this.targetRotationX;
    }
  }

  public onTouchEnded(event: TouchEvent) {
    this.isMovingCamera = true;
    this.isRotateObject = false;
    this.prevMousePosition.copy(this.getMousePosition(event));
  }

  public onTouchMove(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.setPosition(event);
      this.setPrevPosition();

      if (this.isMovingCamera && this.object) {
        this.isRotateObject = true;
        const mouseX = event.targetTouches[0].clientX - window.innerWidth / 2;

        this.targetRotationX = this.targetRotationOnMouseDownX + (mouseX - this.clientXClickDown) * -0.07;
      }
    }
  }

  public setPosition(event: TouchEvent) {
    if (!this.isMovingCamera) return;
    this.mousePosition.copy(this.getMousePosition(event));
    this.diffMousePosition = this.prevMousePosition.clone().sub(this.mousePosition);
    this.velocityMousePosition = this.velocityMousePosition.add(this.diffMousePosition.clone().multiplyScalar(1));
  }

  public handleTouchStartRotate(event: TouchEvent) {
    this.prevMousePosition.copy(this.getMousePosition(event));
    this.isMovingCamera = true;
  }

  protected getMousePosition(event: TouchEvent): THREE.Vector2 {
    const primaryTouchData = event.targetTouches[0];
    const result = new THREE.Vector2();
    if (primaryTouchData) {
      result.set(
        Math.min(Math.max((primaryTouchData.clientX / window.innerWidth) * 2, 1)),
        Math.min(Math.max(-(primaryTouchData.clientY / window.innerHeight) * 2, 1)),
      );
    }
    return result;
  }
}
