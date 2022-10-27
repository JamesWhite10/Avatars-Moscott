import * as THREE from 'three';

export interface ObjectControlsOptions {
  threeCamera: THREE.PerspectiveCamera;
  width: number;
  height: number;
}

export class MouseControls {
  public mousePosition: THREE.Vector2 = new THREE.Vector2();

  public prevMousePosition: THREE.Vector2 = new THREE.Vector2();

  public diffMousePosition: THREE.Vector2 = new THREE.Vector2();

  public zoomSpeed: number = 0.1;

  public velocityMousePosition: THREE.Vector2 = new THREE.Vector2();

  public enableDamping = true;

  public dampingFactor = 0.1;

  public amplitude = 4;

  public enableParallax = true;

  public width: number;

  public height: number;

  protected isMoving = true;

  public object?: THREE.Object3D;

  private _currentZoom: number = 4;

  public minZoom: number = 4;

  public maxZoom: number = 4.8;

  public camera?: THREE.PerspectiveCamera;

  public lookVector = new THREE.Vector3(1.6, 1, 0);

  constructor({ threeCamera, width, height }: ObjectControlsOptions) {
    this.camera = threeCamera;
    this.width = width;
    this.height = height;
  }

  onTouchStart() {
    this.isMoving = true;
  }

  onTouchEnded(event: MouseEvent) {
    this.isMoving = false;
    this.prevMousePosition.copy(this.getMousePosition(event));
  }

  onTouchMove(event: MouseEvent) {
    this.handleTouchMoveRotate(event);
  }

  onMouseWheel(event: WheelEvent): void {
    if (this.camera) {
      const delta = event.deltaY < 0 ? -1 : 1;
      this._currentZoom += Math.sin(delta) * this.zoomSpeed;
      if (this._currentZoom < this.maxZoom && this._currentZoom > this.minZoom) {
        this.camera.position.z = this._currentZoom;
        this.camera.lookAt(this.lookVector.x, this.lookVector.y, this.lookVector.z);
      } else {
        this.changeScale(this._currentZoom);
      }
    }
  }

  public changeScale(value: number): void {
    if (value > this.maxZoom) this._currentZoom = this.maxZoom;
    if (value < this.minZoom) this._currentZoom = this.minZoom;
  }

  handleTouchMoveRotate(event: MouseEvent) {
    if (!this.isMoving) return;
    this.mousePosition.copy(this.getMousePosition(event));
    this.diffMousePosition = this.prevMousePosition.clone().sub(this.mousePosition);
    this.velocityMousePosition = this.velocityMousePosition.add(this.diffMousePosition.clone().multiplyScalar(1));
    this.prevMousePosition.copy(this.mousePosition);
  }

  handleTouchStartRotate(event: MouseEvent) {
    this.prevMousePosition.copy(this.getMousePosition(event));
  }

  update(event: MouseEvent) {
    if (!this.isMoving) this.updateObject(event);
    if (this.isMoving) this.updateCamera();
  }

  updateCameraParallax() {
    const { camera, mousePosition } = this;
    if (!camera) return;
    if (!this.enableParallax) return;
    camera.position.x = mousePosition.x * 0.03 + 0.4;
    camera.position.y = mousePosition.y * 0.03 + 1.4;
    camera.lookAt(this.lookVector.x, this.lookVector.y, this.lookVector.z);
  }

  public setObject(object: THREE.Object3D): void {
    this.object = object;
  }

  updateCamera() {
    this.updateCameraParallax();
  }

  updateObject(event: MouseEvent) {
    if (!this.object) return;
    if (this.enableDamping) {
      this.object.rotation.y += event.movementX * 0.006 * (1 - this.dampingFactor);
    } else {
      this.object.rotation.y -= this.amplitude * this.diffMousePosition.x;
    }

    if (this.enableDamping) {
      this.diffMousePosition.multiplyScalar(1 - this.dampingFactor);
    } else {
      this.diffMousePosition.set(0, 0);
    }
  }

  protected getMousePosition(event: MouseEvent): THREE.Vector2 {
    const { width, height } = this;
    const result = new THREE.Vector2();
    result.x = Math.min(Math.max((event.pageX / width) * 2 - 1, -1), 1);
    result.y = Math.min(Math.max(-(event.pageY / height) * 2 + 1, -1), 1);
    return result;
  }
}
