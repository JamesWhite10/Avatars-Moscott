import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { RaycastSystem } from '../RaycastSystem';
import { TextureEditor } from '../../scene/textureEditor/TextureEditor';
import { SceneViewport } from '../../scene/viewports/index';
import { getRendererSnapshot } from '../../utils/getRendererSnapshot';
import EventEmitter from 'eventemitter3';
import { MoveConstant } from '../../constans/MoveConstant';
import { Avatar } from '../../../../types/index';

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
    const { threeScene, mainView, mouseControls, touchControls } = this._sceneViewport;
    if (threeScene && mainView) {
      const modelObject = threeScene.getObjectByName(characterName);

      const startObjectName = !this.startObject ? '' : this.startObject.name;

      if (modelObject && startObjectName !== characterName) {
        mouseControls.setObject(modelObject);
        touchControls.setObject(modelObject);

        this.changeCharacter(modelObject);
        this.changeTexture();
      }
    }
  }

  public moveHead(event: MouseEvent): void {
    this.startObject?.traverse((node) => {
      if (node.name === 'Head') {
        node.rotation.set(
          (-(event.clientY / window.innerHeight) * 2 + 1) * 0.2,
          ((event.clientX / window.innerWidth) * 2 - 1) * 0.4,
          0,
        );
      }
    });
  }

  public changeCharacter(modelObject: THREE.Object3D): void {
    if (this.startObject) this.startObject.position.set(2.8, 0, -1.5);

    this.startObject = modelObject;
    modelObject.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z);

    this.eventEmitter.emit('characterChange', modelObject.name);
  }

  public changeTexture(): void {
    const { mainView } = this._sceneViewport;
    if (mainView) {
      const { currentTextureName } = mainView.blendingShader;

      const { additionalTextureName } = mainView.blendingShader;

      const { to, from } = MoveConstant[additionalTextureName as keyof typeof MoveConstant];
      const dataTo = { ...to };
      const dataFrom = { ...from };
      new TWEEN.Tween(dataFrom)
        .to({
          secondTexture: dataTo.secondTexture,
          firstTexture: dataTo.firstTexture,
        }, 1000)
        .onUpdate(({ firstTexture, secondTexture }) => {
          this._mainView.blendingShader.uniforms.forEach((value) => {
            value.uniform.blendingFirstTexture.value = firstTexture;
            value.uniform.blendingSecondTexture.value = secondTexture;
          });
        })
        .start();

      mainView.blendingShader.currentTextureName = additionalTextureName || '';
      mainView.blendingShader.additionalTextureName = currentTextureName || '';
    }
  }

  public getSnapshot(): string {
    return getRendererSnapshot({ trim: false, renderer: this._sceneViewport.threeRenderer });
  }

  public characterClickHandler(event: MouseEvent): void {
    this.characters.forEach((character) => {
      const intersects = this.raycastSystem.mouseRaycast(event, character.name);
      if (intersects.length !== 0) this.changeData(intersects[0].object.parent?.name || '');
    });
  }

  public characterTouchHandler(event: TouchEvent): void {
    this.characters.forEach((character) => {
      const intersects = this.raycastSystem.touchRaycast(event, character.name);
      if (intersects.length !== 0) this.changeData(intersects[0].object.parent?.name || '');
    });
  }

  public subscribe<T extends keyof SceneEventType>(
    event: T,
    handler: SceneEventType[T],
  ): void {
    this.eventEmitter.on(event, handler as (...args: any) => void);
  }
}
