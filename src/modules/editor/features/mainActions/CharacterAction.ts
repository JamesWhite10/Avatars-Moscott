import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { Style } from '../../../../types/index';
import { textures } from '../../constans/Textures';
import { Actions, ActionOptions, CharacterOptions } from './Actions';
import { TextureEditor } from '../../scene/textureEditor/TextureEditor';
import { SceneViewport } from '../../scene/viewports/index';

export class CharacterAction {
  public _sceneViewport: SceneViewport.SceneViewport;

  private _textureEditor: TextureEditor;

  public _actions: Actions | null = null;

  public characters: CharacterOptions[] = [];

  constructor(options: ActionOptions) {
    this._sceneViewport = options.sceneViewport;
    this._textureEditor = options.textureEditor;
    this._actions = options.actions || null;
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
    const { mouseControls, touchControls } = this._sceneViewport;
    const modelObject = this._sceneViewport.threeScene.children.find((node) => node.name.includes(characterName) && node.visible);
    if (modelObject) {
      const { threeScene } = this._sceneViewport;
      if (threeScene && this._actions) {
        const startObjectName = !this._actions.startObject ? '' : this._actions.startObject.name;
        if (modelObject && startObjectName !== characterName) {
          if (this._actions.startObject) {
            mouseControls.clearData();
            touchControls.clearData();
          }

          mouseControls.setObject(modelObject);
          touchControls.setObject(modelObject);

          this._actions.eventEmitter.emit('loadNewCharacter', characterName, modelObject);
        }
      }
    }
  }

  public moveHead(event: MouseEvent): void {
    if (this._actions) {
      this._textureEditor.vrmAvatars.forEach((vrmAvatar) => {
        if (vrmAvatar.vrm.lookAt) {
          vrmAvatar.vrm.lookAt.lookAt(new THREE.Vector3(
            (event.clientX / window.innerWidth) * 2,
            -(event.clientY / window.innerHeight),
            0,
          ));
        }
      });
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
          this._textureEditor.dissolveShader.uniforms.forEach((value) => {
            value.uniform.uTime.value = dissolve;
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

            this._actions.eventEmitter.emit('characterChange', modelObject.name);
          }
        });

      const appearanceFrom = { appearance: 1.0 };
      const appearanceTo = { appearance: 0.0 };

      const appearanceTween = new TWEEN.Tween(appearanceFrom)
        .to(appearanceTo, 900)
        .onUpdate(({ appearance }) => {
          this._textureEditor.dissolveShader.uniforms.forEach((value) => {
            value.uniform.uTime.value = appearance;
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
        })
        .start();

      this._textureEditor.blendingShader.currentTextureName = additionalTextureName;
      this._textureEditor.blendingShader.additionalTextureName = currentTextureName;
    }
  }

  public characterClickHandler(event: MouseEvent): void {
    this.characters.forEach((character) => {
      if (this._actions && !this._actions.isLoadingCharacter) {
        const intersects = this._actions.raycastSystem.mouseRaycast(event, character.name);
        if (intersects.length !== 0) this.changeData(intersects[0].object.parent?.name || '');
      }
    });
  }

  public characterTouchHandler(event: TouchEvent): void {
    this.characters.forEach((character) => {
      if (this._actions && !this._actions.isLoadingCharacter) {
        const intersects = this._actions.raycastSystem.touchRaycast(event, character.name);
        if (intersects.length !== 0) this.changeData(intersects[0].object.parent?.name || '');
      }
    });
  }
}
