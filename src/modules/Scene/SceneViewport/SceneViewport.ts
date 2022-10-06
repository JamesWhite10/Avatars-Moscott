import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import setupEnvironment from '../../helpers/setupEnvironment';
import ResourcesManager, { GlbResource, HdrTextureResource, ResourceType } from '../../ResourcesManager';
import textures from '../../assets/json/textures/textures.json';

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

  public setEnvironment(): void {
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
        this.setEnvironment();
        this.applyTexture();
      });
  }

  public loadSceneTexture(
    progress: (progress: number) => void,
  ): Promise<void> {
    this.resourcesManager.addGlb(textures.background);
    this.resourcesManager.addHdrTexture(textures.environment);
    return this.resourcesManager.load(progress);
  }

  public applyTexture(): void {
    const texture = this.resourcesManager.getResourceContentByUrlOrFail<GlbResource>(textures.background, ResourceType.GLB);
    const hdrTexture = this.resourcesManager.getResourceContentByUrlOrFail<HdrTextureResource>(
      textures.environment,
      ResourceType.HDR_TEXTURE,
    );
    this.threeScene.add(texture.scene);
    this.threeScene.environment = hdrTexture;
  }
}

export default SceneViewport;
