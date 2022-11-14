import { makeAutoObservable } from 'mobx';
import { SceneViewport } from '@app/modules/editor/scene/viewports/index';
import ResourcesManager from '../../../modules/editor/scene/ResourcesManager';
import ControlsStore from './ControlsStore';
import { saveSnapshot } from '../../../helpers/saveSnapshot';
import { AnimationsType, Avatar, EnvironmentConfigType, Style } from '../../../types';
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
      if (this.threeScene && this.threeScene.actions) {
        const characterPreview = this.threeScene.actions.getSnapshot();
        if (characterPreview) this.loadSnapshot(characterPreview, 'mascott');
      }
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
      if (this.threeScene && this.threeScene.actions && this.threeScene.actions.characterAction) {
        const characterCandidate = this.charactersStore.characters.find((character) => character.id === id);
        this.charactersStore.setCharacterIsChanging(true);
        this.charactersStore.setShowCharacterSelection(false);
        if (characterCandidate) {
          this.threeScene.actions.characterAction.changeData(characterCandidate?.id as string);
          this.charactersStore.setCharacterIsChanging(false);
          if (characterCandidate) this.soundSystem.playSound(characterCandidate.name.toLowerCase());
        }
      }
    });
    this.charactersStore.subscribe('characterSelectionClosed', () => {
      this.controlsStore.setActiveAvatarPropertyType();
    });
    this.styleStore.subscribe('styleChange', (id) => {
      if (this.threeScene && this.threeScene.actions && this.threeScene.actions.stylesAction) {
        const texture = this.findTexture(id);
        this.styleStore.isLoadingStyle = true;
        this.threeScene.actions.stylesAction.changeStyle(texture || '', id);
        this.soundSystem.playSound(id, true);
      }
    });

    this.styleStore.subscribe('styleSelectionClosed', () => this.controlsStore.setActiveAvatarPropertyType());
    let activeId: string | undefined;
    this.animationStore.subscribe('animation_select', (id) => {
      if (activeId !== id) {
        this.animationStore.setProgress(0);
      }
      if (this.threeScene && this.threeScene.actions && this.threeScene.actions.animationAction) {
        this.threeScene.actions.animationAction.playAnimation(id, true);
      }
      activeId = id;
    });

    this.animationStore.subscribe('pause', (paused) => {
      if (this.threeScene && this.threeScene.actions && this.threeScene.actions.animationAction) {
        if (paused) this.threeScene.actions.animationAction.pauseAnimation();
        else this.threeScene.actions.animationAction.continueAnimation();
      }
    });

    this.animationStore.subscribe('stop', () => {
      if (this.threeScene && this.threeScene.actions && this.threeScene.actions.animationAction) {
        this.threeScene.actions.animationAction.stopAnimation();
      }
    });

    this.animationStore.subscribe('selection_closed', () => {
      this.controlsStore.setActiveAvatarPropertyType();
    });
  }

  public initialize(
    characters: Avatar[],
    styles: Style[],
    environment: EnvironmentConfigType,
    animations: AnimationsType[],
  ): void {
    this.threeScene = new SceneViewport.SceneViewport();
    if (!this.threeScene) return;
    this.threeScene.init({ characters, styles, environment, animations }, this.onProgress.bind(this))
      .then(() => {
        this.setIsReady(true);
        if (this.threeScene && this.threeScene.actions?.characterAction) this.sceneSubscribe();
        if (!this.threeScene) return;
        this.sceneSubscribe();
        this.styleStore.setStyles(styles);
        this.animationStore.setAnimations(animations);
        const character = this.charactersStore.setUp(characters);
        if (character && character.name) {
          const style = this.findBaseStyle(character.name);
          const characterStyle = this.styleStore.styles.find((item) => item.id.includes(character.name.toLowerCase()));
          if (this.threeScene.actions?.characterAction && characterStyle) {
            this.threeScene.actions.characterAction.setDefaultData(
              characterStyle.id,
              style.targetTextureName,
              style.currentTextureName,
            );
            this.styleStore.styles.forEach((item) => {
              if (item.name !== 'Base') {
                if (this.threeScene && this.threeScene.textureEditor) this.threeScene.textureEditor.hideObjects(item.id, false);
              }
            });
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
    if (this.threeScene && this.threeScene.actions && this.threeScene.actions.animationAction) {
      this.threeScene.actions.animationAction.startAnimationAction();
    }
  }

  public loadSnapshot(characterPreview: string, characterName: string): void {
    saveSnapshot(characterPreview, characterName);
  }

  public sceneSubscribe(): void {
    if (this.threeScene && this.threeScene.actions) {
      this.threeScene.actions.subscribe('characterChange', (name) => {
        const avatarName = this.charactersStore.characters.find((character) => name.includes(character.id));
        if (!avatarName) return;
        this.styleStore.setActiveStyleFilter(avatarName.name);
        this.charactersStore.setCharacterIsChanging(false);
        this.charactersStore.setCharacter(avatarName.name);
        const { character } = this.charactersStore;
        if (character) this.aboutStore.setCharacterImage(character.renderImage);

        this.soundSystem.playSound(avatarName.name.toLowerCase(), true);
      });

      this.threeScene.actions.subscribe('loadNewCharacter', () => {
        this.charactersStore.setCharacterIsChanging(true);
      });

      this.threeScene.actions.subscribe('setAnimationTime', (time) => {
        if (!this.animationStore.isPaused) this.animationStore.setProgress(time);
      });

      this.threeScene.actions.subscribe('animationEnded', () => {
        this.styleStore.setLoadingStyle(false);
      });
    }
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

  public findTexture(styleId: string): string | undefined {
    if (styleId === 'mira_base') return 'secondTexture';
    if (styleId === 'mira_retro') return 'thirdTexture';
    if (styleId === 'yuki_base') return 'firstTexture';
    if (styleId === 'yuki_hacker') return 'fourthTexture';
  }
}
