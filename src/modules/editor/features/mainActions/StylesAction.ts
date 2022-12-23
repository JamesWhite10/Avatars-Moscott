import { textures } from '../../constans/Textures';
import * as TWEEN from '@tweenjs/tween.js';
import { Actions, ActionOptions } from './Actions';
import { TextureEditor, VrmEditor } from '../../scene/textureEditor/index';
import { SceneViewport } from '../../scene/viewports/index';
import { SceneConfig } from '../../scene/viewports/SceneViewport';
import { Avatar, AvatarPart } from '../../../../types/index';
import { VrmConfiguratorOptions } from '../../scene/textureEditor/VrmEditor';

export class StylesAction {
  public readonly _sceneViewport: SceneViewport.SceneViewport;

  public readonly _textureEditor: TextureEditor.TextureEditor;

  private readonly _vrmEditor: VrmEditor.VrmEditor;

  private _actions: Actions | null = null;

  public isLoadStyle: boolean = false;

  constructor(options: ActionOptions) {
    this._sceneViewport = options.sceneViewport;
    this._textureEditor = options.textureEditor;
    this._vrmEditor = options.vrmEditor;
    this._actions = options.actions || null;
  }

  public changeStyle(texture: string, characterName: string): void {
    if (this._textureEditor && this._actions) this._actions.eventEmitter.emit('loadNewStyle', characterName, texture);
  }

  public changeStyleTexture(texture: string): void {
    const { currentTextureName } = this._textureEditor.blendingShader;
    if (this._textureEditor) {
      this._actions?.eventEmitter.emit('onLoadBackground', true);
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
            if (additional === 1) this._actions?.eventEmitter.emit('onLoadBackground', false);
          });
          this._textureEditor.sceneMaterials.forEach((item) => {
            if (item.userData.shader) {
              item.userData.shader.uniforms[currentBlendingName].value = current;
              item.userData.shader.uniforms[additionalBlendingName].value = additional;
            }
          });
        })
        .start();
    }
  }

  public changeStyleCharacter(characterName: string, config: SceneConfig): void {
    const { characters, styles } = config;
    const character = characters.find((item) => characterName.includes(item.id));

    const currentStyle = styles.find((style) => style.id === characterName);

    if (character) {
      const data = this._vrmEditor.charactersData.find((item) => item.name.includes(character?.id));
      const configurator = this._vrmEditor.vrmConfiguratorData.find((item) => item.name.includes(character?.id));
      if (data) {
        const modelObject = data.model;
        if (this._actions && this._actions.startObject) {
          if (this._textureEditor && modelObject) {
            const dissolveTo = { dissolve: 1.0 };
            const dissolveFrom = { dissolve: 0.0 };

            const dissolveTween = new TWEEN.Tween(dissolveFrom)
              .to(dissolveTo, 900)
              .onUpdate(({ dissolve }) => {
                this._vrmEditor.vrmMaterials.forEach((material) => {
                  if (this._actions && this._actions.startObject) {
                    if (material.userData.shader && material.userData.name === this._actions.startObject.name) {
                      material.userData.shader.uniforms.uTime = { value: dissolve };
                    }
                  }
                });
              });

            const moveTween = new TWEEN.Tween(modelObject.position)
              .to(this._actions.startPosition, 0)
              .onUpdate(({ x }) => {
                if (x === this._actions?.startPosition.x) {
                  if (this._actions && currentStyle && configurator) {
                    currentStyle.parts.forEach((avatarPart) => {
                      if (!avatarPart.slots.includes(character.basePart)) {
                        this.changeCharacter(avatarPart, configurator, character);
                      }
                    });
                  }
                  this._actions?.eventEmitter.emit('styleChange', 'mira_base');
                }
              });

            const appearanceFrom = { appearance: 1.0 };
            const appearanceTo = { appearance: 0.0 };

            const appearanceTween = new TWEEN.Tween(appearanceFrom)
              .to(appearanceTo, 900)
              .delay(300)
              .onUpdate(({ appearance }) => {
                this._vrmEditor.vrmMaterials.forEach((material) => {
                  if (material.userData.shader && material.userData.name === `${character.id}_base`) {
                    material.userData.shader.uniforms.uTime = { value: appearance };
                  }
                });
              });

            dissolveTween.chain(moveTween.chain(appearanceTween));

            if (this._actions && currentStyle && configurator) {
              currentStyle.parts.forEach((avatarPart) => {
                if (!avatarPart.slots.includes(character.basePart)) {
                  this._sceneViewport.resourcesManager.addVrm(avatarPart.source || '');
                  this._sceneViewport.resourcesManager.addTexture(avatarPart.texturesMap.base);
                  this._sceneViewport.resourcesManager.load()
                    .then(() => {
                      dissolveTween.start();
                    });
                }
              });
            }
          }
        }
      }
    }
  }

  public changeCharacter(avatarPart: AvatarPart, configurator: VrmConfiguratorOptions, character: Avatar): void {
    const model = this._sceneViewport.resourcesManager.getVrmByUrlOrFail(avatarPart.source || '');

    configurator.configurator.applyAsset(model.userData.vrm, avatarPart.slots[0], avatarPart.id);
    const texture = this._sceneViewport.resourcesManager
      .getTextureByUrlOrFail(avatarPart.texturesMap.base);

    if (character) {
      this._vrmEditor.applyTexture(avatarPart.id, `${character.id}_base`, texture);
      this._vrmEditor.preparePartsTexture(configurator, 1);
    }
  }
}
