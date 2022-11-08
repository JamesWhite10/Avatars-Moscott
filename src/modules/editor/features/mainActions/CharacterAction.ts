import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { Style } from '../../../../types/index';
import { textures } from '../../constans/Textures';
import { Actions, ActionOptions, CharacterOptions } from './Actions';
import { TextureEditor } from '../../scene/textureEditor/TextureEditor';
import { SceneViewport } from '../../scene/viewports/index';

export class CharacterAction {
  public _sceneViewport: SceneViewport.SceneViewport;

  public _mainView: TextureEditor;

  public action: Actions | null = null;

  public characters: CharacterOptions[] = [];

  constructor(options: ActionOptions) {
    this._sceneViewport = options.sceneViewport;
    this._mainView = options.mainView;
    this.action = options.action || null;
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
    this._mainView.blendingShader.currentTextureName = currentTextureName;
    this._mainView.blendingShader.additionalTextureName = targetTextureName;
    this.changeData(characterName);
  }

  public changeData(characterName: string): void {
    const modelObject = this._sceneViewport.threeScene.children.find((node) => node.name.includes(characterName) && node.visible);
    if (modelObject) {
      const { threeScene, mainView, mouseControls, touchControls } = this._sceneViewport;
      if (threeScene && mainView && this.action) {
        const startObjectName = !this.action.startObject ? '' : this.action.startObject.name;

        if (modelObject && startObjectName !== characterName) {
          mouseControls.setObject(modelObject);
          touchControls.setObject(modelObject);

          this.changeCharacter(modelObject);
          this.changeTexture();
        }
      }
    }
  }

  public moveHead(event: MouseEvent): void {
    if (this.action) {
      this.action.startObject?.traverse((node) => {
        if (node.name === 'Head') {
          node.rotation.set(
            (-(event.clientY / window.innerHeight) * 2 + 1) * 0.2,
            ((event.clientX / window.innerWidth) * 2 - 1) * 0.4,
            0,
          );
        }
      });
    }
  }

  public changeCharacter(modelObject: THREE.Object3D): void {
    const { mainView } = this._sceneViewport;
    if (!this.action) return;
    if (mainView) {
      const dissolveTo = { dissolve: 1.0 };
      const dissolveFrom = { dissolve: 0.0 };

      const dissolveTween = new TWEEN.Tween(dissolveFrom)
        .to(dissolveTo, 900)
        .onUpdate(({ dissolve }) => {
          mainView.dissolveShader.uniforms.forEach((value) => {
            value.uniform.uTime.value = dissolve;
          });
        });

      const moveTween = new TWEEN.Tween(modelObject.position)
        .to(this.action.startPosition, 0)
        .onUpdate(({ x, z }) => {
          if (this.action && this.action.startObject) {
            this.action.startObject.rotation.y = 0;
            this.action.startObject.position.set(2.8, 0.05, -1.5);
          }

          if (this.action) {
            this.action.startObject = modelObject;
            modelObject.position.set(x, this.action.startPosition.y, z);

            this.action.eventEmitter.emit('characterChange', modelObject.name);
          }
        });

      const appearanceFrom = { appearance: 1.0 };
      const appearanceTo = { appearance: 0.0 };

      const appearanceTween = new TWEEN.Tween(appearanceFrom)
        .to(appearanceTo, 900)
        .onUpdate(({ appearance }) => {
          mainView.dissolveShader.uniforms.forEach((value) => {
            value.uniform.uTime.value = appearance;
          });
        });

      dissolveTween.chain(moveTween.chain(appearanceTween));
      dissolveTween.start();
    }
  }

  public changeTexture(): void {
    const { mainView } = this._sceneViewport;
    if (mainView) {
      const currentBlending = { from: 1.0, to: 0.0 };
      const additionalBlending = { from: 0.0, to: 1.0 };

      const { currentTextureName } = mainView.blendingShader;

      const { additionalTextureName } = mainView.blendingShader;

      const additionalBlendingName = textures[additionalTextureName];
      const currentBlendingName = textures[currentTextureName];

      new TWEEN.Tween({ current: currentBlending.from, add: additionalBlending.from })
        .to({ current: currentBlending.to, add: additionalBlending.to }, 2000)
        .onUpdate(({ add, current }) => {
          this._mainView.blendingShader.uniforms.forEach((value) => {
            value.uniform[currentBlendingName].value = current;
            value.uniform[additionalBlendingName].value = add;
          });
        })
        .start();

      mainView.blendingShader.currentTextureName = additionalTextureName;
      mainView.blendingShader.additionalTextureName = currentTextureName;
    }
  }

  public characterClickHandler(event: MouseEvent): void {
    this.characters.forEach((character) => {
      if (this.action) {
        const intersects = this.action.raycastSystem.mouseRaycast(event, character.name);
        if (intersects.length !== 0) this.changeData(intersects[0].object.parent?.name || '');
      }
    });
  }

  public characterTouchHandler(event: TouchEvent): void {
    this.characters.forEach((character) => {
      if (this.action) {
        const intersects = this.action.raycastSystem.touchRaycast(event, character.name);
        if (intersects.length !== 0) this.changeData(intersects[0].object.parent?.name || '');
      }
    });
  }
}
