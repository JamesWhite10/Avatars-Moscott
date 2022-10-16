import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ResourcesManager, { GlbResource, HdrTextureResource, ResourceType } from '../../ResourcesManager';
import scene from '../../assets/json/scene/scene.json';
import setupEnvironment from '../../helpers/setupEnvironment';
import { MaskottEnum } from '../../../enum/MaskottEnum';

class SceneViewport {
  public threeScene: THREE.Scene;

  public threeRenderer: THREE.WebGLRenderer;

  public threeCamera: THREE.PerspectiveCamera;

  public controls: OrbitControls;

  protected resourcesManager: ResourcesManager;

  constructor() {
    this.threeScene = new THREE.Scene();
    this.threeRenderer = this.makeThreeRenderer();
    this.threeCamera = this.makeThreeCamera();
    this.resourcesManager = new ResourcesManager();
    this.controls = this.makeThreeControls(this.threeCamera, this.threeRenderer);
    this.setupEnvironment();
  }

  protected makeThreeRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    return renderer;
  }

  // TODO: get out of here
  public setLight(): void {
    setupEnvironment(this.threeRenderer, this.threeScene);
  }

  public makeThreeCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 1.8, 4.3);
    return camera;
  }

  public runRenderCycle(): void {
    this.threeRenderer.setAnimationLoop(() => {
      this.syncRendererSize();
      this.controls.update();
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

  protected makeThreeControls(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): OrbitControls {
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.maxPolarAngle = Math.PI * 0.53;
    controls.minPolarAngle = Math.PI / 2;
    controls.target.set(0, 1, 1);
    controls.maxAzimuthAngle = Math.PI * 0.07;
    controls.minAzimuthAngle = -Math.PI * 0.07;

    controls.target.set(0, 1, 1);
    controls.minZoom = 0;
    controls.maxZoom = 1;

    controls.minDistance = 2.4;
    controls.maxDistance = 5;

    controls.autoRotateSpeed = 1;
    controls.enablePan = !0;
    controls.zoomSpeed = 5;

    controls.minDistance = 2.4;
    controls.maxDistance = 5;

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
    this.threeRenderer.shadowMap.enabled = true;
    this.threeRenderer.domElement.style.userSelect = 'none';
    this.threeRenderer.domElement.style.outline = 'none';
    this.threeRenderer.domElement.setAttribute('tabindex', '0');
    this.threeRenderer.setClearColor(0x95b1cc);
    this.threeRenderer.setPixelRatio(2);
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
    this.threeRenderer.localClippingEnabled = true;
    this.threeRenderer.physicallyCorrectLights = true;
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
      }
    });

    this.threeScene.add(texture.scene);
    this.threeScene.environment = pmremGenerator.fromEquirectangular(hdrTexture).texture;
    hdrTexture.dispose();
    pmremGenerator.dispose();
  }
}

export default SceneViewport;
