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

export interface AnimationPlayOptions {
  animationName: string;
  isStartObject: boolean;
  repetitions: number;
  isFade: boolean;
  idle: boolean;
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

  public isIdle = true;

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
        if (style.animations) this._animationsStyles.push({ vrmAvatar: avatar, animations: style.animations });
      });
    });
    this.loadAnimation(animations);
  }

  public stopAnimation(): void {
    const { mouseControls, touchControls } = this._sceneViewport;
    if (this._actions && this._actions.characterAction) {
      mouseControls.setIsLockRotate(false);
      touchControls.setIsLockRotate(false);

      mouseControls.targetRotationX = 0;
      touchControls.targetRotationX = 0;
      this._actions.characterAction.isLoadCharacter = false;
    }
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

  public startAnimationAction(): void {
    if (this._actions && this._actions.characterAction) this._actions.characterAction.isLoadCharacter = true;
    const { mouseControls, touchControls } = this._sceneViewport;
    this.playAnimation('forgiveness', true, 1);
    this.playAnimation('forgiveness', false, 1);

    mouseControls.setIsLockRotate(true);
    touchControls.setIsLockRotate(true);

    this._actions?.eventEmitter.emit('loadTimeAnimation', true);
    if (this.mixer) {
      this.mixer.addEventListener('finished', (event) => {
        const clip = event.action.getClip();

        if (clip.name === 'forgiveness' && event.action.repetitions === 1 && this.isFirstForgiveness) {
          this.isFirstForgiveness = false;
          mouseControls.setIsLockRotate(false);
          touchControls.setIsLockRotate(false);
          if (this._actions && this._actions.characterAction) this._actions.characterAction.isLoadCharacter = false;
          this.playAnimation('activeStart', true);
          this._actions?.eventEmitter.emit('loadTimeAnimation', false);
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

  public playUiAnimation(animationName: string): void {
    const { mouseControls, touchControls } = this._sceneViewport;
    const previewAction = this.startCharacterAnimation;
    if (this._actions) {
      mouseControls.setIsLockRotate(true);
      touchControls.setIsLockRotate(true);
      this.isIdle = false;
      const { startObject } = this._actions;
      this.animationsData.forEach((data) => {
        if (startObject?.name === data.vrmAvatar.vrm.scene.name) {
          const action = data.vrmAvatar.getAnimationAction(AnimationCode.stringToAnimationCode(animationName));
          if (action && previewAction) {
            this.startCharacterAnimation = action;
            previewAction.timeScale = 1;
            action.timeScale = 1;
          }
          if (Math.abs(startObject.rotation.y) > 0.5) this._actions?.eventEmitter.emit('rotateCharacter');
          data.vrmAvatar.playAnimation(AnimationCode.stringToAnimationCode(animationName));
        }
      });
    }
  }

  public playAnimation(animationName: string, isStartObject = false, repetitions = Infinity, isFade = true, idle = true): void {
    if (this._actions) {
      const { startObject } = this._actions;
      if (this._actions.startObject && !idle) this._actions.startObject.rotation.y = 0;
      const { mouseControls, touchControls } = this._sceneViewport;
      this.isIdle = idle;

      if (!idle) {
        mouseControls.setIsLockRotate(true);
        touchControls.setIsLockRotate(true);
      }

      this.animationsData.forEach((data) => {
        if (isStartObject && startObject?.name === data.vrmAvatar.vrm.scene.name) {
          const action = data.vrmAvatar.getAnimationAction(AnimationCode.stringToAnimationCode(animationName));
          if (action) {
            if (this.startCharacterAnimation && isFade) {
              this.fadeToAction(this.startCharacterAnimation, data.vrmAvatar, animationName);
            }
            data.vrmAvatar.playAnimation(AnimationCode.stringToAnimationCode(animationName));
            this.startCharacterAnimation = action;
            action.enabled = true;
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

  public fadeToAction(previewAction: THREE.AnimationAction, vrmAvatar: VrmAvatar, fadeNameAnimation: string) {
    const currentAction = vrmAvatar?.getAnimationAction(AnimationCode.stringToAnimationCode(fadeNameAnimation));
    if (currentAction) {
      previewAction.enabled = true;
      previewAction.setEffectiveTimeScale(1);
      previewAction.setEffectiveWeight(1);
      previewAction.reset();
      currentAction.crossFadeTo(previewAction, 1000, true);
    }
  }

  public waitInActiveAnimation(): void {
    this._idleInterval = setTimeout(() => {
      if (this.isIdle) {
        this.playAnimation('inActive', true, Infinity, true, true);
      }
      this._isInActiveAnimation = true;
    }, this.inActiveTime);
  }

  public clearInActiveAnimation(): void {
    if (this._isInActiveAnimation) {
      this._isInActiveAnimation = false;
      this.playAnimation('activeStart', true, Infinity, false);
    }
    clearInterval(this._idleInterval);
    this.waitInActiveAnimation();
  }

  public countAnimationTime(action: THREE.AnimationAction): void {
    if (action && !this.isIdle) {
      if (this.startCharacterAnimation && this._actions && !this.isIdle) {
        const { duration } = action.getClip();
        const totalTime = (action.time / duration) * 100;
        this._actions.eventEmitter.emit('setAnimationTime', totalTime);
      }
    }
  }
}
