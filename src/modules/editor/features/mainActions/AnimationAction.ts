import * as THREE from 'three';
import { TextureEditor } from '../../scene/textureEditor/TextureEditor';
import { ActionOptions, Actions } from './Actions';
import { SceneViewport } from '../../scene/viewports/index';
import { AnimationsType, Avatar, IdleAnimationType, Style } from '@app/types/index';
import { getAnimationFile } from '../../utils/getAnimationFile';
import { AnimationCode, VrmAvatar } from '@avs/vrm-avatar';
import { ResourceType } from '../../scene/ResourcesManager';

export interface AnimationData {
  vrmAvatar: VrmAvatar;
  animations: IdleAnimationType[];
}

export class AnimationAction {
  public inActiveTime = 20000;

  private _idleInterval?: NodeJS.Timer = undefined;

  private _isInActiveAnimation: boolean = false;

  public mixer: THREE.AnimationMixer | null = null;

  public startCharacterAnimation: THREE.AnimationAction | null = null;

  private _sceneViewport: SceneViewport.SceneViewport;

  private _textureEditor: TextureEditor;

  private _actions: Actions | null = null;

  public animationsData: AnimationData[] = [];

  private _animationsStyles: AnimationData[] = [];

  public isFirstForgiveness: boolean = true;

  constructor(options: ActionOptions) {
    this._sceneViewport = options.sceneViewport;
    this._textureEditor = options.textureEditor;
    this._actions = options.actions || null;
  }

  public init(characters: Avatar[], styles: Style[], animations: AnimationsType[]): void {
    characters.forEach((character) => {
      const findAvatars = this._textureEditor.vrmAvatars
        .filter((avatar) => avatar.vrm.scene.name.includes(character.name.toLowerCase()));
      findAvatars.forEach((avatar) => {
        if (character.animations) {
          this.animationsData.push({ vrmAvatar: avatar, animations: character.animations });
        }
      });
    });

    styles.forEach((style) => {
      const findAvatars = this._textureEditor.vrmAvatars
        .filter((avatar) => avatar.vrm.scene.name === style.id);
      findAvatars.forEach((avatar) => {
        if (style.animations) {
          this._animationsStyles.push({ vrmAvatar: avatar, animations: style.animations });
        }
      });
    });
    this.loadAnimation(animations);
  }

  public loadAnimation(animations: AnimationsType[]): void {
    if (this._textureEditor && this._sceneViewport) {
      this.animationsData.forEach((data) => {
        animations.forEach((item) => {
          const gltf = this._sceneViewport.resourcesManager.getFbxByUrlOrFail(item.animation);

          if (data.vrmAvatar) {
            data.vrmAvatar.addMixamoAnimation(gltf, AnimationCode.stringToAnimationCode(item.id));
          }
        });
      });

      this.animationsData.forEach((data) => {
        data.animations.forEach((animation) => {
          const file = getAnimationFile(animation.id, ResourceType.FBX.toLowerCase());
          const gltf = this._sceneViewport.resourcesManager.getFbxByUrlOrFail(file);

          if (data.vrmAvatar) {
            data.vrmAvatar.addMixamoAnimation(gltf, AnimationCode.stringToAnimationCode(animation.name));
          }
        });
      });

      this._animationsStyles.forEach((data) => {
        data.animations.forEach((animation) => {
          const file = getAnimationFile(animation.id, ResourceType.FBX.toLowerCase());
          const gltf = this._sceneViewport.resourcesManager.getFbxByUrlOrFail(file);
          if (data.vrmAvatar) {
            data.vrmAvatar.addMixamoAnimation(gltf, AnimationCode.stringToAnimationCode(animation.name));
          }
        });
      });
    }
  }

  public stopAnimation(): void {
    if (this.startCharacterAnimation) this.playAnimation('activeStart', true);
  }

  public startAnimationAction(): void {
    if (this._actions && this._actions.characterAction) this._actions.characterAction.isLoadCharacter = true;
    this.playAnimation('forgiveness', true, 1);
    this.playAnimation('forgiveness', false, 1);

    if (this.mixer) {
      this.mixer.addEventListener('finished', (event) => {
        const clip = event.action.getClip();

        if (clip.name === 'forgiveness' && event.action.repetitions === 1 && this.isFirstForgiveness) {
          this.isFirstForgiveness = false;
          if (this._actions && this._actions.characterAction) this._actions.characterAction.isLoadCharacter = false;
          this.playAnimation('activeStart', true);
          this.playAnimation('activeBack', false);
        }
      });
    }
  }

  public pauseAnimation(): void {
    this._textureEditor.vrmAvatars.forEach((item) => {
      if (this._actions && item.vrm.scene.name === this._actions.startObject?.name) {
        if (this.startCharacterAnimation) {
          this.startCharacterAnimation.timeScale = 0.00001;
        }
      }
    });
  }

  public continueAnimation(): void {
    this._textureEditor.vrmAvatars.forEach((item) => {
      if (item.vrm.scene.name === this._actions?.startObject?.name) {
        if (this.startCharacterAnimation) this.startCharacterAnimation.timeScale = 1;
      }
    });
  }

  public playAnimation(animationName: string, isStartObject = false, repetitions = Infinity): void {
    if (this._actions) {
      const { startObject } = this._actions;
      this.animationsData.forEach((data) => {
        if (isStartObject && startObject?.name === data.vrmAvatar.vrm.scene.name) {
          const action = data.vrmAvatar.getAnimationAction(AnimationCode.stringToAnimationCode(animationName));
          if (action) {
            if (this.startCharacterAnimation) this.fadeToAction(this.startCharacterAnimation, data.vrmAvatar, animationName);
            this.startCharacterAnimation = action;
            data.vrmAvatar.playAnimation(AnimationCode.stringToAnimationCode(animationName));

            action.repetitions = repetitions;
            this.mixer = action.getMixer();
            this.mixer.dispatchEvent({ type: 'finished', action: this.startCharacterAnimation });
          }
        } else if (startObject?.name !== data.vrmAvatar.vrm.scene.name && !isStartObject) {
          data.vrmAvatar.playAnimation(AnimationCode.stringToAnimationCode(animationName));
        }
      });
    }
  }

  public fadeToAction(previewAction: THREE.AnimationAction, vrmAvatar: VrmAvatar, fadeNameAnimation: string): void {
    const currentAction = vrmAvatar?.getAnimationAction(AnimationCode.stringToAnimationCode(fadeNameAnimation));
    if (currentAction) {
      previewAction.fadeOut(1000);
      previewAction.reset();
      currentAction.fadeIn(1000);
    }
  }

  public waitInActiveAnimation(): void {
    this._idleInterval = setTimeout(() => {
      this.playAnimation('inActive', true);
      this.playAnimation('inActive', true);
      this._isInActiveAnimation = true;
    }, this.inActiveTime);
  }

  public clearInActiveAnimation(): void {
    if (this._isInActiveAnimation) {
      this._isInActiveAnimation = false;
      this.playAnimation('activeStart', true);
      this.playAnimation('activeBack', false);
    }
    clearInterval(this._idleInterval);
    this.waitInActiveAnimation();
  }

  public countAnimationTime(action: THREE.AnimationAction): void {
    if (action) {
      if (this.startCharacterAnimation && this._actions) {
        const { duration } = action.getClip();
        const totalTime = (action.time / duration) * 100;
        this._actions.eventEmitter.emit('setAnimationTime', totalTime);
      }
    }
  }
}
