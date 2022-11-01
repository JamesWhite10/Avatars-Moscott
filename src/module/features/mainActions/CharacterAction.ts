import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { RaycastSystem } from '../RaycastSystem';
import { TextureEditor } from '../../scene/textureEditor/TextureEditor';
import { SceneViewport } from '../../scene/viewports/index';
import { getRendererSnapshot } from '../../utils/getRendererSnapshot';
import EventEmitter from 'eventemitter3';
import { CharacterDataFromOrTo, MoveConstant } from '../../constans/MoveConstant';
import { Avatar } from '../../../types/index';

export interface CharacterOptions {
  name: string;
  characterObject: THREE.Object3D<THREE.Event> | null;
}

export type SceneEventType = {
  loadCharacter: () => void;
  characterChange: (characterName: string) => void;
};

export interface MainSceneOptions {
  sceneViewport: SceneViewport.SceneViewport;
  mainView: TextureEditor;
}
// todo: интерфейс для пермещения и бленндинга в твине

export class CharacterAction {
  private _sceneViewport: SceneViewport.SceneViewport;

  public eventEmitter!: EventEmitter<SceneEventType>;

  private _mainView: TextureEditor;

  public characters: CharacterOptions[] = [];

  public raycastSystem: RaycastSystem;

  public startPosition: THREE.Vector3 = new THREE.Vector3(1.3, 0, 0);

  public startObject: THREE.Object3D | null = null;

  constructor(options: MainSceneOptions) {
    this._sceneViewport = options.sceneViewport;
    this.eventEmitter = new EventEmitter<SceneEventType>();
    this._mainView = options.mainView;
    this.raycastSystem = new RaycastSystem(options.sceneViewport.threeScene, options.sceneViewport.threeCamera);
  }

  public onUpdate(): void {
    TWEEN.update();
  }

  public charactersInit(characters: Avatar[]): void {
    characters.forEach((character) => {
      const modelObject = this._sceneViewport.threeScene.getObjectByName(character.name);
      if (modelObject) {
        this.characters.push({
          characterObject: modelObject,
          name: modelObject?.name,
        });
      }
    });
  }

  public changeCharacter(name: string): Promise<void> {
    const modelObject = this._sceneViewport.threeScene.getObjectByName(name);
    const textureName = this._sceneViewport.mainView?.blendingShader.currentTextureName;

    const additionalTextureName = this._sceneViewport.mainView?.blendingShader.additionalTextureName;

    if (modelObject && this.startObject && this.startObject?.name !== modelObject.name) {
      this._sceneViewport.mouseControls.setObject(modelObject);
      this._sceneViewport.touchControls.setObject(modelObject);

      this.startObject.position.set(2.8, 0, -1.5);
      modelObject.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z);
      this.startObject = modelObject;

      const { to, from } = MoveConstant[additionalTextureName as keyof typeof MoveConstant];
      this.changeTexture(from, to);

      this.eventEmitter.emit('characterChange', modelObject.name);

      if (this._sceneViewport.mainView) {
        this._sceneViewport.mainView.blendingShader.currentTextureName = additionalTextureName || '';
        this._sceneViewport.mainView.blendingShader.additionalTextureName = textureName || '';
      }

      return Promise.resolve();
    }
    return Promise.resolve();
  }

  public getDefaultCharacter(characterName: string, styleId: string): void {
    const modelObject = this._sceneViewport.threeScene.getObjectByName(characterName);

    if (modelObject) {
      modelObject.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z);
      this.startObject = modelObject;
      this._sceneViewport.mouseControls.setObject(modelObject);
      this._sceneViewport.touchControls.setObject(modelObject);
      this._sceneViewport.mainView?.blendingShader.changeBlending(styleId, 1.0);
    }
  }

  public characterClickHandler(event: MouseEvent): void {
    this.characters.forEach((character) => {
      const intersects = this.raycastSystem.mouseRaycast(event, character.name);
      if (intersects.length !== 0) this.changeCharacter(intersects[0].object.parent?.name || '');
    });
  }

  public characterTouchHandler(event: TouchEvent): void {
    this.characters.forEach((character) => {
      const intersects = this.raycastSystem.touchRaycast(event, character.name);
      if (intersects.length !== 0) this.changeCharacter(intersects[0].object.parent?.name || '');
    });
  }

  public changeTexture(from: CharacterDataFromOrTo, to: CharacterDataFromOrTo): void {
    const dataTo = { ...to };
    const dataFrom = { ...from };
    new TWEEN.Tween(dataFrom)
      .to({
        secondTexture: dataTo.secondTexture,
        firstTexture: dataTo.firstTexture,
      }, 1000)
      .onUpdate(({ firstTexture, secondTexture }) => {
        this._mainView.blendingShader.uniforms.forEach((value) => {
          value.uniform.blendingFistTexture.value = firstTexture;
          value.uniform.blendingSecondTexture.value = secondTexture;
        });
      })
      .start();
  }

  public subscribe<T extends keyof SceneEventType>(
    event: T,
    handler: SceneEventType[T],
  ): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }

  public getSnapshot(): string {
    return getRendererSnapshot({ trim: false, renderer: this._sceneViewport.threeRenderer });
  }
}
