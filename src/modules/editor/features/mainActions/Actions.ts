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
    this.vrmAvatarUpdate(delta);
    if (this.animationAction && this.animationAction.startCharacterAnimation) {
      this.animationAction.countAnimationTime(this.animationAction.startCharacterAnimation);
    }
  }

  public init(styles: Style[]): void {
    if (this.characterAction) this.characterAction.charactersInit(styles);
  }

  public vrmAvatarUpdate(delta: number): void {
    this.textureEditor.vrmAvatars.forEach((avatar) => {
      avatar.update(delta);
    });
  }

  public subscribeSceneActions(): void {
    this.subscribe('loadNewStyle', (characterName, texture) => {
      if (this.animationAction && this.animationAction.mixer) {
        if (this.stylesAction) {
          this.stylesAction.isLoadStyle = true;
          this.stylesAction.changeStyleTexture(texture);
          this.stylesAction.changeStyleCharacter(characterName);
        }
      }
    });

    this.subscribe('loadNewCharacter', (characterName, model) => {
      if (this.animationAction && this.characterAction) {
        this.animationAction.playAnimation('forgiveness', true, 1);
        this.characterAction.isLoadCharacter = true;
        if (!this.startObject) {
          this.animationAction.stopAnimation();
          this.loadNewCharacter(model);
        } else {
          this.animationAction.mixer?.addEventListener('finished', () => {
            this.loadNewCharacter(model);
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
        this.animationAction.playAnimation('switchStyle', true, 1);
        this.animationAction.mixer.addEventListener('finished', () => {
          if (this.animationAction && this.stylesAction && this.stylesAction.isLoadStyle) {
            this.stylesAction.isLoadStyle = false;
            this.eventEmitter.emit('animationEnded');
            this.animationAction.playAnimation('activeStart', true);
          }
        });
      }
    });
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

  public getSnapshot(): string {
    return getRendererSnapshot({ trim: false, renderer: this.sceneViewport.threeRenderer });
  }

  public subscribe<T extends keyof SceneEventType>(
    event: T,
    handler: SceneEventType[T],
  ): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }
}
