import { MaskottEnum } from '../../../enum/MaskottEnum';
import { RaycastSystem } from '../RaycastSystem';
import { MainView } from '../../features/Scene/views/MainView';
import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import SceneViewport from '../../features/Scene/viewports/SceneViewport';
import { getRendererSnapshot } from '../../utils/getRendererSnapshot';
import EventEmitter from 'eventemitter3';
import { MoveConstant } from '../../constans/MoveConstant';

export interface MaskottOptions {
  name: string;
  maskottObject: THREE.Object3D<THREE.Event> | null;
}

export type SceneEventType = {
  loadMaskott:() => void;
  maskottChange:(maskottName: string) => void;
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

export class MaskottAction {
  private _sceneViewport: SceneViewport;

  public eventEmitter!: EventEmitter<SceneEventType>;

  private _mainView: MainView;

  public chooseMaskott!: MaskottEnum;

  public maskotts: MaskottOptions[] = [];

  public raycastSystem: RaycastSystem;

  constructor(options: MainSceneOptions) {
    this._sceneViewport = options.sceneViewport;
    this.eventEmitter = new EventEmitter<SceneEventType>();
    this._mainView = options.mainView;
    this.raycastSystem = new RaycastSystem(options.sceneViewport.threeScene, options.sceneViewport.threeCamera);
  }

  public maskottInit(): void {
    this.maskotts.push({
      maskottObject: this._sceneViewport.threeScene.getObjectByName(MaskottEnum.YUKU) || null,
      name: MaskottEnum.YUKU,
    });

    this.maskotts.push({
      maskottObject: this._sceneViewport.threeScene.getObjectByName(MaskottEnum.MIRA) || null,
      name: MaskottEnum.MIRA,
    });
  }

  public getMaskottByName(maskottName: string): MaskottOptions | null {
    return this.maskotts.find((value) => value.name === maskottName) || null;
  }

  public onUpdate(): void {
    TWEEN.update();
  }

  public changeMaskottPosition(
    currentMaskottName: MaskottEnum,
    positionYuki: THREE.Vector3,
    positionMira: THREE.Vector3,
  ): void {
    const maskottObjectYuki = this.getMaskottByName(MaskottEnum.YUKU)?.maskottObject;
    const maskottObjectMira = this.getMaskottByName(MaskottEnum.MIRA)?.maskottObject;

    maskottObjectYuki?.position.set(positionYuki.x, positionYuki.y, positionYuki.z);
    maskottObjectMira?.position.set(positionMira.x, positionMira.y, positionMira.z);

    const currentMaskott = this.getMaskottByName(currentMaskottName)?.maskottObject;
    if (currentMaskott) currentMaskott.rotation.y = 0;
  }

  public changeMaskott(value: MaskottEnum): Promise<void> {
    if (value !== this.chooseMaskott) {
      if (value === MaskottEnum.YUKU) {
        this.changeMaskottPosition(MaskottEnum.YUKU,
          new THREE.Vector3(1.3, 0, 0),
          new THREE.Vector3(2.8, 0, -1.5));
      }
      if (value === MaskottEnum.MIRA) {
        this.changeMaskottPosition(MaskottEnum.YUKU,
          new THREE.Vector3(2.8, 0, -1.5),
          new THREE.Vector3(1.3, 0, 0));
      }

      const { maskottObjectTo, maskottObjectFrom } = MoveConstant[value];
      this.chooseMaskott = value;
      this.tweenChangeData(maskottObjectFrom, maskottObjectTo);
      const maskott = this._sceneViewport.threeScene.getObjectByName(value);
      if (maskott) this._sceneViewport.mouseControls.setObject(maskott);
      if (maskott) this._sceneViewport.touchControls.setObject(maskott);
      this.eventEmitter.emit('maskottChange', value);
      return Promise.resolve();
    }
    return Promise.resolve();
  }

  public getDefaultMaskott(maskott: string): void {
    const maskottObjectYuki = this.getMaskottByName(MaskottEnum.YUKU)?.maskottObject;
    const maskottObjectMira = this.getMaskottByName(MaskottEnum.MIRA)?.maskottObject;
    if (maskott === MaskottEnum.MIRA) {
      this.chooseMaskott = MaskottEnum.MIRA;
      if (maskottObjectYuki && maskottObjectMira) {
        maskottObjectYuki.position.set(2.8, 0, -1.5);
        maskottObjectMira.position.set(1.3, 0, 0);
      }

      this._mainView.blendingShader.uniforms.forEach((value) => {
        value.uniform.u_miraBlending.value = 1.0;
        value.uniform.u_yukiBlending.value = 0.0;
      });

      if (maskottObjectMira) this._sceneViewport.mouseControls.setObject(maskottObjectMira);
      if (maskottObjectMira) this._sceneViewport.touchControls.setObject(maskottObjectMira);
    } else {
      this.chooseMaskott = MaskottEnum.YUKU;
      if (maskottObjectYuki && maskottObjectMira) {
        maskottObjectMira.position.set(2.8, 0, -1.5);
        maskottObjectYuki.position.set(1.3, 0, 0);
      }

      this._mainView.blendingShader.uniforms.forEach((value) => {
        value.uniform.u_miraBlending.value = 0.0;
        value.uniform.u_yukiBlending.value = 1.0;
      });

      if (maskottObjectYuki) this._sceneViewport.mouseControls.setObject(maskottObjectYuki);
      if (maskottObjectYuki) this._sceneViewport.touchControls.setObject(maskottObjectYuki);
    }
  }

  public handleMaskottClick(event: MouseEvent): void {
    this.maskotts.forEach((maskott) => {
      const intersects = this.raycastSystem.mouseRaycast(event, maskott.name);
      if (intersects.length !== 0) {
        if (intersects[0].object.parent?.name === MaskottEnum.MIRA) this.changeMaskott(MaskottEnum.MIRA);
        if (intersects[0].object.parent?.name === MaskottEnum.YUKU) this.changeMaskott(MaskottEnum.YUKU);
      }
    });
  }

  public handleMaskottTouch(event: TouchEvent): void {
    this.maskotts.forEach((maskott) => {
      const intersects = this.raycastSystem.touchRaycast(event, maskott.name);
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
          value.uniform.u_miraBlending.value = miraBlending;
          value.uniform.u_yukiBlending.value = yukiBlending;
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
