import { makeAutoObservable } from 'mobx';
import AnimationsPanelStore from './panels/AnimationsPanelStore';
import AvatarPanelStore, { AvatarPanelId } from './panels/AvatarPanelStore';
import BodyPanelStore, { BodyPanelId } from './panels/BodyPanelStore';
import EyePanelStore, { EyePanelId } from './panels/EyePanelStore';
import HeadPanelStore, { HeadPanelId } from './panels/HeadPanelStore';
import ShoesPanelStore, { ShoesPanelId } from './panels/ShoesPanelStore';
import StylePanelStore, { StylePanelId } from './panels/StylePanelStore';
import { SceneViewport } from '../../../modules/editor/scene/viewports/SceneViewport';
import BackgroundPanelStore from './panels/BackgroundPanelStore';

export type ActivePanelIdType = AvatarPanelId | BodyPanelId | EyePanelId | HeadPanelId | StylePanelId | ShoesPanelId;

export default class PanelsStore {
  public activePanelId?: ActivePanelIdType = 'avatar';

  private readonly _animationsPanelStore!: AnimationsPanelStore;

  private readonly _avatarPanelStore!: AvatarPanelStore;

  private readonly _bodyPanelStore!: BodyPanelStore;

  private readonly _eyePanelStore!: EyePanelStore;

  private readonly _headPanelStore!: HeadPanelStore;

  private readonly _shoesPanelStore!: ShoesPanelStore;

  private readonly _stylePanelStore!: StylePanelStore;

  private readonly _backgroundPanelStore!: BackgroundPanelStore;

  private readonly _scene: SceneViewport | null = null;

  constructor(scene: SceneViewport | null) {
    this._scene = scene;
    this._animationsPanelStore = new AnimationsPanelStore();
    this._avatarPanelStore = new AvatarPanelStore();
    this._bodyPanelStore = new BodyPanelStore();
    this._eyePanelStore = new EyePanelStore();
    this._headPanelStore = new HeadPanelStore();
    this._shoesPanelStore = new ShoesPanelStore();
    this._stylePanelStore = new StylePanelStore();
    this._backgroundPanelStore = new BackgroundPanelStore();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get sceneOrFail(): SceneViewport {
    if (!this._scene) throw new Error('scene not initialized');
    return this._scene;
  }

  get animationsPanelStore(): AnimationsPanelStore {
    return this._animationsPanelStore;
  }

  get avatarPanelStore(): AvatarPanelStore {
    return this._avatarPanelStore;
  }

  get bodyPanelStore(): BodyPanelStore {
    return this._bodyPanelStore;
  }

  get eyePanelStore(): EyePanelStore {
    return this._eyePanelStore;
  }

  get headPanelStore(): HeadPanelStore {
    return this._headPanelStore;
  }

  get shoesPanelStore(): ShoesPanelStore {
    return this._shoesPanelStore;
  }

  get stylePanelStore(): StylePanelStore {
    return this._stylePanelStore;
  }

  get backgroundPanelStore(): BackgroundPanelStore {
    return this._backgroundPanelStore;
  }

  public setActivePanelType(activePanelId?: ActivePanelIdType): void {
    this.activePanelId = activePanelId;
  }
}
