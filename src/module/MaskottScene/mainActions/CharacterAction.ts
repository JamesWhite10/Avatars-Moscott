import { MaskottEnum } from '../../../enum/MaskottEnum';
import { RaycastSystem } from '../RaycastSystem';
import { MainView } from '../../features/Scene/views/MainView';
import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import SceneViewport from '../../features/Scene/viewports/SceneViewport';
import { getRendererSnapshot } from '../../utils/getRendererSnapshot';
import EventEmitter from 'eventemitter3';
import { MoveConstant } from '../../constans/MoveConstant';

export interface CharacterOptions {
  name: string;
  characterObject: THREE.Object3D<THREE.Event> | null;
}

export type SceneEventType = {
  loadCharacter: () => void;
  characterChange: (maskottName: string) => void;
};

export interface MainSceneOptions {
  sceneViewport: SceneViewport;
  mainView: MainView;
}
// todo: интерфейс для пермещения и бленндинга в твине
export type MaskottDataFromOrTo = {
  yukiBlending: number;
  miraBlending: number;
};

export class CharacterAction {
  private _sceneViewport: SceneViewport;

  public eventEmitter!: EventEmitter<SceneEventType>;

  private _mainView: MainView;

  public chooseCharacter!: MaskottEnum;

  public characters: CharacterOptions[] = [];

  public raycastSystem: RaycastSystem;

  constructor(options: MainSceneOptions) {
    this._sceneViewport = options.sceneViewport;
    this.eventEmitter = new EventEmitter<SceneEventType>();
    this._mainView = options.mainView;
    this.raycastSystem = new RaycastSystem(options.sceneViewport.threeScene, options.sceneViewport.threeCamera);
  }

  public charactersInit(): void {
    this.characters.push({
      characterObject: this._sceneViewport.threeScene.getObjectByName(MaskottEnum.YUKU) || null,
      name: MaskottEnum.YUKU,
    });

    this.characters.push({
      characterObject: this._sceneViewport.threeScene.getObjectByName(MaskottEnum.MIRA) || null,
      name: MaskottEnum.MIRA,
    });
  }

  // todo: убрать присовение имени к чарактеру
  public getCharacterByName(maskottName: string): CharacterOptions | null {
    return this.characters.find((value) => value.name === maskottName) || null;
  }

  public onUpdate(): void {
    TWEEN.update();
  }

  public changeCharacterPosition(
    currentMaskottName: MaskottEnum,
    positionYuki: THREE.Vector3,
    positionMira: THREE.Vector3,
  ): void {
    const maskottObjectYuki = this.getCharacterByName(MaskottEnum.YUKU)?.characterObject;
    const maskottObjectMira = this.getCharacterByName(MaskottEnum.MIRA)?.characterObject;

    maskottObjectYuki?.position.set(positionYuki.x, positionYuki.y, positionYuki.z);
    maskottObjectMira?.position.set(positionMira.x, positionMira.y, positionMira.z);

    const currentMaskott = this.getCharacterByName(currentMaskottName)?.characterObject;
    if (currentMaskott) currentMaskott.rotation.y = 0;
  }

  public changeMaskott(value: MaskottEnum): Promise<void> {
    if (value !== this.chooseCharacter) {
      if (value === MaskottEnum.YUKU) {
        this.changeCharacterPosition(MaskottEnum.YUKU,
          new THREE.Vector3(1.3, 0, 0),
          new THREE.Vector3(2.8, 0, -1.5));
      }
      if (value === MaskottEnum.MIRA) {
        this.changeCharacterPosition(MaskottEnum.YUKU,
          new THREE.Vector3(2.8, 0, -1.5),
          new THREE.Vector3(1.3, 0, 0));
      }

      const { maskottObjectTo, maskottObjectFrom } = MoveConstant[value];
      this.chooseCharacter = value;
      this.tweenChangeData(maskottObjectFrom, maskottObjectTo);
      const maskott = this._sceneViewport.threeScene.getObjectByName(value);
      if (maskott) this._sceneViewport.mouseControls.setObject(maskott);
      if (maskott) this._sceneViewport.touchControls.setObject(maskott);
      this.eventEmitter.emit('characterChange', value);
      return Promise.resolve();
    }
    return Promise.resolve();
  }

  public getDefaultCharacter(maskott: string): void {
    const maskottObjectYuki = this.getCharacterByName(MaskottEnum.YUKU)?.characterObject;
    const maskottObjectMira = this.getCharacterByName(MaskottEnum.MIRA)?.characterObject;
    if (maskott === MaskottEnum.MIRA) {
      this.chooseCharacter = MaskottEnum.MIRA;
      if (maskottObjectYuki && maskottObjectMira) {
        maskottObjectYuki.position.set(2.8, 0, -1.5);
        maskottObjectMira.position.set(1.3, 0, 0);
      }

      this._mainView.blendingShader.uniforms.forEach((value) => {
        value.uniform.blendingFistTexture.value = 1.0;
        value.uniform.blendingSecondTexture.value = 0.0;
      });

      if (maskottObjectMira) this._sceneViewport.mouseControls.setObject(maskottObjectMira);
      if (maskottObjectMira) this._sceneViewport.touchControls.setObject(maskottObjectMira);
    } else {
      this.chooseCharacter = MaskottEnum.YUKU;
      if (maskottObjectYuki && maskottObjectMira) {
        maskottObjectMira.position.set(2.8, 0, -1.5);
        maskottObjectYuki.position.set(1.3, 0, 0);
      }

      this._mainView.blendingShader.uniforms.forEach((value) => {
        value.uniform.blendingFistTexture.value = 0.0;
        value.uniform.blendingSecondTexture.value = 1.0;
      });

      if (maskottObjectYuki) this._sceneViewport.mouseControls.setObject(maskottObjectYuki);
      if (maskottObjectYuki) this._sceneViewport.touchControls.setObject(maskottObjectYuki);
    }
  }

  public characterClickHandler(event: MouseEvent): void {
    this.characters.forEach((character) => {
      const intersects = this.raycastSystem.mouseRaycast(event, character.name);
      if (intersects.length !== 0) {
        if (intersects[0].object.parent?.name === MaskottEnum.MIRA) this.changeMaskott(MaskottEnum.MIRA);
        if (intersects[0].object.parent?.name === MaskottEnum.YUKU) this.changeMaskott(MaskottEnum.YUKU);
      }
    });
  }

  public characterTouchHandler(event: TouchEvent): void {
    this.characters.forEach((character) => {
      const intersects = this.raycastSystem.touchRaycast(event, character.name);
      if (intersects.length !== 0) {
        if (intersects[0].object.parent?.name === MaskottEnum.MIRA) this.changeMaskott(MaskottEnum.MIRA);
        if (intersects[0].object.parent?.name === MaskottEnum.YUKU) this.changeMaskott(MaskottEnum.YUKU);
      }
    });
  }

  public tweenChangeData(from: MaskottDataFromOrTo, to: MaskottDataFromOrTo): void {
    const dataTo = { ...to };
    const dataFrom = { ...from };
    new TWEEN.Tween(dataFrom)
      .to({
        yukiBlending: dataTo.yukiBlending,
        miraBlending: dataTo.miraBlending,
      }, 1000)
      .onUpdate(({ miraBlending, yukiBlending }) => {
        this._mainView.blendingShader.uniforms.forEach((value) => {
          value.uniform.blendingFistTexture.value = miraBlending;
          value.uniform.blendingSecondTexture.value = yukiBlending;
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
