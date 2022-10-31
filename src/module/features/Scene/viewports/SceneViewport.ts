import * as THREE from 'three';
import ResourcesManager from '../ResourcesManager';
import scene from '@app/module/assets/json/scene/scene.json';
import { MainView } from '@app/module/features/Scene/views/MainView';
import Yuki from '@app/module/assets/json/scene/maskotts/Yuki.json';
import Mira from '@app/module/assets/json/scene/maskotts/Mira.json';
import { CharacterAction } from '@app/module/MaskottScene/mainActions/CharacterAction';
import { MouseControl, TouchControl } from '../CameraControls/index';

class SceneViewport {
  public threeScene: THREE.Scene;

  public threeRenderer: THREE.WebGLRenderer;

  public threeCamera: THREE.PerspectiveCamera;

  public clock: THREE.Clock;

  public mainView: MainView | null = null;

  public characterAction: CharacterAction | null = null;

  public snapshotThreeCamera: THREE.PerspectiveCamera;

  public resourcesManager: ResourcesManager;

  public mouseControls!: MouseControl.MouseControls;

  public touchControls!: TouchControl.TouchControls;

  constructor() {
    this.threeScene = new THREE.Scene();
    this.threeRenderer = this.makeThreeRenderer();
    this.threeCamera = this.makeThreeCamera();
    this.snapshotThreeCamera = this.makeThreeCamera();
    this.resourcesManager = new ResourcesManager();
    this.clock = new THREE.Clock();
    this.setupEnvironment();

    this.threeRenderer.domElement.addEventListener('click', this.clickHandler.bind(this));
    this.threeRenderer.domElement.addEventListener('mousemove', this.moveMouseHandler.bind(this));
    this.threeRenderer.domElement.addEventListener('mouseup', this.mouseUpHandler.bind(this));
    this.threeRenderer.domElement.addEventListener('mousedown', this.mouseDownHandler.bind(this));
    this.threeRenderer.domElement.addEventListener('wheel', this.mouseWheelHandler.bind(this));

    this.threeRenderer.domElement.addEventListener('touchmove', this.touchMoveHandler.bind(this));
    this.threeRenderer.domElement.addEventListener('touchstart', this.touchStartHandler.bind(this));
    this.threeRenderer.domElement.addEventListener('touchend', this.touchEndHandler.bind(this));
  }

  protected makeThreeRenderer(): THREE.WebGLRenderer {
    return new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
    });
  }

  public makeThreeCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);

    camera.position.set(0.4, 1.4, 4);
    camera.lookAt(1.6, 1, 0);

    return camera;
  }

  public runRenderCycle(): void {
    this.threeRenderer.setAnimationLoop(() => {
      this.syncRendererSize();
      this.characterAction?.onUpdate();
      const delta = this.clock.getDelta();
      this.mainView?.onUpdate(delta);
      this.render();
    });
  }

  public syncRendererSize(): void {
    const { parentElement } = this.threeRenderer.domElement;

    if (!parentElement) return;

    const parentSize = new THREE.Vector2(parentElement.offsetWidth, parentElement.offsetHeight);
    const rendererSize = this.threeRenderer.getSize(new THREE.Vector2());

    if (parentSize.equals(rendererSize)) return;

    this.threeRenderer.setSize(parentElement.offsetWidth, parentElement.offsetHeight);
    this.threeCamera.aspect = parentElement.offsetWidth / parentElement.offsetHeight;
    this.threeCamera.updateProjectionMatrix();
  }

  public setContainer(container: HTMLElement | null): void {
    this.threeRenderer.domElement.remove();

    if (!container) return;
    container.appendChild(this.threeRenderer.domElement);
  }

  public render(): void {
    this.threeRenderer.render(this.threeScene, this.threeCamera);
  }

  public init(
    onProgress: (value: number) => void,
  ): Promise<void> {
    return Promise.all([this.loadSceneTexture(onProgress)])
      .then(() => {
        this.runRenderCycle();
        this.initControls();
        this.mainView = new MainView({ sceneViewport: this });
        this.mainView.addCharacters();
        this.mainView.applyTexture();
        this.mainView.applyHdrTexture();
        this.characterAction = new CharacterAction({ sceneViewport: this, mainView: this.mainView });
        this.characterAction.charactersInit();

        this.initLight(
          new THREE.Vector3(1.1, 2.8, 1.7),
          new THREE.Vector3(1, 0, 0),
        );
      });
  }

  public initControls(): void {
    this.mouseControls = new MouseControl.MouseControls({
      threeCamera: this.threeCamera,
      height: this.threeRenderer.domElement.clientHeight,
      width: this.threeRenderer.domElement.clientWidth,
    });

    this.touchControls = new TouchControl.TouchControls({
      threeCamera: this.threeCamera,
      height: this.threeRenderer.domElement.clientHeight,
      width: this.threeRenderer.domElement.clientWidth,
    });
  }

  public loadSceneTexture(progress: (progress: number) => void): Promise<void> {
    this.resourcesManager.addGlb(scene.background);
    this.resourcesManager.addHdrTexture(scene.environment);

    this.resourcesManager.addVrm(Yuki.maskottSkins.baseSkin);
    this.resourcesManager.addVrm(Mira.maskottSkins.baseSkin);

    Object.values(Yuki.background.base).forEach((texture) => {
      this.resourcesManager.addTexture(texture);
    });
    Object.values(Mira.background.base).forEach((texture) => {
      this.resourcesManager.addTexture(texture);
    });

    return this.resourcesManager.load(progress);
  }

  public setupEnvironment(): void {
    this.threeRenderer.outputEncoding = THREE.sRGBEncoding;
    this.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threeRenderer.shadowMap.enabled = true;

    this.threeRenderer.domElement.style.userSelect = 'none';
    this.threeRenderer.domElement.style.outline = 'none';
    this.threeRenderer.domElement.setAttribute('tabindex', '0');

    this.threeRenderer.setClearColor(0x95b1cc);
    this.threeRenderer.setPixelRatio(1);
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);

    this.threeRenderer.physicallyCorrectLights = false;
    this.threeRenderer.toneMapping = THREE.LinearToneMapping;
    this.threeRenderer.toneMappingExposure = 1;
  }

  public initLight(position: THREE.Vector3, target: THREE.Vector3): void {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(position.x, position.y, position.z);
    light.target.position.set(target.x, target.y, target.z);
    light.penumbra = 0.6;

    this.threeScene.add(light);
    light.target.updateMatrixWorld();
  }

  public clickHandler(event: MouseEvent): void {
    this.characterAction?.characterClickHandler(event);
  }

  public moveMouseHandler(event: MouseEvent): void {
    this.mouseControls.onMouseMove(event);
    this.mouseControls.update();
  }

  public mouseUpHandler(): void {
    this.mouseControls.onMouseStart();
  }

  public mouseDownHandler(event: MouseEvent): void {
    this.mouseControls.onMouseDown(event);
    this.mouseControls.onStartRotate(event);
  }

  public mouseWheelHandler(event: WheelEvent): void {
    this.mouseControls.onMouseWheel(event);
  }

  public touchMoveHandler(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.touchControls.onTouchMove(event);
    this.touchControls.update();
  }

  public touchStartHandler(event: TouchEvent): void {
    this.threeRenderer.domElement.focus();
    this.touchControls.onTouchStart(event);
    this.characterAction?.characterTouchHandler(event);
  }

  public touchEndHandler(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.touchControls.onTouchEnded(event);
  }
}

export default SceneViewport;
