import { textures } from '../../constans/Textures';
import * as TWEEN from '@tweenjs/tween.js';
import { Actions, ActionOptions } from './Actions';
import { TextureEditor } from '../../scene/textureEditor/TextureEditor';
import { SceneViewport } from '../../scene/viewports/index';

export class StylesAction {
  public _sceneViewport: SceneViewport.SceneViewport;

  public _textureEditor: TextureEditor;

  private _actions: Actions | null = null;

  public isLoadStyle: boolean = false;

  constructor(options: ActionOptions) {
    this._sceneViewport = options.sceneViewport;
    this._textureEditor = options.textureEditor;
    this._actions = options.actions || null;
  }

  public changeStyle(texture: string, characterName: string): void {
    if (this._textureEditor && this._actions) this._actions.eventEmitter.emit('loadNewStyle', characterName, texture);
  }

  public changeStyleTexture(texture: string, characterName: string): void {
    const { currentTextureName } = this._textureEditor.blendingShader;
    if (this._textureEditor) {
      this._textureEditor.blendingShader.currentTextureName = texture;

      const additionalBlendingName = textures[texture];
      const currentBlendingName = textures[currentTextureName];

      const currentBlending = { from: 1.0, to: 0.0 };
      const additionalBlending = { from: 0.0, to: 1.0 };
      new TWEEN.Tween({ additional: additionalBlending.from, current: currentBlending.from })
        .to({ current: currentBlending.to, additional: additionalBlending.to }, 2000)
        .onUpdate(({ additional, current }) => {
          this._textureEditor.blendingShader.uniforms.forEach((value) => {
            value.uniform[currentBlendingName].value = current;
            value.uniform[additionalBlendingName].value = additional;
          });
          this._textureEditor.sceneMaterials.forEach((item) => {
            if (item.userData.shader) {
              if (this._actions && additional === 1) this._actions.eventEmitter.emit('styleChange', characterName);
              item.userData.shader.uniforms[currentBlendingName].value = current;
              item.userData.shader.uniforms[additionalBlendingName].value = additional;
            }
          });
        })
        .start();
    }
  }

  // todo: remake as part of another task breaking into parts
  public changeStyleCharacter(characterName: string): void {
    const data = this._textureEditor.charactersData.find((item) => item.name === characterName);
    if (data) {
      const modelObject = data.model;
      if (this._actions && this._actions.startObject) {
        if (this._textureEditor && modelObject) {
          const dissolveTo = { dissolve: 1.0 };
          const dissolveFrom = { dissolve: 0.0 };

          const dissolveTween = new TWEEN.Tween(dissolveFrom)
            .to(dissolveTo, 900)
            .onUpdate(({ dissolve }) => {
              this._textureEditor.vrmMaterials.forEach((material) => {
                if (this._actions && this._actions.startObject) {
                  if (material.userData.shader && material.userData.name === this._actions.startObject.name) {
                    material.userData.shader.uniforms.uTime = { value: dissolve };
                  }
                }
              });
            });

          const moveTween = new TWEEN.Tween(modelObject.position)
            .to(this._actions.startPosition, 0)
            .onUpdate(({ x, z, y }) => {
              if (this._actions) {
                const lastStartObject = this._actions.startObject;
                if (lastStartObject) {
                  this._textureEditor.charactersGroup.remove(lastStartObject);
                  this._textureEditor.charactersData.forEach((item) => {
                    if (item.name === lastStartObject.name) item.model.visible = false;
                  });
                  modelObject.position.set(x, y, z);
                  this._textureEditor.charactersGroup.add(modelObject);
                  this._actions.startObject = modelObject;
                  this._sceneViewport.mouseControls.setObject(modelObject);
                  this._sceneViewport.touchControls.setObject(modelObject);
                  modelObject.visible = true;

                  this._textureEditor.vrmMaterials.forEach((material) => {
                    if (material.userData.shader && material.userData.name === characterName) {
                      material.userData.shader.uniforms.uTime = { value: 1.0 };
                    }
                  });
                }
              }
            });

          const appearanceFrom = { appearance: 1.0 };
          const appearanceTo = { appearance: 0.0 };

          const appearanceTween = new TWEEN.Tween(appearanceFrom)
            .to(appearanceTo, 900)
            .delay(300)
            .onUpdate(({ appearance }) => {
              this._textureEditor.vrmMaterials.forEach((material) => {
                if (material.userData.shader && material.userData.name === characterName) {
                  material.userData.shader.uniforms.uTime = { value: appearance };
                }
              });
            });

          dissolveTween.chain(moveTween.chain(appearanceTween));
          dissolveTween.start();
        }
      }
    }
  }
}
