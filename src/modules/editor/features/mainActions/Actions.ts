import * as THREE from 'three';
import { RaycastSystem } from '../RaycastSystem';
import { TextureEditor, VrmEditor } from '../../scene/textureEditor/index';
import { SceneViewport } from '../../scene/viewports/index';
import { getRendererSnapshot } from '../../utils/getRendererSnapshot';
import EventEmitter from 'eventemitter3';
import * as TWEEN from '@tweenjs/tween.js';
import { CharacterAction } from './CharacterAction';
import { StylesAction } from './StylesAction';
import { Style } from '../../../../types/index';
import { AnimationAction } from './AnimationAction';
import { saveSnapshot } from '../../../../helpers/saveSnapshot';
import { SceneConfig } from '../../scene/viewports/SceneViewport';

export type SceneEventType = {
  loadNewCharacter: (characterName: string, model: THREE.Object3D<THREE.Event>) => void;
  loadNewStyle: (characterName: string, texture: string) => void;

  characterChange: (characterName: string) => void;
  styleChange: (id: string) => void;

  setAnimationTime: (time: number) => void;
  animationEnded: () => void;

  loadTimeAnimation: (loading: boolean) => void;

  rotateCharacter: () => void;

  startUiAnimation: () => void;

  loadParts: (isLoad: boolean) => void;
  onLoadBackground: (isLoad: boolean) => void;
};

export interface ActionOptions {
  sceneViewport: SceneViewport.SceneViewport;
  textureEditor: TextureEditor.TextureEditor;
  vrmEditor: VrmEditor.VrmEditor;
  actions?: Actions;
  config?: SceneConfig;
}

export interface CharacterOptions {
  name: string;
  characterObject: THREE.Object3D<THREE.Event> | null;
}

export class Actions {
  public sceneViewport: SceneViewport.SceneViewport;

  public eventEmitter!: EventEmitter<SceneEventType>;

  public textureEditor: TextureEditor.TextureEditor;

  public vrmEditor: VrmEditor.VrmEditor;

  public raycastSystem: RaycastSystem;

  public startPosition: THREE.Vector3 = new THREE.Vector3(1.3, 0.02, 0);

  public startObject: THREE.Object3D | null = null;

  public characterAction: CharacterAction | null = null;

  public stylesAction: StylesAction | null = null;

  public animationAction: AnimationAction | null = null;

  public currentMixers: THREE.AnimationMixer[] = [];

  constructor(options: ActionOptions) {
    this.sceneViewport = options.sceneViewport;
    this.vrmEditor = options.vrmEditor;
    this.eventEmitter = new EventEmitter<SceneEventType>();
    this.textureEditor = options.textureEditor;
    this.raycastSystem = new RaycastSystem(this.sceneViewport, options.sceneViewport.threeCamera);
    this.characterAction = new CharacterAction({
      actions: this,
      vrmEditor: options.vrmEditor,
      textureEditor: options.textureEditor,
      sceneViewport: this.sceneViewport,
    });
    this.stylesAction = new StylesAction({
      actions: this,
      vrmEditor: options.vrmEditor,
      textureEditor: options.textureEditor,
      sceneViewport: this.sceneViewport,
    });
    this.animationAction = new AnimationAction(
      {
        actions: this,
        vrmEditor: options.vrmEditor,
        textureEditor: options.textureEditor,
        sceneViewport: this.sceneViewport,
      },
    );
    this.subscribeSceneActions(options.config!);
  }

  public onUpdate(delta: number): void {
    TWEEN.update();
    this.currentMixers.forEach((item) => {
      item.update(delta);
    });
    if (this.animationAction && this.animationAction.startCharacterAnimation) {
      this.animationAction.countAnimationTime(this.animationAction.startCharacterAnimation);
    }

    if (this.characterAction) this.characterAction.moveBodyParts(delta);
  }

  public init(styles: Style[]): void {
    if (this.characterAction) this.characterAction.charactersInit(styles);
  }

