import { makeAutoObservable } from 'mobx';
import SceneViewport from '@app/modules/features/Scene/viewports/SceneViewport';
import ResourcesManager from '../../../modules/ResourcesManager';
import ControlsStore from './ControlsStore';
import { saveSnapshot } from '../../../helpers/saveSnapshot';
import { Maskott } from '../../../types/maskott';
import CharacterStore from './CharacterStore';
import StyleStore from './StyleStore';
import SoundSystem from '../../../sound/SoundSystem';

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

  public soundSystem!: SoundSystem;

  constructor(soundSystem: SoundSystem) {
    this.resourceManager = new ResourcesManager();
    makeAutoObservable(this, {}, { autoBind: true });
    this.controlsStore = new ControlsStore();
    this.charactersStore = new CharacterStore();
    this.styleStore = new StyleStore();
    this.soundSystem = soundSystem;
    this.subscribe();
  }

  public subscribe(): void {
    this.controlsStore.subscribe('soundChange', () => { console.log('sound change'); });
    this.controlsStore.subscribe('takeScreenShot', () => {
      const maskottPreview = this.threeScene?.mainScene?.getSnapshot();
      if (maskottPreview) this.loadSnapshot(maskottPreview, 'maskott');
    });
    this.controlsStore.subscribe('styleSelect', () => {
      this.styleStore.setShowStyleSelection(true);
    });
    this.controlsStore.subscribe('soundChange', (isMuted) => {
      this.soundSystem.mute(!isMuted);
    });
    this.controlsStore.subscribe('characterSelect', () => {
      this.charactersStore.setShowCharacterSelection(!this.charactersStore.showCharacterSelection);
    });

    this.charactersStore.subscribe('characterChange', (id) => {
      const characterCandidate = this.charactersStore.characters.find((character) => character.id === id);
      this.charactersStore.setCharacterIsChanging(true);
      this.charactersStore.setShowCharacterSelection(false);
      this.threeScene?.mainScene?.changeMaskott(characterCandidate!.name)
        ?.then(() => {
          this.charactersStore.setCharacterIsChanging(false);
          if (characterCandidate) this.soundSystem.playSound(characterCandidate.name.toLowerCase());
        });
    });
    this.charactersStore.subscribe('characterSelectionClosed', () => {
      this.controlsStore.setActiveAvatarPropertyType();
    });

    this.styleStore.subscribe('styleChange', (id) => {
      console.log('style change', id);
      this.soundSystem.playSound(id, true);
    });
    this.styleStore.subscribe('styleSelectionClosed', () => this.controlsStore.setActiveAvatarPropertyType());
  }

  public initialize(): void {
    this.threeScene = new SceneViewport();
    this.threeScene.init(this.onProgress.bind(this))
      .then(() => {
        this.setIsReady(true);
        if (this.threeScene?.mainScene) this.sceneSubscribe();
      });
  }

  public onProgress(progress: number): void {
    this.setProgress(progress);
  }

  public setIsReady(isLoading: boolean): void {
    this.isReady = isLoading;
  }

  public setUp(characters: Maskott[]): void {
    const character = this.charactersStore.setUp(characters);
    if (character && character.name) this.threeScene?.mainScene?.getDefaultMaskott(character.name);
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
    this.soundSystem.playSound('background');
  }

  public loadSnapshot(maskottPreview: string, maskottName: string): void {
    saveSnapshot(maskottPreview, maskottName);
  }

  public sceneSubscribe(): void {
    this.threeScene?.mainScene?.subscribe('maskottChange', (name) => {
      this.charactersStore.setCharacterIsChanging(false);
      this.charactersStore.setCharacter(name);
      this.soundSystem.playSound(name.toLowerCase(), true);
    });

    this.threeScene?.mainScene?.subscribe('loadMaskott', () => {
      this.charactersStore.setCharacterIsChanging(true);
    });
  }
}
