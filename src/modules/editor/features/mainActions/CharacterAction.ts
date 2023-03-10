import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { Style } from '../../../../types/index';
import { textures } from '../../constans/Textures';
import { Actions, ActionOptions, CharacterOptions } from './Actions';
import { TextureEditor, VrmEditor } from '../../scene/textureEditor/index';
import { SceneViewport } from '../../scene/viewports/index';
import { VrmAvatar } from '@avs/vrm-avatar';
import * as ThreeVrm from '@pixiv/three-vrm';

export class CharacterAction {
  public readonly _sceneViewport: SceneViewport.SceneViewport;

  private readonly _textureEditor: TextureEditor.TextureEditor;

  private readonly _vrmEditor: VrmEditor.VrmEditor;

  private _actions: Actions | null = null;

  public characters: CharacterOptions[] = [];

  public isLoadCharacter: boolean = false;

  private blinkMixer: THREE.AnimationMixer[] = [];

  constructor(options: ActionOptions) {
    this._sceneViewport = options.sceneViewport;
    this._textureEditor = options.textureEditor;
    this._vrmEditor = options.vrmEditor;
    this._actions = options.actions || null;
    this.blinkEyes();
  }

  public charactersInit(styles: Style[]): void {
    styles.forEach((style) => {
      const modelObject = this._vrmEditor.charactersGroup.getObjectByName(style.id);
      if (modelObject) {
        this.characters.push({
          characterObject: modelObject,
          name: modelObject.name,
        });
      }
    });
  }

  public setDefaultData(characterName: string, targetTextureName: string, currentTextureName: string): void {
    this._textureEditor.blendingShader.currentTextureName = currentTextureName;
    this._textureEditor.blendingShader.additionalTextureName = targetTextureName;
    this.changeData(characterName);
  }

  public changeData(characterName: string): void {
    const modelObject = this._vrmEditor.charactersGroup.children
      .find((node) => node.name.includes(characterName) && node.visible);
    if (modelObject) {
      const { threeScene } = this._sceneViewport;
      if (threeScene && this._actions) {
        const startObjectName = !this._actions.startObject ? '' : this._actions.startObject.name;
        if (modelObject && startObjectName !== characterName) {
          this._actions.eventEmitter.emit('loadNewCharacter', characterName, modelObject);
        }
      }
    }
  }

  public moveBodyParts(delta: number): void {
    if (this._actions && this._actions.animationAction) {
      this._vrmEditor.charactersData.forEach((avatar) => {
        avatar.vrmAvatar.vrm.humanoid.autoUpdateHumanBones = false;
        avatar.vrmAvatar.update(delta);
        this.moveHead(avatar.vrmAvatar);
        this.moveEyes(avatar.vrmAvatar);
      });
    }
    this.blinkMixer.forEach((item) => {
      item.update(delta);
    });
  }

  public moveHead(avatar: VrmAvatar): void {
    if (this._actions && avatar.vrm.scene.name === this._actions.startObject?.name) {
      const head = avatar.getBone('head');
      if (head && this._actions.characterAction && this._actions.animationAction?.isIdle) {
        head.rotateY((this._sceneViewport.mouseControls.mousePosition.x * 0.2));
        head.rotateX((this._sceneViewport.mouseControls.mousePosition.y * 0.2));
      }
    }
  }

  public blinkEyes(): void {
    this._vrmEditor.charactersData.forEach((item, index) => {
      const durationClip = 4 + Math.random() * (10 - 4);
      this.blinkMixer.push(new THREE.AnimationMixer(item.vrmAvatar.vrm.scene));

      const firstTimeBlink = index / 10;

      const blinkTrack = new THREE.NumberKeyframeTrack(
        item.vrmAvatar.vrm.expressionManager?.getExpressionTrackName(ThreeVrm.VRMExpressionPresetName.Blink) || 'VRMExpression_blink.weight',
        [firstTimeBlink, 0.5, 1.0],
        [0.0, 1.0, 0.0],
      );

      const clip = new THREE.AnimationClip('blink', durationClip, [blinkTrack]);
      const mixer = this.blinkMixer[index];
      const action = mixer.clipAction(clip);

      action.play();
    });
  }

