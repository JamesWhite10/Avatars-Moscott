import { makeAutoObservable } from 'mobx';
import { SceneViewport } from '@app/modules/editor/scene/viewports/index';
import ResourcesManager from '../../../modules/editor/scene/ResourcesManager';
import ControlsStore from './ControlsStore';
import { AnimationsType, Avatar, BackgroundPart, EnvironmentConfigType, Style } from '../../../types';
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
    this.panelsStore.subscribe('headSelect', () => {
      this.panelsStore.headPanelStore.setShowHeadSelection(true);
    });
    this.panelsStore.subscribe('bodySelect', () => {
      this.panelsStore.bodyPanelStore.setShowBodySelection(true);
    });
    this.panelsStore.subscribe('shoesSelect', () => {
      this.panelsStore.shoesPanelStore.setShowShoesSelection(true);
    });
    this.panelsStore.subscribe('backgroundSelect', () => {
      this.panelsStore.backgroundPanelStore.setShowBackgroundSelection(true);
    });
    this.panelsStore.subscribe('eyeSelect', () => {
      this.panelsStore.eyePanelStore.setShowEyeSelection(true);
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

    this.panelsStore.headPanelStore.subscribe('headChange', (head) => {
      if (this.threeScene && this.threeScene.vrmEditor) {
        const editor = this.threeScene.vrmEditor;
        const { character } = this.panelsStore.avatarPanelStore;
        this.panelsStore.headPanelStore.setActiveHead(head.id);
        if (character) {
          editor.loadPart(
            head.source || '',
            head.texturesMap.base,
            `${character.id}_base`,
            head.slots[0],
            head.id,
          );
        }
      }
    });

    this.panelsStore.bodyPanelStore.subscribe('bodyChange', (body) => {
      if (this.threeScene && this.threeScene.vrmEditor) {
        const editor = this.threeScene.vrmEditor;
        const { character } = this.panelsStore.avatarPanelStore;
        this.panelsStore.bodyPanelStore.setActiveBody(body.id);
        if (character) {
          editor.loadPart(
            body.source || '',
            body.texturesMap.base,
            `${character.id}_base`,
            body.slots[0],
            body.id,
          );
        }
      }
    });

    this.panelsStore.shoesPanelStore.subscribe('shoesChange', (shoe) => {
      if (this.threeScene && this.threeScene.vrmEditor) {
        const editor = this.threeScene.vrmEditor;
        const { character } = this.panelsStore.avatarPanelStore;
        this.panelsStore.shoesPanelStore.setActiveShoes(shoe.id);
        if (character) {
          editor.loadPart(
            shoe.source || '',
            shoe.texturesMap.base,
            `${character.id}_base`,
            shoe.slots[0],
            shoe.id,
          );
        }
      }
    });

    this.panelsStore.backgroundPanelStore.subscribe('backgroundChange', (background) => {
      if (this.threeScene && this.threeScene.vrmEditor) {
        const { character } = this.panelsStore.avatarPanelStore;
        this.panelsStore.backgroundPanelStore.setActiveBackground(background.id);
        if (character) {
          this.threeScene.actions?.stylesAction?.changeStyleTexture(background.id);
        }
      }
    });

    this.panelsStore.eyePanelStore.subscribe('eyeChange', (eye) => {
      if (this.threeScene && this.threeScene.vrmEditor) {
        const editor = this.threeScene.vrmEditor;
        const { character } = this.panelsStore.avatarPanelStore;
        this.panelsStore.eyePanelStore.setActiveEye(eye);
        if (character) {
          editor.changeTexture(
            `${character.id}_eyes_base`,
            `${character.id}_base`,
            eye,
          );
        }
      }
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
    this.panelsStore.headPanelStore.subscribe('headSelectionClosed', () => this.panelsStore.setActivePanelType());
    this.panelsStore.bodyPanelStore.subscribe('bodySelectionClosed', () => this.panelsStore.setActivePanelType());
    this.panelsStore.shoesPanelStore.subscribe('shoesSelectionClosed', () => this.panelsStore.setActivePanelType());
    this.panelsStore.backgroundPanelStore.subscribe('backgroundSelectionClosed', () => this.panelsStore.setActivePanelType());
    this.panelsStore.eyePanelStore.subscribe('eyeSelectionClosed', () => this.panelsStore.setActivePanelType());
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
    backgrounds: BackgroundPart[],
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
        this.panelsStore.backgroundPanelStore.setBackgrounds(backgrounds);
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
        const styleName = this.panelsStore.stylePanelStore.styles.find((style) => name.includes(style.id));
        if (!avatarName) return;
        this.panelsStore.stylePanelStore.setActiveStyle(styleName?.id);
        this.panelsStore.stylePanelStore.setActiveStyleFilter(avatarName.name);
        this.panelsStore.headPanelStore.setActiveHeadFilter(avatarName.name);
        this.panelsStore.bodyPanelStore.setActiveBodyFilter(avatarName.name);
        this.panelsStore.shoesPanelStore.setActiveShoesFilter(avatarName.name);
        this.panelsStore.backgroundPanelStore.setActiveBackgroundFilter(avatarName.name);
        this.panelsStore.eyePanelStore.setActiveEyeFilter(avatarName.name);
        this.panelsStore.avatarPanelStore.setCharacterIsChanging(false);
        this.panelsStore.animationsPanelStore.setAnimationLoading(false);
        this.panelsStore.stylePanelStore.setLoadingStyle(false);
        this.panelsStore.headPanelStore.setLoadingHead(false);
        this.panelsStore.bodyPanelStore.setLoadingBody(false);
        this.panelsStore.shoesPanelStore.setLoadingShoes(false);
        this.panelsStore.backgroundPanelStore.setLoadingBackground(false);
        this.panelsStore.eyePanelStore.setLoadingEye(false);
        this.panelsStore.avatarPanelStore.setCharacter(avatarName.name);
        const { character } = this.panelsStore.avatarPanelStore;
        if (character) this.aboutStore.setCharacterImage(character.renderImage);

        this.soundSystem.playSound(avatarName.name.toLowerCase(), true);
      });

      this.threeScene.actions.subscribe('animationEnded', () => {
        this.panelsStore.animationsPanelStore.setAnimationLoading(false);
        this.panelsStore.stylePanelStore.setLoadingStyle(false);
        this.panelsStore.headPanelStore.setLoadingHead(false);
        this.panelsStore.bodyPanelStore.setLoadingBody(false);
        this.panelsStore.shoesPanelStore.setLoadingShoes(false);
        this.panelsStore.backgroundPanelStore.setLoadingBackground(false);
        this.panelsStore.eyePanelStore.setLoadingEye(false);
        this.panelsStore.avatarPanelStore.setCharacterIsChanging(false);
      });

      this.threeScene.actions.subscribe('loadNewCharacter', () => {
        this.panelsStore.animationsPanelStore.setAnimationLoading(true);
        this.panelsStore.stylePanelStore.setLoadingStyle(true);
        this.panelsStore.headPanelStore.setLoadingHead(true);
        this.panelsStore.bodyPanelStore.setLoadingBody(true);
        this.panelsStore.shoesPanelStore.setLoadingShoes(true);
        this.panelsStore.backgroundPanelStore.setLoadingBackground(true);
        this.panelsStore.eyePanelStore.setLoadingEye(true);
        this.panelsStore.avatarPanelStore.setCharacterIsChanging(true);
      });

      this.threeScene.actions.subscribe('loadNewStyle', () => {
        this.panelsStore.animationsPanelStore.setAnimationLoading(true);
        this.panelsStore.stylePanelStore.setLoadingStyle(true);
        this.panelsStore.headPanelStore.setLoadingHead(true);
        this.panelsStore.bodyPanelStore.setLoadingBody(true);
        this.panelsStore.shoesPanelStore.setLoadingShoes(true);
        this.panelsStore.backgroundPanelStore.setLoadingBackground(true);
        this.panelsStore.eyePanelStore.setLoadingEye(true);
        this.panelsStore.avatarPanelStore.setCharacterIsChanging(true);
      });

      this.threeScene.actions.subscribe('setAnimationTime', (time) => {
        if (!this.panelsStore.animationsPanelStore.isPaused) this.panelsStore.animationsPanelStore.setProgress(time);
      });

      this.threeScene.actions.subscribe('animationEnded', () => {
        this.panelsStore.stylePanelStore.setLoadingStyle(false);
        this.panelsStore.headPanelStore.setLoadingHead(false);
        this.panelsStore.bodyPanelStore.setLoadingBody(false);
        this.panelsStore.shoesPanelStore.setLoadingShoes(false);
        this.panelsStore.backgroundPanelStore.setLoadingBackground(false);
        this.panelsStore.eyePanelStore.setLoadingEye(false);
      });

      this.threeScene.actions.subscribe('onLoadBackground', (value) => {
        this.panelsStore.backgroundPanelStore.setLoadingBackground(value);
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
