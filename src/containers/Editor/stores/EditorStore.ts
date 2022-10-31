import { makeAutoObservable } from 'mobx';
import SceneViewport from '@app/module/features/Scene/viewports/SceneViewport';
import ResourcesManager from '../../../module/features/Scene/ResourcesManager';
import ControlsStore from './ControlsStore';
import { saveSnapshot } from '../../../helpers/saveSnapshot';
import { Maskott } from '../../../types/maskott';
import CharacterStore from './CharacterStore';
import StyleStore from './StyleStore';
import SoundSystem from '../../../sound/SoundSystem';
import AnimationStore from './AnimationStore';
import { MaskottEnum } from '../../../enum/MaskottEnum';

export default class EditorStore {
  public isReady = false;

  public progress = 0;

  public showLoadingScreen = false;

  public isLoadErrorModalOpen = false;

  public threeScene: SceneViewport | null = null;

  protected resourceManager: ResourcesManager | null;

  public controlsStore!: ControlsStore;

  public charactersStore!: CharacterStore;

  public styleStore!: StyleStore;

  public animationStore!: AnimationStore;

  public soundSystem!: SoundSystem;

  constructor(soundSystem: SoundSystem) {
    this.resourceManager = new ResourcesManager();
    makeAutoObservable(this, {}, { autoBind: true });
    this.controlsStore = new ControlsStore();
    this.charactersStore = new CharacterStore();
    this.styleStore = new StyleStore();
    this.animationStore = new AnimationStore();
    this.soundSystem = soundSystem;
    this.subscribe();
  }

  public subscribe(): void {
    this.controlsStore.subscribe('soundChange', () => { console.log('sound change'); });
    this.controlsStore.subscribe('takeScreenShot', () => {
      const maskottPreview = this.threeScene?.characterAction?.getSnapshot();
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
    this.controlsStore.subscribe('animationSelect', () => {
      this.animationStore.setShowAnimationSelection(true);
    });

    this.charactersStore.subscribe('characterChange', (id) => {
      const characterCandidate = this.charactersStore.characters.find((character) => character.id === id);
      this.charactersStore.setCharacterIsChanging(true);
      this.charactersStore.setShowCharacterSelection(false);
      this.threeScene?.characterAction?.changeMaskott(characterCandidate!.name as MaskottEnum)
        .then(() => {
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
    let timer: NodeJS.Timer;
    let activeId: string | undefined;
    this.animationStore.subscribe('animation_select', (id) => {
      if (activeId !== id) {
        this.animationStore.setProgress(0);
      }
      activeId = id;
      clearInterval(timer);
      timer = setInterval(() => {
        if (this.animationStore.progress === 100) {
          this.animationStore.setProgress(0);
          this.animationStore.setActiveAnimationId();
          clearInterval(timer);
          return;
        }
        this.animationStore.setProgress(this.animationStore.progress + 1);
      }, 1000);
    });

    this.animationStore.subscribe('pause', (paused) => {
      console.log('pause event. is paused: ', paused);
      clearInterval(timer);
      timer = setInterval(() => {
        if (this.animationStore.progress === 100) {
          this.animationStore.setProgress(0);
          clearInterval(timer);
          return;
        }
        this.animationStore.setProgress(this.animationStore.progress + 1);
      }, 1000);
    });

    this.animationStore.subscribe('stop', () => {
      console.log('animation stop');
    });

    this.animationStore.subscribe('selection_closed', () => {
      this.controlsStore.setActiveAvatarPropertyType();
    });
  }

  public initialize(): void {
    this.threeScene = new SceneViewport();
    this.threeScene.init(this.onProgress.bind(this))
      .then(() => {
        this.setIsReady(true);
        if (this.threeScene?.characterAction) this.sceneSubscribe();
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
    if (character && character.name) this.threeScene?.characterAction?.getDefaultCharacter(character.name);
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
    this.threeScene?.characterAction?.subscribe('characterChange', (name) => {
      this.charactersStore.setCharacterIsChanging(false);
      this.charactersStore.setCharacter(name);
      this.soundSystem.playSound(name.toLowerCase(), true);
    });

    this.threeScene?.characterAction?.subscribe('loadCharacter', () => {
      this.charactersStore.setCharacterIsChanging(true);
    });
  }
}