  public moveEyes(avatar: VrmAvatar): void {
    if (avatar.vrm.lookAt) {
      const eyes: THREE.Object3D<THREE.Event>[] = [];
      const leftEye = avatar.getBone('leftEye');
      const rightEye = avatar.getBone('rightEye');
      if (leftEye && rightEye) {
        eyes.push(leftEye);
        eyes.push(rightEye);
        if (this._actions && avatar.vrm.scene.name === this._actions.startObject?.name) {
          eyes.forEach((eye) => {
            eye.rotation.set(
              this._sceneViewport.mouseControls.mousePosition.y * 0.15,
              this._sceneViewport.mouseControls.mousePosition.x * 0.25,
              0,
            );
          });
        }
      }
    }
  }

  public changeCharacter(modelObject: THREE.Object3D, durationDissolve = 2500): void {
    const { mouseControls, touchControls } = this._sceneViewport;
    if (!this._actions) return;
    if (this._textureEditor) {
      const dissolveTo = { dissolve: 1.0 };
      const dissolveFrom = { dissolve: 0.0 };

      const dissolveTween = new TWEEN.Tween(dissolveFrom)
        .to(dissolveTo, durationDissolve)
        .onUpdate(({ dissolve }) => {
          this._vrmEditor.vrmMaterials.forEach((material) => {
            if (material.userData.shader) {
              material.userData.shader.uniforms.uTime = { value: dissolve };
            }
          });
        });

      const moveTween = new TWEEN.Tween(modelObject.position)
        .to(this._actions.startPosition, 0)
        .onUpdate(({ x, z }) => {
          if (this._actions && this._actions.startObject) {
            this._actions.startObject.rotation.y = 0;
            this._actions.startObject.position.set(2.8, 0.04, -1.5);
          }

          if (this._actions) {
            this._actions.startObject = modelObject;
            modelObject.position.set(x, this._actions.startPosition.y, z);

            mouseControls.setIsLockRotate(false);
            touchControls.setIsLockRotate(false);

            this._actions.eventEmitter.emit('characterChange', modelObject.name);
          }
        });

      const appearanceFrom = { appearance: 1.0 };
      const appearanceTo = { appearance: 0.0 };

      const appearanceTween = new TWEEN.Tween(appearanceFrom)
        .to(appearanceTo, 900)
        .onUpdate(({ appearance }) => {
          this._vrmEditor.vrmMaterials.forEach((material) => {
            if (material.userData.shader) {
              material.userData.shader.uniforms.uTime = { value: appearance };
            }
            if (this._actions && appearance === 0) {
              if (!mouseControls.object) mouseControls.setObject(this._actions.startObject);
              if (!touchControls.object) touchControls.setObject(this._actions.startObject);
            }
          });
        });

      dissolveTween.chain(moveTween.chain(appearanceTween));
      dissolveTween.start();
    }
  }

  public changeTexture(durationBlending = 2500): void {
    if (this._textureEditor && this._actions) {
      const currentBlending = { from: 1.0, to: 0.0 };
      const additionalBlending = { from: 0.0, to: 1.0 };

      const { currentTextureName } = this._textureEditor.blendingShader;

      const { additionalTextureName } = this._textureEditor.blendingShader;

      const additionalBlendingName = textures[additionalTextureName];
      const currentBlendingName = textures[currentTextureName];

      new TWEEN.Tween({ current: currentBlending.from, additional: additionalBlending.from })
        .to({ current: currentBlending.to, additional: additionalBlending.to }, durationBlending)
        .onUpdate(({ additional, current }) => {
          this._textureEditor.blendingShader.uniforms.forEach((value) => {
            value.uniform[currentBlendingName].value = current;
            value.uniform[additionalBlendingName].value = additional;
          });
          this._textureEditor.sceneMaterials.forEach((item) => {
            if (item.userData.shader) {
              item.userData.shader.uniforms[currentBlendingName].value = current;
              item.userData.shader.uniforms[additionalBlendingName].value = additional;
            }
          });
        })
        .start();

      this._textureEditor.blendingShader.currentTextureName = additionalTextureName;
      this._textureEditor.blendingShader.additionalTextureName = currentTextureName;
    }
  }

  public characterClickHandler(event: MouseEvent): void {
    this._vrmEditor.charactersData.forEach((character) => {
      if (this._actions && !this.isLoadCharacter && !this._actions.stylesAction?.isLoadStyle) {
        const intersects = this._actions.raycastSystem.mouseRaycast(event, character.name);
        if (intersects.length !== 0) {
          const model = intersects[0].object.parent;
          if (model) this.changeData(model.name);
        }
      }
    });
  }
}
