import { TextureEditor } from '../../scene/textureEditor/TextureEditor';
import { ActionOptions, Actions } from './Actions';
import { SceneViewport } from '../../scene/viewports/index';
import { Avatar, IdleAnimationType, Style } from '../../../../types/index';
import { getAnimationFile } from '../../utils/getAnimationFile';
import { AnimationCode, VrmAvatar } from '@avs/vrm-avatar';
import { ResourceType } from '../../scene/ResourcesManager';

export interface AnimationData {
  vrmAvatar: VrmAvatar;
  animations: IdleAnimationType[];
}

export class AnimationAction {
  public inActiveTime = 10000;

  private _idleInterval?: NodeJS.Timer = undefined;

  private _isInActiveAnimation: boolean = false;

  private _sceneViewport: SceneViewport.SceneViewport;

  private _textureEditor: TextureEditor;

  private _actions: Actions | null = null;

  private _animationsCharacter: AnimationData[] = [];

  private _animationsStyles: AnimationData[] = [];

  constructor(options: ActionOptions) {
    this._sceneViewport = options.sceneViewport;
    this._textureEditor = options.textureEditor;
    this._actions = options.actions || null;
  }

  public init(characters: Avatar[], styles: Style[]): void {
    characters.forEach((character) => {
      const findAvatars = this._textureEditor.vrmAvatars
        .filter((avatar) => avatar.vrm.scene.name.includes(character.name.toLowerCase()));
      findAvatars.forEach((avatar) => {
        if (character.animations) {
          this._animationsCharacter.push({ vrmAvatar: avatar, animations: character.animations });
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
    this.loadAnimation();
  }

  public loadAnimation(): void {
    if (this._textureEditor && this._sceneViewport) {
      this._animationsCharacter.forEach((data) => {
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
    this.playAnimation('forgiveness', true);
    this.playAnimation('forgiveness', false);

    this.removeLoopAnimation(() => {
      this.playAnimation('activeStart', true);
      this.playAnimation('activeBack', false);
    }, 1500);
  }

  public playAnimation(animationName: string, isStartObject = false): void {
    if (this._actions) {
      const { startObject } = this._actions;
      this._animationsCharacter.forEach((data) => {
        if (isStartObject && startObject) {
          if (startObject.name === data.vrmAvatar.vrm.scene.name) {
            data.vrmAvatar.playAnimation(AnimationCode.stringToAnimationCode(animationName));
          }
        } else if (startObject?.name !== data.vrmAvatar.vrm.scene.name) {
          data.vrmAvatar.playAnimation(AnimationCode.stringToAnimationCode(animationName));
        }
      });
    }
  }

  /**
   * todo: костыль для отключения бесконечного повторения анимации пака нет в бибилотеке
   */
  public removeLoopAnimation(callback: () => void, time: number): void {
    setTimeout(() => {
      callback();
    }, time);
  }

  public waitInActiveAnimation(): void {
    this._idleInterval = setTimeout(() => {
      this.playAnimation('inActive', true);
      this.playAnimation('inActive', false);
      this._isInActiveAnimation = true;
    }, this.inActiveTime);
  }

  public clearInActiveAnimation(): void {
    clearInterval(this._idleInterval);
    if (this._isInActiveAnimation) {
      this._isInActiveAnimation = false;
      this.playAnimation('activeStart', true);
      this.playAnimation('activeBack', false);
    }
    this.waitInActiveAnimation();
  }
}
