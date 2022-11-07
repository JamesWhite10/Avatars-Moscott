import { makeAutoObservable } from 'mobx';
import { SceneViewport } from '@app/modules/editor/scene/viewports/index';
import ResourcesManager from '../../../modules/editor/scene/ResourcesManager';
import ControlsStore from './ControlsStore';
import { saveSnapshot } from '../../../helpers/saveSnapshot';
import { Avatar, EnvironmentConfigType, Style } from '../../../types';
import CharacterStore from './CharacterStore';
import StyleStore from './StyleStore';
import SoundSystem from '../../../sound/SoundSystem';
import AnimationStore from './AnimationStore';
import AboutStore from './AboutStore';

export default class EditorStore {
  public isReady = false;

  public progress = 0;

  public showLoadingScreen = false;

  public isLoadErrorModalOpen = false;

  public threeScene: SceneViewport.SceneViewport | null = null;

  protected resourceManager: ResourcesManager | null;

  public controlsStore!: ControlsStore;

  public charactersStore!: CharacterStore;

  public aboutStore!: AboutStore;

  public styleStore!: StyleStore;

  public animationStore!: AnimationStore;

  public soundSystem!: SoundSystem;

  constructor(soundSystem: SoundSystem) {
    this.resourceManager = new ResourcesManager();
    makeAutoObservable(this, {}, { autoBind: true });
    this.controlsStore = new ControlsStore();
    this.aboutStore = new AboutStore();
    this.charactersStore = new CharacterStore();
    this.styleStore = new StyleStore();
    this.animationStore = new AnimationStore();
    this.soundSystem = soundSystem;
    this.subscribe();
  }

  public subscribe(): void {
    this.controlsStore.subscribe('soundChange', () => { console.log('sound change'); });
    this.controlsStore.subscribe('takeScreenShot', () => {
      const characterPreview = this.threeScene?.characterAction?.getSnapshot();
      if (characterPreview) this.loadSnapshot(characterPreview, 'mascott');
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
    this.controlsStore.subscribe('aboutModalOpen', (enable) => {
      if (!this.charactersStore.character) return;
      this.aboutStore.aboutModalIsOpen = enable;
    });

    this.charactersStore.subscribe('characterChange', (id) => {
      if (this.threeScene && this.threeScene.characterAction) {
        const characterCandidate = this.charactersStore.characters.find((character) => character.id === id);
        this.charactersStore.setCharacterIsChanging(true);
        this.charactersStore.setShowCharacterSelection(false);
        if (characterCandidate) {
          this.threeScene.characterAction.changeData(characterCandidate.name as string);
          this.charactersStore.setCharacterIsChanging(false);
          if (characterCandidate) this.soundSystem.playSound(characterCandidate.name.toLowerCase());
        }
      }
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

  public initialize(characters: Avatar[], styles: Style[], environment: EnvironmentConfigType): void {
    this.threeScene = new SceneViewport.SceneViewport();
    if (!this.threeScene) return;
    this.threeScene.init({ characters, styles, environment }, this.onProgress.bind(this))
      .then(() => {
        this.setIsReady(true);
        if (this.threeScene && this.threeScene.characterAction) this.sceneSubscribe();
        if (!this.threeScene) return;
        this.sceneSubscribe();
        const character = this.charactersStore.setUp(characters);
        if (character && character.name) {
          const style = this.findBaseStyle(character.name);
          if (this.threeScene.characterAction) {
            this.threeScene.characterAction.setDefaultData(
              character.name,
              style.targetTextureName,
              style.currentTextureName,
            );
          }
        }
      });
  }

  public onProgress(progress: number): void {
    this.setProgress(progress);
  }

  public setIsReady(isLoading: boolean): void {
    this.isReady = isLoading;
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

  public loadSnapshot(characterPreview: string, characterName: string): void {
    saveSnapshot(characterPreview, characterName);
  }

  public sceneSubscribe(): void {
    this.threeScene?.characterAction?.subscribe('characterChange', (name) => {
      this.styleStore.setActiveStyleFilter(name);
      this.charactersStore.setCharacterIsChanging(false);
      this.charactersStore.setCharacter(name);
      const { character } = this.charactersStore;
      if (character) this.aboutStore.setCharacterImage(character.renderImage);
      this.soundSystem.playSound(name.toLowerCase(), true);
    });

    this.threeScene?.characterAction?.subscribe('loadCharacter', () => {
      this.charactersStore.setCharacterIsChanging(true);
    });
  }

  public findBaseStyle(characterName: string): Record<string, string> {
    if (characterName === 'Mira') {
      return {
        targetTextureName: 'secondTexture',
        currentTextureName: 'firstTexture',
      };
    }
    return {
      targetTextureName: 'firstTexture',
      currentTextureName: 'secondTexture',
    };
  }
}
