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

export type SceneEventType = {
  loadCharacter: () => void;
  characterChange: (characterName: string) => void;
};

export interface ActionOptions {
  sceneViewport: SceneViewport.SceneViewport;
  mainView: TextureEditor;
  action?: Actions;
}

export interface CharacterOptions {
  name: string;
  characterObject: THREE.Object3D<THREE.Event> | null;
}

export class Actions {
  public _sceneViewport: SceneViewport.SceneViewport;

  public eventEmitter!: EventEmitter<SceneEventType>;

  public _mainView: TextureEditor;

  public raycastSystem: RaycastSystem;

  public startPosition: THREE.Vector3 = new THREE.Vector3(1.3, 0.05, 0);

  public startObject: THREE.Object3D | null = null;

  public characterAction: CharacterAction | null = null;

  public stylesAction: StylesAction | null = null;

  constructor(options: ActionOptions) {
    this._sceneViewport = options.sceneViewport;
    this.eventEmitter = new EventEmitter<SceneEventType>();
    this._mainView = options.mainView;
    this.raycastSystem = new RaycastSystem(options.sceneViewport.threeScene, options.sceneViewport.threeCamera);
    this.characterAction = new CharacterAction({ action: this, mainView: this._mainView, sceneViewport: this._sceneViewport });
    this.stylesAction = new StylesAction({ action: this, mainView: this._mainView, sceneViewport: this._sceneViewport });
  }

  public init(styles: Style[]): void {
    if (this.characterAction) this.characterAction.charactersInit(styles);
  }

  public onUpdate(): void {
    TWEEN.update();
  }

  public subscribe<T extends keyof SceneEventType>(
    event: T,
    handler: SceneEventType[T],
  ): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }

  public getSnapshot(): string {
    return getRendererSnapshot({ trim: false, renderer: this._sceneViewport.threeRenderer });
  }
}
