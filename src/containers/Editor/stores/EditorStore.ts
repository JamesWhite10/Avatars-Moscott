import { makeAutoObservable } from 'mobx';
import SceneViewport from '../../../modules/Scene/SceneViewport/SceneViewport';
import ResourcesManager from '../../../modules/ResourcesManager';
import ControlsStore from './ControlsStore';
import { saveSnapshot } from '../../../helpers/saveSnapshot';
import { Maskott } from '../../../types/maskott';
import CharacterStore from './CharacterStore';
import StyleStore from './StyleStore';

export default class EditorStore {
  public isReady = false;

  public progress = 0;

  public showLoadingScreen = true;

  public isLoadErrorModalOpen = false;

  public threeScene: SceneViewport | null = null;

  protected resourceManager: ResourcesManager | null;

  public controlsStore!: ControlsStore;

  public charactersStore!: CharacterStore;

  public styleStore!: StyleStore;

  constructor() {
    this.resourceManager = new ResourcesManager();
    makeAutoObservable(this, {}, { autoBind: true });
    this.controlsStore = new ControlsStore();
    this.charactersStore = new CharacterStore();
    this.styleStore = new StyleStore();
    this.subscribe();
  }

  public subscribe(): void {
    this.controlsStore.subscribe('soundChange', () => { console.log('sound change'); });
    this.controlsStore.subscribe('takeScreenShot', () => {
      const maskottPreview = this.threeScene?.getSnapshot();
      if (maskottPreview) this.loadSnapshot(maskottPreview, 'maskott');
    });
    this.controlsStore.subscribe('styleSelect', () => {
      this.styleStore.setShowStyleSelection(true);
    });

    this.controlsStore.subscribe('characterSelect', () => {
      this.charactersStore.setShowCharacterSelection(!this.charactersStore.showCharacterSelection);
    });

    this.charactersStore.subscribe('characterChange', () => {
      this.charactersStore.setCharacterIsChanging(true);
      this.charactersStore.setShowCharacterSelection(false);
      setTimeout(() => {
        this.charactersStore.setCharacterIsChanging(false);
      }, 3000);
    });
    this.charactersStore.subscribe('characterSelectionClosed', () => {
      this.controlsStore.setActiveAvatarPropertyType();
    });

    this.styleStore.subscribe('styleChange', (id) => {
      console.log('style change', id);
    });
    this.styleStore.subscribe('styleSelectionClosed', () => this.controlsStore.setActiveAvatarPropertyType());
  }

  public initialize(): void {
    this.threeScene = new SceneViewport();
    this.threeScene.init(this.onProgress.bind(this))
      .then(() => {
        this.setIsReady(true);
      });
  }

  public onProgress(progress: number): void {
    this.setProgress(progress);
  }

  public setIsReady(isLoading: boolean): void {
    this.isReady = isLoading;
  }

  public setUp(characters: Maskott[]): void {
    this.charactersStore.setUp(characters);
  }

  public setProgress(progress: number): void {
    if (progress < 0) this.progress = 0;
    if (progress >= 100) this.progress = 100;
    this.progress = progress;
  }

  public setIsLoadErrorModalOpen(isOpen: boolean): void {
    this.isLoadErrorModalOpen = isOpen;
  }

  public setShowLoadingScreen(show: boolean): void {
    this.showLoadingScreen = show;
  }

  public loadSnapshot(maskottPreview: string, maskottName: string): void {
    saveSnapshot(maskottPreview, maskottName);
  }
}
