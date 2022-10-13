import * as THREE from 'three';
import ResourcesManager, { GlbResource, HdrTextureResource, ResourceType } from '../../ResourcesManager';
import scene from '../../assets/json/scene/scene.json';
import setupEnvironment from '../../helpers/setupEnvironment';
import { MaskottEnum } from '../../enum/MaskottEnum';
import CameraControls from 'camera-controls';
import { getRendererSnapshot } from '../../utils/getRendererSnapshot';

CameraControls.install({ THREE });

class SceneViewport {
  public threeScene: THREE.Scene;

  public threeRenderer: THREE.WebGLRenderer;

  public threeCamera: THREE.PerspectiveCamera;

  public snapshotThreeControls: CameraControls;

  public threeControls: CameraControls;

  public clock: THREE.Clock;

  public snapshotThreeCamera: THREE.PerspectiveCamera;

  protected resourcesManager: ResourcesManager;

  constructor() {
    this.threeScene = new THREE.Scene();
    this.threeRenderer = this.makeThreeRenderer();
    this.threeCamera = this.makeThreeCamera();
    this.snapshotThreeCamera = this.makeThreeCamera();
    this.resourcesManager = new ResourcesManager();
    this.threeControls = this.makeThreeControls(this.threeCamera, this.threeRenderer);
    this.snapshotThreeControls = this.makeThreeControls(this.snapshotThreeCamera, this.threeRenderer);
    this.clock = new THREE.Clock();
    this.setupEnvironment();
  }

  protected makeThreeRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    return renderer;
  }

  // TODO: get out of here
  public setLight(): void {
    setupEnvironment(this.threeRenderer, this.threeScene);
  }

  public makeThreeCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 1.1, 2.8);
    return camera;
  }

  public runRenderCycle(): void {
    this.threeRenderer.setAnimationLoop(() => {
      this.syncRendererSize();
      const delta = this.clock.getDelta();
      this.threeControls.update(delta);
      this.snapshotThreeControls.update(delta);
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
    controls.minPolarAngle = Math.PI * 0.43;
    controls.maxAzimuthAngle = Math.PI * 0.07;
    controls.minAzimuthAngle = -Math.PI * 0.07;
    controls.setPosition(0, 1.1, 2.4, false);
    controls.setTarget(-0.2, 0.8, 1.1, false);
    controls.dampingFactor = 0.3;
    controls.dollySpeed = 0.8;
    controls.minDistance = 1;
    controls.maxDistance = 1.6;
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
        this.setLight();
        this.applyTexture();
      });
  }

  public loadSceneTexture(
    progress: (progress: number) => void,
  ): Promise<void> {
    this.resourcesManager.addGlb(scene.background);
    this.resourcesManager.addHdrTexture(scene.environment);
    return this.resourcesManager.load(progress);
  }

  public setupEnvironment(): void {
    this.threeRenderer.outputEncoding = THREE.sRGBEncoding;
    // this.threeRenderer.shadowMap.type = THREE.VSMShadowMap;
    // this.threeRenderer.shadowMap.type = THREE.PCFShadowMap;
    this.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threeRenderer.shadowMap.enabled = true;

    this.threeRenderer.domElement.style.userSelect = 'none';
    this.threeRenderer.domElement.style.outline = 'none';
    this.threeRenderer.domElement.setAttribute('tabindex', '0');

    this.threeRenderer.setClearColor(0x95b1cc);
    this.threeRenderer.setPixelRatio(window.devicePixelRatio || 1);
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);

    this.threeRenderer.physicallyCorrectLights = false;
    this.threeRenderer.toneMapping = THREE.LinearToneMapping;
    this.threeRenderer.toneMappingExposure = 1;
  }

  public applyTexture(): void {
    const pmremGenerator = new THREE.PMREMGenerator(this.threeRenderer);
    const texture = this.resourcesManager.getResourceContentByUrlOrFail<GlbResource>(scene.background, ResourceType.GLB);
    const hdrTexture = this.resourcesManager.getResourceContentByUrlOrFail<HdrTextureResource>(
      scene.environment,
      ResourceType.HDR_TEXTURE,
    );

    texture.scene.getObjectByName(MaskottEnum.MIRA)?.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.receiveShadow = true;
        node.castShadow = true;
        (node.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5;
        console.log(node.material, node);
      }
    });

    this.threeScene.add(texture.scene);
    this.threeScene.environment = pmremGenerator.fromEquirectangular(hdrTexture).texture;
    hdrTexture.dispose();
    pmremGenerator.dispose();
  }

  // TODO: get out of here
  public getSnapshot(): string {
    const { background } = this.threeScene;
    const rendererSize = this.threeRenderer.getSize(new THREE.Vector2());

    this.threeScene.background = null;

    this.threeCamera.children.forEach((child) => this.snapshotThreeCamera.add(child));

    this.threeRenderer.render(this.threeScene, this.snapshotThreeCamera);

    const snapshot = getRendererSnapshot({ trim: false, renderer: this.threeRenderer });

    this.threeScene.background = background;
    this.threeRenderer.setSize(rendererSize.width, rendererSize.height);

    this.snapshotThreeCamera.children.forEach((child) => this.threeCamera.add(child));

    return snapshot;
  }
}

export default SceneViewport;
