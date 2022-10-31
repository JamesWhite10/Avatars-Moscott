import * as THREE from 'three';
import { CameraControls } from './CameraControls/CameraControls';

export interface ObjectControlsOptions {
  threeCamera: THREE.PerspectiveCamera;
  width: number;
  height: number;
}

export class TouchControls extends CameraControls {
  constructor({ threeCamera, width, height }: ObjectControlsOptions) {
    super({ threeCamera, width, height });
  }

  public onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.speedRotate = 0.1;
      this.handleTouchStartRotate(event);
    }
  }

  public onTouchEnded(event: TouchEvent) {
    this.isMoving = false;
    this.prevMousePosition.copy(this.getMousePosition(event));
  }

  public onTouchMove(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.isMoving = true;
      this.setPosition(event);
      this.setPrevPosition();
    }
  }

  public setPosition(event: TouchEvent) {
    if (!this.isMoving) return;
    this.mousePosition.copy(this.getMousePosition(event));
    this.diffMousePosition = this.prevMousePosition.clone().sub(this.mousePosition);
    this.velocityMousePosition = this.velocityMousePosition.add(this.diffMousePosition.clone().multiplyScalar(1));
  }

  public handleTouchStartRotate(event: TouchEvent) {
    this.prevMousePosition.copy(this.getMousePosition(event));
    this.isMoving = true;
  }

  protected getMousePosition(event: TouchEvent): THREE.Vector2 {
    const primaryTouchData = event.targetTouches[0];
    const result = new THREE.Vector2();
    if (primaryTouchData) {
      result.set(
        Math.min(Math.max((primaryTouchData.clientX / window.innerWidth) * 2 - 1, 1)),
        Math.min(Math.max(-(primaryTouchData.clientY / window.innerHeight) * 2 + 1, 1)),
      );
    }
    return result;
  }

  public updateObject() {
    if (!this.object) return;
    if (this.enableDamping) {
      this.object.rotation.y += this.mousePosition.x * this.speedRotate;
    } else {
      this.object.rotation.y += this.amplitude * this.diffMousePosition.x;
    }

    if (this.enableDamping) {
      this.diffMousePosition.multiplyScalar(1 - this.dampingFactor);
    } else {
      this.diffMousePosition.set(0, 0);
    }
  }
}
