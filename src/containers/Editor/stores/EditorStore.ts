import { makeAutoObservable } from 'mobx';
import { SceneViewport } from '@app/modules/editor/scene/viewports/index';
import ResourcesManager from '../../../modules/editor/scene/ResourcesManager';
import ControlsStore from './ControlsStore';
import { AnimationsType, Avatar, EnvironmentConfigType, Style } from '../../../types';
import SoundSystem from '../../../sound/SoundSystem';
import AboutStore from './AboutStore';
import PanelsStore from './PanelsStore';

export default class EditorStore {
  public isReady = false;

  public progress = 0;

  public showLoadingScreen = false;

  public isLoadErrorModalOpen = false;

  public threeScene: SceneViewport.SceneViewport | null = null;

  protected resourceManager: ResourcesManager | null;

  public controlsStore!: ControlsStore;

  public aboutStore!: AboutStore;

  public soundSystem!: SoundSystem;

  public panelsStore!: PanelsStore;

  constructor(soundSystem: SoundSystem) {
    this.resourceManager = new ResourcesManager();
    makeAutoObservable(this, {}, { autoBind: true });
    this.controlsStore = new ControlsStore();
    this.aboutStore = new AboutStore();
    this.soundSystem = soundSystem;
    this.panelsStore = new PanelsStore(this.threeScene);
    this.subscribe();
  }

