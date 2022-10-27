import * as THREE from 'three';
import ResourcesManager from '../../../ResourcesManager';
import scene from '../../../assets/json/scene/scene.json';
import CameraControls from 'camera-controls';
import { MainView } from '../views/MainView';
import Yuki from '@app/modules/assets/json/scene/maskotts/Yuki.json';
import Mira from '@app/modules/assets/json/scene/maskotts/Mira.json';
import { MainScene } from '../../../MaskottScene/views/MainScene';

CameraControls.install({ THREE });

class SceneViewport {
  public threeScene: THREE.Scene;

  public threeRenderer: THREE.WebGLRenderer;

  public threeCamera: THREE.PerspectiveCamera;

  public threeControls: CameraControls;

  public clock: THREE.Clock;

  public mainView: MainView | null = null;

  public mainScene: MainScene | null = null;

  public snapshotThreeCamera: THREE.PerspectiveCamera;

  public resourcesManager: ResourcesManager;

  constructor() {
    this.threeScene = new THREE.Scene();
    this.threeRenderer = this.makeThreeRenderer();
    this.threeCamera = this.makeThreeCamera();
    this.snapshotThreeCamera = this.makeThreeCamera();
    this.resourcesManager = new ResourcesManager();
    this.threeControls = this.makeThreeControls(this.threeCamera, this.threeRenderer);
    this.clock = new THREE.Clock();
    this.setupEnvironment();

    this.threeRenderer.domElement.addEventListener('click', this.clickHandler.bind(this));
  }

  protected makeThreeRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
    });
    return renderer;
  }

  public makeThreeCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

    camera.position.set(-1.3, 1.4, 2.6);

    return camera;
  }

  public runRenderCycle(): void {
    this.threeRenderer.setAnimationLoop(() => {
      this.syncRendererSize();
      this.mainScene?.onUpdate();
      const delta = this.clock.getDelta();
      this.threeControls.update(delta);
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

  protected makeThreeControls(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): CameraControls {
    const controls = new CameraControls(camera, renderer.domElement);

    controls.maxPolarAngle = Math.PI * 0.53;
    controls.minPolarAngle = Math.PI * 0.48;
    controls.maxAzimuthAngle = 0.3;
    controls.minAzimuthAngle = -0.3;

    controls.mouseButtons.right = CameraControls.ACTION.NONE;
    controls.dampingFactor = 0.1;
    controls.dollySpeed = 0.8;
    controls.minDistance = 2.3;
    controls.maxDistance = 4;
    return controls;
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
        this.mainView = new MainView({ sceneViewport: this });
        this.mainView.addMaskotts();
        this.mainView.applyTexture();
        this.mainView.applyHdrTexture();
        this.mainScene = new MainScene({ sceneViewport: this, mainView: this.mainView });
        this.mainScene.maskottInit();

        this.initLight(
          new THREE.Vector3(4, 2.8, 1.7),
          new THREE.Vector3(4, 0, 0),
        );

        this.initLight(
          new THREE.Vector3(1.5, 2.8, 1.7),
          new THREE.Vector3(1.5, 0, 0),
        );
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
    this.threeRenderer.setPixelRatio(2);
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);

    this.threeRenderer.physicallyCorrectLights = false;
    this.threeRenderer.toneMapping = THREE.LinearToneMapping;
    this.threeRenderer.toneMappingExposure = 1;
  }

  public clickHandler(event: MouseEvent): void {
    if (this.mainScene) this.mainScene.handleMaskottClick(event);
  }

  public initLight(position: THREE.Vector3, target: THREE.Vector3): void {
    const color = 0xFFFFFF;
    const intensity = 1.3;
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(position.x, position.y, position.z);
    light.target.position.set(target.x, target.y, target.z);
    light.penumbra = 1;
    light.angle = 0.9;

    this.threeScene.add(light);
    light.target.updateMatrixWorld();
  }
}

export default SceneViewport;
