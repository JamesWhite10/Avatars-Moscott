import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { Style } from '../../../../types/index';
import { textures } from '../../constans/Textures';
import { Actions, ActionOptions, CharacterOptions } from './Actions';
import { TextureEditor } from '../../scene/textureEditor/TextureEditor';
import { SceneViewport } from '../../scene/viewports/index';
import { VrmAvatar } from '@avs/vrm-avatar';
import * as ThreeVrm from '@pixiv/three-vrm';

export class CharacterAction {
  public _sceneViewport: SceneViewport.SceneViewport;

  private _textureEditor: TextureEditor;

  public _actions: Actions | null = null;

  public characters: CharacterOptions[] = [];

  public isLoadCharacter: boolean = false;

  private blinkMixer: THREE.AnimationMixer[] = [];

  constructor(options: ActionOptions) {
    this._sceneViewport = options.sceneViewport;
    this._textureEditor = options.textureEditor;
    this._actions = options.actions || null;
    this.blinkEyes();
  }

  public charactersInit(styles: Style[]): void {
    styles.forEach((style) => {
      const modelObject = this._sceneViewport.threeScene.getObjectByName(style.id);
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
    const modelObject = this._sceneViewport.threeScene.children.find((node) => node.name.includes(characterName) && node.visible);
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
      this._actions.textureEditor.vrmAvatars.forEach((avatar) => {
        avatar.vrm.humanoid.autoUpdateHumanBones = false;
        avatar.update(delta);
        this.moveHead(avatar);
        this.moveEyes(avatar);
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
    this._textureEditor.vrmAvatars.forEach((item, index) => {
      const durationClip = 4 + Math.random() * (10 - 4);
      this.blinkMixer.push(new THREE.AnimationMixer(item.vrm.scene));

      const firstTimeBlink = index / 10;

      const blinkTrack = new THREE.NumberKeyframeTrack(
        item.vrm.expressionManager?.getExpressionTrackName(ThreeVrm.VRMExpressionPresetName.Blink) || 'VRMExpression_blink.weight',
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

  public changeCharacter(modelObject: THREE.Object3D): void {
    const { mouseControls, touchControls } = this._sceneViewport;
    if (!this._actions) return;
    if (this._textureEditor) {
      const dissolveTo = { dissolve: 1.0 };
      const dissolveFrom = { dissolve: 0.0 };

      const dissolveTween = new TWEEN.Tween(dissolveFrom)
        .to(dissolveTo, 900)
        .onUpdate(({ dissolve }) => {
          this._textureEditor.vrmMaterials.forEach((material) => {
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
            this._actions.startObject.position.set(2.8, 0.2, -1.5);
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
          this._textureEditor.vrmMaterials.forEach((material) => {
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

  public changeTexture(): void {
    if (this._textureEditor) {
      const currentBlending = { from: 1.0, to: 0.0 };
      const additionalBlending = { from: 0.0, to: 1.0 };

      const { currentTextureName } = this._textureEditor.blendingShader;

      const { additionalTextureName } = this._textureEditor.blendingShader;

      const additionalBlendingName = textures[additionalTextureName];
      const currentBlendingName = textures[currentTextureName];

      new TWEEN.Tween({ current: currentBlending.from, additional: additionalBlending.from })
        .to({ current: currentBlending.to, additional: additionalBlending.to }, 2000)
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
    this.characters.forEach((character) => {
      if (this._actions && !this.isLoadCharacter && !this._actions.stylesAction?.isLoadStyle) {
        const intersects = this._actions.raycastSystem.mouseRaycast(event, character.name);
        if (intersects.length !== 0) {
          const model = intersects[0].object.parent;
          if (model) this.changeData(model.name);
        }
      }
    });
  }

  public characterTouchHandler(event: TouchEvent): void {
    this.characters.forEach((character) => {
      if (this._actions && !this.isLoadCharacter && !this._actions.stylesAction?.isLoadStyle) {
        const intersects = this._actions.raycastSystem.touchRaycast(event, character.name);
        if (intersects && intersects.length !== 0) {
          const model = intersects[0].object.parent;
          if (model) this.changeData(model.name);
        }
      }
    });
  }
}
