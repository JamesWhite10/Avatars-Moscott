import * as THREE from 'three';
import { RaycastSystem } from '../RaycastSystem';
import { TextureEditor } from '../../scene/textureEditor/TextureEditor';
import { SceneViewport } from '../../scene/viewports/index';
import { getRendererSnapshot } from '../../utils/getRendererSnapshot';
import EventEmitter from 'eventemitter3';
import * as TWEEN from '@tweenjs/tween.js';
import { CharacterAction } from './CharacterAction';
import { StylesAction } from './StylesAction';
import { Style } from '../../../../types/index';
import { AnimationAction } from './AnimationAction';

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
};

export interface ActionOptions {
  sceneViewport: SceneViewport.SceneViewport;
  textureEditor: TextureEditor;
  actions?: Actions;
}

export interface CharacterOptions {
  name: string;
  characterObject: THREE.Object3D<THREE.Event> | null;
}

export class Actions {
  public sceneViewport: SceneViewport.SceneViewport;

  public eventEmitter!: EventEmitter<SceneEventType>;

  public textureEditor: TextureEditor;

  public raycastSystem: RaycastSystem;

  public startPosition: THREE.Vector3 = new THREE.Vector3(1.3, 0.19, 0);

  public startObject: THREE.Object3D | null = null;

  public characterAction: CharacterAction | null = null;

  public stylesAction: StylesAction | null = null;

  public animationAction: AnimationAction | null = null;

  public currentMixers: THREE.AnimationMixer[] = [];

  constructor(options: ActionOptions) {
    this.sceneViewport = options.sceneViewport;
    this.eventEmitter = new EventEmitter<SceneEventType>();
    this.textureEditor = options.textureEditor;
    this.raycastSystem = new RaycastSystem(options.sceneViewport.threeScene, options.sceneViewport.threeCamera);
    this.characterAction = new CharacterAction({
      actions: this,
      textureEditor: options.textureEditor,
      sceneViewport: this.sceneViewport,
    });
    this.stylesAction = new StylesAction({
      actions: this,
      textureEditor: options.textureEditor,
      sceneViewport: this.sceneViewport,
    });
    this.animationAction = new AnimationAction(
      {
        actions: this,
        textureEditor: options.textureEditor,
        sceneViewport: this.sceneViewport,
      },
    );
    this.subscribeSceneActions();
  }

  public onUpdate(delta: number): void {
    TWEEN.update();
    this.currentMixers.forEach((item) => {
      item.update(delta);
    });
    this.characterAction?.moveBodyParts(delta);
    if (this.animationAction && this.animationAction.startCharacterAnimation) {
      this.animationAction.countAnimationTime(this.animationAction.startCharacterAnimation);
    }
  }

  public init(styles: Style[]): void {
    if (this.characterAction) this.characterAction.charactersInit(styles);
  }

  public subscribeSceneActions(): void {
    const { mouseControls, touchControls } = this.sceneViewport;
    this.subscribe('loadNewStyle', (characterName, texture) => {
      if (this.animationAction && this.animationAction.mixer) {
        if (this.stylesAction) {
          mouseControls.targetRotationX = 0;
          touchControls.targetRotationX = 0;
          this.rotateToDefault();
          this.stylesAction.isLoadStyle = true;
          this.stylesAction.changeStyleTexture(texture);
          this.stylesAction.changeStyleCharacter(characterName);
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
        if (!this.startObject) this.loadNewCharacter(model);
        else {
          this.animationAction.mixer?.addEventListener('finished', () => {
            if (model.visible) this.loadNewCharacter(model);
          });
        }
      }
    });

    this.subscribe('characterChange', () => {
      this.animationAction?.playAnimation('activeStart', true);
      if (this.startObject) this.animationAction?.playAnimation('activeBack', false);
    });

    this.subscribe('styleChange', () => {
      if (this.animationAction && this.animationAction.mixer) {
        mouseControls.setIsLockRotate(true);
        touchControls.setIsLockRotate(true);
        if (this.startObject) this.startObject.rotation.y = 0;
        this.animationAction.playAnimation('switchStyle', true, 1);

        this.animationAction.mixer.addEventListener('finished', () => {
          if (this.animationAction && this.stylesAction && this.stylesAction.isLoadStyle) {
            this.stylesAction.isLoadStyle = false;
            mouseControls.setIsLockRotate(false);
            touchControls.setIsLockRotate(false);

            mouseControls.targetRotationX = 0;
            touchControls.targetRotationX = 0;
            this.eventEmitter.emit('animationEnded');
            this.animationAction.playAnimation('activeStart', true);
          }
        });
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

  public loadNewCharacter(model: THREE.Object3D): void {
    if (this.characterAction && this.characterAction.isLoadCharacter && this.animationAction) {
      this.characterAction.isLoadCharacter = false;
      this.characterAction.changeCharacter(model);
      this.characterAction.changeTexture();
      this.animationAction.playAnimation('activeStart', true);
      if (this.startObject) {
        this.sceneViewport.mouseControls.clearData();
        this.sceneViewport.touchControls.clearData();
      }

      this.sceneViewport.mouseControls.setObject(model);
      this.sceneViewport.touchControls.setObject(model);
    }
  }

  public cameraUpdate(): void {
    const cameraFrom = { fov: 90, positionY: 1.9 };
    const cameraTo = { fov: 45, positionY: 1.4 };
    new TWEEN.Tween(cameraFrom)
      .to(cameraTo, 1500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(({ fov, positionY }) => {
        this.sceneViewport.threeCamera.fov = fov;
        this.sceneViewport.threeCamera.position.y = positionY;
        this.sceneViewport.threeCamera.lookAt(1.6, 1, 0);
        this.sceneViewport.threeCamera.updateProjectionMatrix();
      })
      .start();
  }

  public getSnapshot(): string {
    return getRendererSnapshot({ trim: true, renderer: this.sceneViewport.threeRenderer });
  }

  public subscribe<T extends keyof SceneEventType>(
    event: T,
    handler: SceneEventType[T],
  ): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }
}
