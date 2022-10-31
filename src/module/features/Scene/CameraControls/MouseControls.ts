import * as THREE from 'three';
import { CameraControls } from './CameraControls/CameraControls';

export interface ObjectControlsOptions {
  threeCamera: THREE.PerspectiveCamera;
  width: number;
  height: number;
}

export class MouseControls extends CameraControls {
  public zoomSpeed: number = 0.1;

  private _currentZoom: number = 4;

  public minZoom: number = 4;

  public maxZoom: number = 4.8;

  constructor({ threeCamera, width, height }: ObjectControlsOptions) {
    super({ threeCamera, width, height });
  }

  public onMouseStart() {
    this.isMoving = true;
  }

  public onMouseDown(event: MouseEvent) {
    this.isMoving = false;
    this.speedRotate = -2;
    this.prevMousePosition.copy(this.getPosition(event));
  }

  public onMouseMove(event: MouseEvent) {
    this.setPosition(event);
    this.setPrevPosition();
  }

  public onMouseWheel(event: WheelEvent): void {
    if (this.threeCamera) {
      const delta = event.deltaY < 0 ? -1 : 1;
      this._currentZoom += Math.sin(delta) * this.zoomSpeed;
      if (this._currentZoom < this.maxZoom && this._currentZoom > this.minZoom) {
        this.threeCamera.position.z = this._currentZoom;
        this.threeCamera.position.z = this._currentZoom;
        this.threeCamera.lookAt(this.lookVector.x, this.lookVector.y, this.lookVector.z);
      } else {
        this.changeScale(this._currentZoom);
      }
    }
  }

  public changeScale(value: number): void {
    if (value > this.maxZoom) this._currentZoom = this.maxZoom;
    if (value < this.minZoom) this._currentZoom = this.minZoom;
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
    result.x = Math.min(Math.max((event.pageX / rendererWidth) * 2 - 1, -1), 1);
    result.y = Math.min(Math.max(-(event.pageY / rendererHeight) * 2 + 1, -1), 1);

    return result;
  }

  public update(): void {
    if (!this.isMoving) this.updateObject();
    this.updateCameraParallax();
  }
}
