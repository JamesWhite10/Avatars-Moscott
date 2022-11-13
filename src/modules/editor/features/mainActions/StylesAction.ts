import { textures } from '../../constans/Textures';
import * as TWEEN from '@tweenjs/tween.js';
import { Actions, ActionOptions } from './Actions';
import { TextureEditor } from '../../scene/textureEditor/TextureEditor';
import { SceneViewport } from '../../scene/viewports/index';

export class StylesAction {
  public _sceneViewport: SceneViewport.SceneViewport;

  public _textureEditor: TextureEditor;

  private _actions: Actions | null = null;

  constructor(options: ActionOptions) {
    this._sceneViewport = options.sceneViewport;
    this._textureEditor = options.textureEditor;
    this._actions = options.actions || null;
  }

  public changeStyle(texture: string, characterName: string): void {
    if (this._textureEditor && this._actions) this._actions.eventEmitter.emit('loadStyleCharacter', characterName, texture);
  }

  public changeStyleTexture(texture: string): void {
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
        })
        .start();
    }
  }

  public changeStyleCharacter(characterName: string): void {
    const modelObject = this._sceneViewport.threeScene.getObjectByName(characterName);
    if (this._actions && this._actions.startObject) {
      if (this._textureEditor && modelObject) {
        const dissolveTo = { dissolve: 1.0 };
        const dissolveFrom = { dissolve: 0.0 };

        const dissolveTween = new TWEEN.Tween(dissolveFrom)
          .to(dissolveTo, 900)
          .onUpdate(({ dissolve }) => {
            this._textureEditor.dissolveShader.uniforms.forEach((value) => {
              if (this._actions?.startObject && this._actions.startObject.name === value.name) {
                value.uniform.uTime.value = dissolve;
              }
            });
          });

        const moveTween = new TWEEN.Tween(modelObject.position)
          .to(this._actions.startPosition, 0)
          .onUpdate(({ x, z, y }) => {
            const lastStartObject = this._actions?.startObject;
            if (lastStartObject) {
              lastStartObject.position.set(0, 0, 0);
              lastStartObject.visible = false;
              if (this._actions) {
                this._actions.startObject = modelObject;
                this._actions.startObject.visible = true;
                this._actions.startObject.position.set(x, y, z);
                this._sceneViewport.mouseControls.setObject(modelObject);
                this._sceneViewport.touchControls.setObject(modelObject);
              }
            }
          });

        const appearanceFrom = { appearance: 1.0 };
        const appearanceTo = { appearance: 0.0 };

        const appearanceTween = new TWEEN.Tween(appearanceFrom)
          .to(appearanceTo, 900)
          .onUpdate(({ appearance }) => {
            this._textureEditor.dissolveShader.uniforms.forEach((value) => {
              if (value.name === characterName) value.uniform.uTime.value = appearance;
            });
          });

        dissolveTween.chain(moveTween.chain(appearanceTween));
        dissolveTween.start();
      }
    }
  }
}
