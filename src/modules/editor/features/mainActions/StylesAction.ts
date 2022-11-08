import { textures } from '../../constans/Textures';
import * as TWEEN from '@tweenjs/tween.js';
import { Actions, ActionOptions } from './Actions';
import { TextureEditor } from '../../scene/textureEditor/TextureEditor';
import { SceneViewport } from '../../scene/viewports/index';

export class StylesAction {
  public _sceneViewport: SceneViewport.SceneViewport;

  public _mainView: TextureEditor;

  public action: Actions | null = null;

  constructor(options: ActionOptions) {
    this._sceneViewport = options.sceneViewport;
    this._mainView = options.mainView;
    this.action = options.action || null;
  }

  public changeStyle(texture: string, characterName: string): void {
    const { mainView } = this._sceneViewport;
    if (mainView) {
      const { currentTextureName } = this._mainView.blendingShader;

      const additionalBlending = textures[texture];
      const currentBlending = textures[currentTextureName];

      mainView.blendingShader.currentTextureName = texture;

      this.changeStyleTexture(currentBlending, additionalBlending);
      this.changeStyleCharacter(characterName);
    }
  }

  public changeStyleTexture(currentBlendingName: string, additionalBlendingName: string): void {
    const currentBlending = { from: 1.0, to: 0.0 };
    const additionalBlending = { from: 0.0, to: 1.0 };
    new TWEEN.Tween({ additional: additionalBlending.from, current: currentBlending.from })
      .to({ current: currentBlending.to, additional: additionalBlending.to }, 2000)
      .onUpdate(({ additional, current }) => {
        this._mainView.blendingShader.uniforms.forEach((value) => {
          value.uniform[currentBlendingName].value = current;
          value.uniform[additionalBlendingName].value = additional;
        });
      })
      .start();
  }

  public changeStyleCharacter(characterName: string): void {
    const { mainView } = this._sceneViewport;
    const modelObject = this._sceneViewport.threeScene.getObjectByName(characterName);
    if (this.action && this.action.startObject) {
      if (mainView && modelObject) {
        const dissolveTo = { dissolve: 1.0 };
        const dissolveFrom = { dissolve: 0.0 };

        const dissolveTween = new TWEEN.Tween(dissolveFrom)
          .to(dissolveTo, 900)
          .onUpdate(({ dissolve }) => {
            mainView.dissolveShader.uniforms.forEach((value) => {
              if (this.action?.startObject && this.action.startObject.name === value.name) {
                value.uniform.uTime.value = dissolve;
              }
            });
          });

        const moveTween = new TWEEN.Tween(modelObject.position)
          .to(this.action.startPosition, 0)
          .onUpdate(({ x, z, y }) => {
            const lastStartObject = this.action?.startObject;
            if (lastStartObject) {
              lastStartObject.position.set(0, 0, 0);
              lastStartObject.visible = false;
              if (this.action) {
                this.action.startObject = modelObject;
                this.action.startObject.visible = true;
                this.action.startObject.position.set(x, y, z);
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
            mainView.dissolveShader.uniforms.forEach((value) => {
              if (value.name === characterName) value.uniform.uTime.value = appearance;
            });
          });

        dissolveTween.chain(moveTween.chain(appearanceTween));
        dissolveTween.start();
      }
    }
  }
}
