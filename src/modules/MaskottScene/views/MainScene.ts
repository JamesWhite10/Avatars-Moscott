import { MaskottEnum } from '../../../enum/MaskottEnum';
import { RaycastSystem } from '../../features/RaycastSystem';
import { MainView } from '../../features/Scene/views/MainView';
import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import SceneViewport from '../../features/Scene/viewports/SceneViewport';
import { getRendererSnapshot } from '../../utils/getRendererSnapshot';
import EventEmitter from 'eventemitter3';
import { MoveConstans } from '../../constans/MoveConstans';

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
  yukiPositionZ: number;
  miraPositionZ: number;
  yukiBlending: number;
  miraBlending: number;
};

export class MainScene {
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

  public changeMaskott(value: MaskottEnum): Promise<void> {
    if (value !== this.chooseMaskott) {
      const { maskottObjectTo, maskottObjectFrom, rotate, moveTo } = MoveConstans[value];
      this.chooseMaskott = value;
      this.tweenChangeData(maskottObjectFrom, maskottObjectTo);
      return this.moveToMaskott(moveTo, rotate, value);
    }
    return Promise.resolve();
  }

  public moveToMaskott(moveTo: THREE.Vector3, rotate: number, maskottName: MaskottEnum): Promise<void> {
    this.eventEmitter.emit('loadMaskott');
    this._sceneViewport.threeControls.dampingFactor = 0.04;
    this._sceneViewport.threeControls.mouseButtons.left = CameraControls.ACTION.NONE;
    return Promise.all([
      this._sceneViewport.threeControls.moveTo(moveTo.x, moveTo.y, moveTo.z, true),
      this._sceneViewport.threeControls.rotateTo(rotate, 0, true),
    ])
      .then(() => {
        this._sceneViewport.threeControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
        this._sceneViewport.threeControls.draggingDampingFactor = 0.1;
        this.eventEmitter.emit('maskottChange', maskottName);
        Promise.resolve();
      });
  }

  public getDefaultMaskott(maskott: string): void {
    const maskottObjectYuki = this.getMaskottByName(MaskottEnum.YUKU)?.maskottObject;
    const maskottObjectMira = this.getMaskottByName(MaskottEnum.MIRA)?.maskottObject;
    if (maskott === MaskottEnum.MIRA) {
      this.chooseMaskott = MaskottEnum.MIRA;
      this._sceneViewport.threeControls.setTarget(1.7, 1.2, 1.7, false);
      this._sceneViewport.threeControls.setPosition(1.2, 2.2, 3.6, false);
      this._sceneViewport.threeControls.rotateTo(-Math.PI * 0.9, 0, false);
      if (maskottObjectYuki) maskottObjectYuki.position.z = -1.6;

      this._mainView.blendingShader.uniforms.forEach((value) => {
        value.uniform.u_miraBlending.value = 1.0;
        value.uniform.u_yukiBlending.value = 0.0;
      });
    } else {
      this.chooseMaskott = MaskottEnum.YUKU;
      if (maskottObjectYuki && maskottObjectMira) {
        this._sceneViewport.threeControls.maxAzimuthAngle = 0.5;
        this._sceneViewport.threeControls.minAzimuthAngle = -0.1;
        this._sceneViewport.threeControls.setTarget(maskottObjectYuki.position.x + 0.7, 1.3, 1.6, false);
        this._sceneViewport.threeControls.setPosition(maskottObjectYuki.position.x, 1, 3, false);
        this._sceneViewport.threeControls.rotateTo(Math.PI * 0.1, 0, false);
        maskottObjectMira.position.z = -1.6;
      }

      this._mainView.blendingShader.uniforms.forEach((value) => {
        value.uniform.u_miraBlending.value = 0.0;
        value.uniform.u_yukiBlending.value = 1.0;
      });
    }
  }

  public handleMaskottClick(event: MouseEvent): void {
    this.maskotts.forEach((maskott) => {
      const intersects = this.raycastSystem.raycast(event, maskott.name);
      if (intersects.length !== 0) {
        if (intersects[0].object.parent?.name === MaskottEnum.MIRA) this.changeMaskott(MaskottEnum.MIRA);
        if (intersects[0].object.parent?.name === MaskottEnum.YUKU) this.changeMaskott(MaskottEnum.YUKU);
      }
    });
  }

  public tweenChangeData(from: MaskottDataFromOrTo, to: MaskottDataFromOrTo): void {
    const maskottObjectYuki = this.getMaskottByName(MaskottEnum.YUKU)?.maskottObject;
    const maskottObjectMira = this.getMaskottByName(MaskottEnum.MIRA)?.maskottObject;
    const dataTo = { ...to };
    const dataFrom = { ...from };
    new TWEEN.Tween(dataFrom)
      .to({
        yukiPositionZ: dataTo.yukiPositionZ,
        miraPositionZ: dataTo.miraPositionZ,
        yukiBlending: dataTo.yukiBlending,
        miraBlending: dataTo.miraBlending,
      }, 1000)
      .onUpdate(({ miraPositionZ, yukiPositionZ, miraBlending, yukiBlending }) => {
        if (maskottObjectYuki) maskottObjectYuki.position.z = yukiPositionZ;
        if (maskottObjectMira) maskottObjectMira.position.z = miraPositionZ;
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