  public subscribe(): void {
    this.controlsStore.subscribe('soundChange', () => { console.log('sound change'); });
    this.controlsStore.subscribe('takeScreenShot', () => {
      if (this.threeScene && this.threeScene.actions) this.threeScene.actions.takeScreenshot();
    });
    this.panelsStore.subscribe('styleSelect', () => {
      this.panelsStore.stylePanelStore.setShowStyleSelection(true);
    });
    this.controlsStore.subscribe('soundChange', (isMuted) => {
      this.soundSystem.mute(!isMuted);
    });
    this.panelsStore.subscribe('characterSelect', () => {
      const isShow = this.panelsStore.avatarPanelStore.showCharacterSelection;
      this.panelsStore.avatarPanelStore.setShowCharacterSelection(!isShow);
    });
    this.panelsStore.subscribe('animationSelect', () => {
      this.panelsStore.animationsPanelStore.setShowAnimationSelection(true);
    });
    this.controlsStore.subscribe('aboutModalOpen', (enable) => {
      if (!this.panelsStore.avatarPanelStore.character) return;
      this.aboutStore.aboutModalIsOpen = enable;
    });

    this.panelsStore.avatarPanelStore.subscribe('characterChange', (id) => {
      if (this.threeScene && this.threeScene.actions && this.threeScene.actions.characterAction) {
        const characterCandidate = this.panelsStore.avatarPanelStore.characters.find((character) => character.id === id);
        this.panelsStore.avatarPanelStore.setShowCharacterSelection(false);
        if (characterCandidate) {
          this.threeScene.actions.characterAction.changeData(characterCandidate?.id as string);
          if (characterCandidate) this.soundSystem.playSound(characterCandidate.name.toLowerCase());
        }
      }
    });
    this.panelsStore.avatarPanelStore.subscribe('characterSelectionClosed', () => {
      this.panelsStore.setActivePanelType();
    });
    this.panelsStore.stylePanelStore.subscribe('styleChange', (id) => {
      if (this.threeScene && this.threeScene.actions && this.threeScene.actions.stylesAction) {
        const texture = this.findTexture(id);
        this.panelsStore.stylePanelStore.isLoadingStyle = true;
        this.threeScene.actions.stylesAction.changeStyle(texture || '', id);
        this.soundSystem.playSound(id, true);
      }
    });

    this.panelsStore.stylePanelStore.subscribe('styleSelectionClosed', () => this.panelsStore.setActivePanelType());
    let activeId: string | undefined;
    this.panelsStore.animationsPanelStore.subscribe('animation_select', (id) => {
      if (activeId !== id) {
        this.panelsStore.animationsPanelStore.setProgress(0);
        if (this.threeScene && this.threeScene.actions && this.threeScene.actions.animationAction) {
          this.threeScene.actions.animationAction.playUiAnimation(id);
        }
      }
      activeId = id;
    });

    this.panelsStore.animationsPanelStore.subscribe('pause', (paused) => {
      if (this.threeScene && this.threeScene.actions && this.threeScene.actions.animationAction) {
        if (paused) this.threeScene.actions.animationAction.pauseAnimation();
        else this.threeScene.actions.animationAction.continueAnimation();
      }
    });

    this.panelsStore.animationsPanelStore.subscribe('stop', () => {
      if (this.threeScene && this.threeScene.actions && this.threeScene.actions.animationAction) {
        this.panelsStore.animationsPanelStore.setProgress(0);
        if (activeId) {
          if (!this.threeScene.actions.animationAction.isIdle) {
            this.threeScene.actions.animationAction.stopAnimation();
            this.threeScene.actions.animationAction.playAnimation('activeStart', true, Infinity, false);
          }
        }
        activeId = undefined;
      }
    });

    this.panelsStore.animationsPanelStore.subscribe('selection_closed', () => {
      this.panelsStore.setActivePanelType();
      if (activeId) {
        if (this.threeScene && this.threeScene.actions && this.threeScene.actions.animationAction) {
          this.threeScene.actions.animationAction.stopAnimation();
          this.threeScene.actions.animationAction.playAnimation('activeStart', true, Infinity, false);
        }
        this.panelsStore.animationsPanelStore.setProgress(0);
        this.panelsStore.animationsPanelStore.setActiveAnimationId();
        activeId = undefined;
      }
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
        this.setProgress(100);
        if (this.threeScene && this.threeScene.actions?.characterAction) this.sceneSubscribe();
        if (!this.threeScene) return;
        this.sceneSubscribe();
        this.panelsStore.stylePanelStore.setStyles(styles);
        this.panelsStore.animationsPanelStore.setAnimations(animations);
        const character = this.panelsStore.avatarPanelStore.setUp(characters);
        if (character && character.name) {
          const style = this.findBaseStyle(character.name);
          const characterStyle = this.panelsStore.stylePanelStore.styles.find(
            (item) => (item.id.includes(character.name.toLowerCase())),
          );
          if (this.threeScene.actions?.characterAction && characterStyle) {
            this.panelsStore.stylePanelStore.setActiveStyle(characterStyle.id);
            this.threeScene.actions.characterAction.setDefaultData(
              characterStyle.id,
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
    if (progress >= 100) {
      this.progress = 100;
    }
    this.progress = progress;
  }

  public setIsLoadErrorModalOpen(isOpen: boolean): void {
    this.isLoadErrorModalOpen = isOpen;
  }

  public setShowLoadingScreen(show: boolean): void {
    this.showLoadingScreen = show;
    this.soundSystem.playSound('background');
    if (this.threeScene && this.threeScene.actions && this.threeScene.actions.animationAction) {
      this.threeScene.actions.cameraUpdate();
      this.threeScene.actions.animationAction.startAnimationAction();
    }
  }

  public sceneSubscribe(): void {
    if (this.threeScene && this.threeScene.actions) {
      this.threeScene.actions.subscribe('characterChange', (name) => {
        const avatarName = this.panelsStore.avatarPanelStore.characters.find((character) => name.includes(character.id));
        if (!avatarName) return;
        this.panelsStore.stylePanelStore.setActiveStyleFilter(avatarName.name);
        this.panelsStore.avatarPanelStore.setCharacterIsChanging(false);
        this.panelsStore.animationsPanelStore.setAnimationLoading(false);
        this.panelsStore.stylePanelStore.setLoadingStyle(false);
        this.panelsStore.avatarPanelStore.setCharacter(avatarName.name);
        const { character } = this.panelsStore.avatarPanelStore;
        if (character) this.aboutStore.setCharacterImage(character.renderImage);

        this.soundSystem.playSound(avatarName.name.toLowerCase(), true);
      });

      this.threeScene.actions.subscribe('animationEnded', () => {
        this.panelsStore.animationsPanelStore.setAnimationLoading(false);
        this.panelsStore.stylePanelStore.setLoadingStyle(false);
        this.panelsStore.avatarPanelStore.setCharacterIsChanging(false);
      });

      this.threeScene.actions.subscribe('loadNewCharacter', () => {
        this.panelsStore.animationsPanelStore.setAnimationLoading(true);
        this.panelsStore.stylePanelStore.setLoadingStyle(true);
        this.panelsStore.avatarPanelStore.setCharacterIsChanging(true);
      });

      this.threeScene.actions.subscribe('loadNewStyle', () => {
        this.panelsStore.animationsPanelStore.setAnimationLoading(true);
        this.panelsStore.stylePanelStore.setLoadingStyle(true);
        this.panelsStore.avatarPanelStore.setCharacterIsChanging(true);
      });

      this.threeScene.actions.subscribe('setAnimationTime', (time) => {
        if (!this.panelsStore.animationsPanelStore.isPaused) this.panelsStore.animationsPanelStore.setProgress(time);
      });

      this.threeScene.actions.subscribe('animationEnded', () => {
        this.panelsStore.stylePanelStore.setLoadingStyle(false);
        this.panelsStore.stylePanelStore.setLoadingStyle(false);
      });

      this.threeScene.actions.subscribe('loadTimeAnimation', (isLoading: boolean) => {
        this.panelsStore.animationsPanelStore.setAnimationLoading(isLoading);
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
