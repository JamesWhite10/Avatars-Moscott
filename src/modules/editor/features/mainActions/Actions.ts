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
  loadCharacter: () => void;
  characterChange: (characterName: string) => void;
  loadStyleCharacter: (characterName: string, texture: string) => void;
  loadNewCharacter: (characterName: string, model: THREE.Object3D<THREE.Event>) => void;
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

  public isLoadingCharacter: boolean = false;

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

  public init(styles: Style[]): void {
    if (this.characterAction) this.characterAction.charactersInit(styles);
  }

  public onUpdate(delta: number): void {
    TWEEN.update();
    this.textureEditor.vrmAvatars.forEach((avatar) => {
      avatar.update(delta);
      // avatar.vrm.lookAt?.update(delta);
    });
  }

  public subscribeSceneActions(): void {
    this.subscribe('loadStyleCharacter', (characterName, texture) => {
      if (this.animationAction) {
        this.animationAction.playAnimation('switchCharacter', true);
        this.isLoadingCharacter = true;

        this.animationAction.removeLoopAnimation(() => {
          if (this.stylesAction) {
            this.isLoadingCharacter = false;
            this.stylesAction.changeStyleTexture(texture);
            this.stylesAction.changeStyleCharacter(characterName);

            if (this.animationAction) {
              this.animationAction.playAnimation('activeStart', true);
              this.animationAction.playAnimation('activeBack', false);
            }
          }
        }, 1500);
      }
    });

    this.subscribe('loadNewCharacter', (characterName, model) => {
      const time = this.startObject ? 1500 : 0;
      if (this.startObject) this.animationAction?.playAnimation('forgiveness', true);
      this.isLoadingCharacter = true;

      this.animationAction?.removeLoopAnimation(() => {
        if (this.characterAction) {
          this.isLoadingCharacter = false;
          this.characterAction.changeCharacter(model);
          this.characterAction.changeTexture();
          this.animationAction?.playAnimation('activeStart', true);
        }
      }, time);
    });
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
    return getRendererSnapshot({ trim: false, renderer: this.sceneViewport.threeRenderer });
  }

  public subscribe<T extends keyof SceneEventType>(
    event: T,
    handler: SceneEventType[T],
  ): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }
}
