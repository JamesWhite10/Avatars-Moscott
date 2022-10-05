import { makeAutoObservable } from 'mobx';
import SceneViewport from '../../../modules/Scene/SceneViewport/SceneViewport';
import ResourcesManager from '../../../modules/ResourcesManager';

export default class EditorStore {
  public isReady = false;

  public progress = 0;

  public showLoadingScreen = true;

  public threeScene: SceneViewport | null = null;

  protected resourceManager: ResourcesManager | null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.resourceManager = new ResourcesManager();
  }

  public initialize(): void {
    this.threeScene = new SceneViewport();
    this.threeScene.init(this.onProgress);
  }

  public onProgress(progress: number): void {
    if (progress === 100) this.init();
    this.setProgress(progress);
  }

  public init(): void {
    this.setIsReady(true);
  }

  public setIsReady(isLoading: boolean): void {
    this.isReady = isLoading;
  }

  public setProgress(progress: number): void {
    if (progress < 0) this.progress = 0;
    if (progress >= 100) this.progress = 100;
    this.progress = progress;
  }

  public setShowLoadingScreen(show: boolean): void {
    this.showLoadingScreen = show;
  }
}
