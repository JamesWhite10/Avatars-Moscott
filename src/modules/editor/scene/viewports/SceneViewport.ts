import * as THREE from 'three';
import ResourcesManager, { ResourceType } from '../ResourcesManager';
import { TextureEditor, VrmEditor } from '../textureEditor/index';
import { MouseControl, TouchControl } from '../cameraControls/index';
import { AnimationsType, Avatar, EnvironmentConfigType, Style } from '../../../../types/index';
import { NOISE } from '@app/config/textures';
import { Actions } from '../../features/mainActions/index';
import { getAnimationFile } from '../../utils/getAnimationFile';

export type SceneConfig = {
  characters: Avatar[]; // TODO возможно перемапать на свои внутренние типы
  styles: Style[];
  environment: EnvironmentConfigType;
  animations: AnimationsType[];
};

export class SceneViewport {
  public threeScene: THREE.Scene;

  public threeRenderer: THREE.WebGLRenderer;

  public threeCamera: THREE.PerspectiveCamera;

  public clock: THREE.Clock;

  public textureEditor: TextureEditor.TextureEditor;

  public vrmEditor: VrmEditor.VrmEditor;

  public actions: Actions.Actions | null = null;

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
    this.textureEditor = new TextureEditor.TextureEditor({ sceneViewport: this });
    this.vrmEditor = new VrmEditor.VrmEditor({ sceneViewport: this });
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
      alpha: true,
      preserveDrawingBuffer: true,
    });
  }

  public makeThreeCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(78, window.innerWidth / window.innerHeight, 1, 100);

    camera.position.set(0.4, 1.9, 4);
    camera.lookAt(1.6, 1, 0);

    return camera;
  }

  public runRenderCycle(): void {
    this.threeRenderer.setAnimationLoop(() => {
      this.syncRendererSize();
      const delta = this.clock.getDelta();
      if (this.actions) this.actions.onUpdate(delta);
      if (this.textureEditor) this.textureEditor.onUpdate(delta);
      this.mouseControls.onUpdate();
      this.touchControls.onUpdate();
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

  public init(config: SceneConfig, onProgress: (value: number) => void): Promise<void> {
    return Promise.all([
      this.loadHdrTexture(onProgress, config),
      this.loadSceneTexture(onProgress, config),
      this.loadAnimation(onProgress, config),
      this.loadCharacters(onProgress, config),
    ])
      .then(() => {
        this.runRenderCycle();
        this.initTexture(config);
        this.initControls();
        this.initLight();
        this.initMainSkeleton(config);
        this.initCharacters(config);
        this.initMainActions(config);
      });
  }

  public initMainActions(config: SceneConfig): void {
    if (this.textureEditor) {
      this.actions = new Actions.Actions({
        config,
        sceneViewport: this,
        textureEditor: this.textureEditor,
        vrmEditor: this.vrmEditor,
      });
      if (this.actions.animationAction) {
        this.actions.animationAction.init(config.characters, config.styles, config.animations);
        this.actions.animationAction.waitInActiveAnimation();
      }
      this.actions.init(config.styles);
    }
  }

  public initTexture(config: SceneConfig): void {
    if (this.textureEditor) {
      this.textureEditor.applyTexture(config);
      this.textureEditor.applyVideoTexture(config);
      this.textureEditor.applyHdrTexture(config.environment);
      this.initMainActions(config);
    }
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

  public loadHdrTexture(progress: (progress: number) => void, config: SceneConfig): Promise<void> {
    const { environment } = config;

    this.resourcesManager.addHdrTexture(environment.environment);
    return this.resourcesManager.load(progress);
  }

  public loadAnimation(progress: (progress: number) => void, config: SceneConfig): Promise<void> {
    const { characters, animations } = config;

    animations.forEach((item) => {
      this.resourcesManager.addFbx(item.animation);
    });

    characters.forEach((avatar) => {
      if (avatar.animations) {
        avatar.animations.forEach((animation) => {
          const fileAnimation = getAnimationFile(animation.id, ResourceType.FBX.toLowerCase());
          this.resourcesManager.addFbx(fileAnimation);
        });
      }
    });
    return this.resourcesManager.load(progress);
  }

  public loadCharacters(progress: (progress: number) => void, config: SceneConfig): Promise<void> {
    const { styles } = config;

    styles.forEach((style, index) => {
      style.parts.forEach((part) => {
        if (index === 0 || index === 2) {
          if (part.source) this.resourcesManager.addVrm(part.source);
          Object.values(part.texturesMap).forEach((texture) => {
            this.resourcesManager.addTexture(texture);
          });
        }
      });
    });

    return this.resourcesManager.load(progress);
  }

  public initMainSkeleton(config: SceneConfig): void {
    const { characters } = config;
    characters.forEach((character) => {
      character.parts.forEach((avatarPart) => {
        if (avatarPart.slots.includes(character.basePart) && avatarPart.source) {
          const rootPart = this.resourcesManager.getVrmByUrlOrFail(avatarPart.source);
          this.vrmEditor.addBaseSkeleton(rootPart.userData.vrm, `${character.name}_base`.toLowerCase());

          const keys: Record<string, string>[] = [];
          Object.keys(avatarPart.texturesMap).forEach((key: string) => {
            if (key === 'base') keys.push({ name: avatarPart.id, key });
            else if (key.includes('base') && key !== 'base') keys.push({ name: key, key });
          });

          keys.forEach((value) => {
            const textureUrl = avatarPart.texturesMap[value.key];
            const texture = this.resourcesManager.getTextureByUrlOrFail(textureUrl);
            this.vrmEditor.applyTexture(value.name, `${character.name}_base`.toLowerCase(), texture);
          });
        }
      });
    });
  }

  public initCharacters(config: SceneConfig): void {
    const { styles, characters } = config;
    styles.forEach((style, index) => {
      if (index === 0 || index === 2) {
        const object = characters.find((character) => style.id.includes(character.id));
        style.parts.forEach((avatarPart) => {
          if (object && !avatarPart.slots.includes(object.basePart)) {
            if (avatarPart.source) {
              const rootPart = this.resourcesManager.getVrmByUrlOrFail(avatarPart.source);
              this.vrmEditor.applyToBaseParts(rootPart.userData.vrm, avatarPart.id, style.id, avatarPart.slots[0]);
            }
            const texture = this.resourcesManager.getTextureByUrlOrFail(avatarPart.texturesMap.base);
            this.vrmEditor.applyTexture(avatarPart.id, style.id, texture);
          }
        });
      }
    });
    const dissolveTexture = this.resourcesManager.getTextureByUrlOrFail(NOISE);
    this.vrmEditor.prepareAndAddObjects(dissolveTexture);
  }

  public loadSceneTexture(progress: (progress: number) => void, config: SceneConfig): Promise<void> {
    const { styles, environment } = config;

    this.resourcesManager.addGlb(environment.background);
    this.resourcesManager.addTexture(NOISE);

    styles.forEach((style) => {
      if (style.animations) {
        style.animations.forEach((animation) => {
          const fileAnimation = getAnimationFile(animation.id, ResourceType.FBX.toLowerCase());
          this.resourcesManager.addFbx(fileAnimation);
        });
      }
    });

    styles.forEach((style) => {
      Object.values(style.background).forEach((texture) => {
        this.resourcesManager.addTexture(texture);
      });
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
    this.threeRenderer.setPixelRatio(0.8);
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);

    this.threeRenderer.physicallyCorrectLights = false;
    this.threeRenderer.toneMapping = THREE.LinearToneMapping;
    this.threeRenderer.toneMappingExposure = 1;
  }

  public initLight(): void {
    const intensity = 0.7;
    const light = new THREE.DirectionalLight(0xffffff, intensity);
    light.position.set(1.5, 2.8, 1);
    light.target.position.set(0, 0, 0);
    this.threeScene.add(light);
    light.castShadow = true;

    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500;
    light.shadow.camera.right = 17;
    light.shadow.camera.left = -17;
    light.shadow.camera.top = 17;
    light.shadow.camera.bottom = -17;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
  }

  public clickHandler(event: MouseEvent): void {
    event.preventDefault();
    if (this.actions && this.actions.characterAction && this.actions.animationAction) {
      if (this.mouseControls.object && !this.mouseControls.isRotateObject) {
        this.actions.characterAction.characterClickHandler(event);
        this.actions.animationAction.clearInActiveAnimation();
      }
    }
  }

  public moveMouseHandler(event: MouseEvent): void {
    this.mouseControls.onMouseMove(event);
    this.mouseControls.updateCameraParallax();
    if (this.actions && this.actions.animationAction) this.actions.animationAction.clearInActiveAnimation();
  }

  public mouseUpHandler(): void {
    this.mouseControls.onMouseUp();
  }

  public mouseDownHandler(event: MouseEvent): void {
    if (this.mouseControls.object) {
      this.mouseControls.onMouseDown(event);
      this.mouseControls.onStartRotate(event);
    }
  }

  public mouseWheelHandler(event: WheelEvent): void {
    this.mouseControls.onMouseWheel(event);
    if (this.actions && this.actions.animationAction) this.actions.animationAction.clearInActiveAnimation();
  }

  public touchMoveHandler(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.touchControls.onTouchMove(event);
    this.touchControls.updateCameraParallax();
    if (this.actions && this.actions.animationAction) this.actions.animationAction.clearInActiveAnimation();
  }

  public touchStartHandler(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.threeRenderer.domElement.focus();
    this.touchControls.onTouchStart(event);
    if (this.actions && this.actions.animationAction) this.actions.animationAction.clearInActiveAnimation();
  }

  public touchEndHandler(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.touchControls.onTouchEnded(event);
  }
}
