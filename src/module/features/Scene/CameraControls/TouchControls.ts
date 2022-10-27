import { Object3D, PerspectiveCamera, Vector2 } from 'three';
import * as THREE from 'three';

export interface ObjectControlsOptions {
  threeCamera: THREE.PerspectiveCamera;
  width: number;
  height: number;
}

export class TouchControls {
  public mousePosition: Vector2 = new Vector2();

  public prevMousePosition: Vector2 = new Vector2();

  public diffMousePosition: Vector2 = new Vector2();

  public velocityMousePosition: Vector2 = new Vector2();

  public enableDamping = true;

  public dampingFactor = 0.5;

  public amplitude = 4;

  public enableParallax = true;

  public width: number;

  public height: number;

  protected isMoving = false;

  public object?: Object3D;

  public camera?: PerspectiveCamera;

  public lookVector = new THREE.Vector3(1.6, 1, 0);

  constructor({ threeCamera, width, height }: ObjectControlsOptions) {
    this.camera = threeCamera;
    this.width = width;
    this.height = height;
  }

  setObject(object: Object3D) {
    this.object = object;
  }

  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.handleTouchStartRotate(event);
    }
  }

  onTouchEnded(event: TouchEvent) {
    this.isMoving = false;
    this.prevMousePosition.copy(this.$getMousePosition(event));
  }

  onTouchMove(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.handleTouchMoveRotate(event);
    }
  }

  handleTouchMoveRotate(event: TouchEvent) {
    if (!this.isMoving) return;
    this.mousePosition.copy(this.$getMousePosition(event));
    this.diffMousePosition = this.prevMousePosition.clone().sub(this.mousePosition);
    this.velocityMousePosition = this.velocityMousePosition.add(this.diffMousePosition.clone().multiplyScalar(1));
    this.prevMousePosition.copy(this.mousePosition);
  }

  handleTouchStartRotate(event: TouchEvent) {
    this.prevMousePosition.copy(this.$getMousePosition(event));
    this.isMoving = true;
  }

  update() {
    this.updateObject();
    this.updateCamera();
  }

  updateCameraParallax() {
    const { camera, mousePosition } = this;
    if (!camera) return;
    if (!mousePosition.length()) return;
    if (!this.enableParallax) return;

    camera.position.x = mousePosition.x * 0.05 + 0.4;
    camera.position.y = mousePosition.y * 0.05 + 1.25;
    camera.lookAt(this.lookVector.x, this.lookVector.y, this.lookVector.z);
  }

  updateCamera() {
    this.updateCameraParallax();
  }

  updateObject() {
    if (!this.object) return;

    if (this.enableDamping) {
      this.object.rotation.y -= this.amplitude * this.diffMousePosition.x * (1 - this.dampingFactor);
    } else {
      this.object.rotation.y -= this.amplitude * this.diffMousePosition.x;
    }
    if (this.enableDamping) {
      this.diffMousePosition.multiplyScalar(1 - this.dampingFactor);
    } else {
      this.diffMousePosition.set(0, 0);
    }
  }

  protected $getMousePosition(event: TouchEvent): Vector2 {
    const primaryTouchData = event.targetTouches[0];
    const result = new Vector2();
    if (primaryTouchData) {
      result.set(
        (primaryTouchData.clientX / window.innerWidth) * 2 - 1,
        -(primaryTouchData.clientY / window.innerHeight) * 2 + 1,
      );
    }
    return result;
  }
}