  public subscribeSceneActions(config: SceneConfig): void {
    const { mouseControls, touchControls } = this.sceneViewport;
    this.subscribe('loadNewStyle', (characterName, texture) => {
      if (this.animationAction && this.animationAction.mixer) {
        if (this.stylesAction) {
          mouseControls.targetRotationX = 0;
          touchControls.targetRotationX = 0;
          this.rotateToDefault();
          this.stylesAction.isLoadStyle = true;
          this.stylesAction.changeStyleTexture(texture);
          this.stylesAction.changeStyleCharacter(characterName, config);
        }
      }
    });

    this.subscribe('loadNewCharacter', (characterName, model) => {
      if (this.animationAction && this.characterAction && model.visible) {
        this.animationAction.playAnimation('forgiveness', true, 1, false);
        mouseControls.setIsLockRotate(true);
        touchControls.setIsLockRotate(true);
        mouseControls.targetRotationX = 0;
        touchControls.targetRotationX = 0;
        this.rotateToDefault();

        if (this.startObject) this.startObject.rotation.y = 0;
        this.characterAction.isLoadCharacter = true;

        const duration = this.startObject ? 3500 : 2500;

        this.characterAction.changeCharacter(model, duration);
        this.characterAction.changeTexture(duration);
      }
    });

    this.subscribe('characterChange', () => {
      if (this.animationAction && this.characterAction) {
        this.characterAction.isLoadCharacter = false;
        if (this.startObject) {
          this.sceneViewport.mouseControls.clearData();
          this.sceneViewport.touchControls.clearData();
        }

        this.sceneViewport.mouseControls.setObject(this.startObject);
        this.sceneViewport.touchControls.setObject(this.startObject);

        this.animationAction.playAnimation('activeStart', true);
        this.animationAction.clearInActiveAnimation();
        if (this.startObject) this.animationAction.playAnimation('activeBack', false);
      }
    });

    this.subscribe('styleChange', () => {
      if (this.animationAction && this.animationAction.mixer) {
        this.animationAction.clearInActiveAnimation();
        if (this.startObject) this.startObject.rotation.y = 0;
        if (this.animationAction && this.stylesAction && this.stylesAction.isLoadStyle) {
          this.stylesAction.isLoadStyle = false;

          mouseControls.targetRotationX = 0;
          touchControls.targetRotationX = 0;
          this.eventEmitter.emit('animationEnded');
        }
      }
    });

    this.subscribe('rotateCharacter', () => {
      this.rotateToDefault();
    });
  }

  public rotateToDefault(): void {
    if (this.startObject) {
      const rotateFrom = Math.abs(this.startObject.rotation.y) > Math.PI * 2
        ? this.startObject.rotation.y % (Math.PI * 2) : this.startObject.rotation.y;
      const rotateTo = 0;
      if (Math.abs(rotateFrom) > 0.5) {
        new TWEEN.Tween({ rotation: rotateFrom })
          .to({ rotation: rotateTo }, 600)
          .onUpdate(({ rotation }) => {
            if (this.startObject) this.startObject.rotation.y = rotation;
          })
          .start();
      }
    }
  }

  public cameraUpdate(): void {
    const { threeCamera, mouseControls, touchControls, threeRenderer } = this.sceneViewport;
    mouseControls.isLockZoom = true;
    const cameraFrom = { fov: 78, positionY: 1.9 };
    const cameraTo = { fov: 33, positionY: 1.4 };
    if (threeRenderer.domElement.clientHeight > threeRenderer.domElement.clientWidth) {
      cameraTo.fov = 43;
    }
    new TWEEN.Tween(cameraFrom)
      .to(cameraTo, 1500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(({ fov, positionY }) => {
        threeCamera.fov = fov;
        threeCamera.position.y = positionY;
        threeCamera.lookAt(1.6, 1, 0);
        threeCamera.updateProjectionMatrix();
        if (fov === cameraTo.fov) {
          touchControls.isChangeFov = true;
          mouseControls.isLockZoom = false;
        }
      })
      .start();
  }

  public takeScreenshot(): void {
    this.sceneViewport.mouseControls.mousePosition.set(-0.5, 0);

    if (this.characterAction) this.characterAction.moveBodyParts(1 / 60);

    this.sceneViewport.threeRenderer.render(this.sceneViewport.threeScene, this.sceneViewport.threeCamera);
    const image = getRendererSnapshot({ trim: false, renderer: this.sceneViewport.threeRenderer });

    saveSnapshot(image, this.startObject?.name || '');

    const previewMousePosition = this.sceneViewport.mouseControls.prevMousePosition;

    this.sceneViewport.threeRenderer.render(this.sceneViewport.threeScene, this.sceneViewport.threeCamera);
    this.sceneViewport.mouseControls.mousePosition.set(previewMousePosition.x, previewMousePosition.y);
  }

  public subscribe<T extends keyof SceneEventType>(
    event: T,
    handler: SceneEventType[T],
  ): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }
}
