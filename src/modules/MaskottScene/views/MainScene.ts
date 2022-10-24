import { MaskottEnum } from '../../../enum/MaskottEnum';
import { RaycastSystem } from '../../features/RaycastSystem';
import { MainView } from '../../features/Scene/views/MainView';
import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import SceneViewport from '../../features/Scene/viewports/SceneViewport';
import { getRendererSnapshot } from '../../utils/getRendererSnapshot';
import EventEmitter from 'eventemitter3';

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
  okamiPositionZ: number;
  miraPositionZ: number;
  okamiBlending: number;
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
      maskottObject: this._sceneViewport.threeScene.getObjectByName(MaskottEnum.OKAMI) || null,
      name: MaskottEnum.OKAMI,
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

  public changeMaskott(value = ''): Promise<void> | void {
    const maskottName = value === MaskottEnum.YUKU ? MaskottEnum.OKAMI : value;
    if (maskottName === MaskottEnum.MIRA && maskottName !== this.chooseMaskott) {
      this.chooseMaskott = maskottName;

      const maskottDataTo = { okamiPositionZ: -1.6, miraPositionZ: 0, okamiBlending: 0.0, miraBlending: 1.0 };
      const maskottDataFrom = { okamiPositionZ: 0, miraPositionZ: -1.6, okamiBlending: 1.0, miraBlending: 0.0 };

      this.tweenChangeData(maskottDataFrom, maskottDataTo);
      return this.moveToMaskott(
        new THREE.Vector3(-0.5, 1, 1),
        -Math.PI / 2,
        MaskottEnum.MIRA,
      ).then(() => {
        return Promise.resolve();
      });
    }
    // todo : рассинхрон из-за неверного нейминга мальчика, как поменяем модельки надо убрать лишнее условие
    if ((maskottName === MaskottEnum.YUKU || maskottName === MaskottEnum.OKAMI) && maskottName !== this.chooseMaskott) {
      this.chooseMaskott = maskottName as MaskottEnum;

      const maskottDataTo = { okamiPositionZ: 0, miraPositionZ: -1.6, okamiBlending: 1.0, miraBlending: 0.0 };
      const maskottDataFrom = { okamiPositionZ: -1.6, miraPositionZ: 0, okamiBlending: 0.0, miraBlending: 1.0 };

      this.tweenChangeData(maskottDataFrom, maskottDataTo);
      this._sceneViewport.threeControls.maxAzimuthAngle = Infinity;
      return this.moveToMaskott(
        new THREE.Vector3(3.1, 1, 1.7),
        Math.PI * 0.1,
        MaskottEnum.YUKU,
      ).then(() => {
        return Promise.resolve();
      })
        .finally(() => {
          this._sceneViewport.threeControls.maxAzimuthAngle = Math.PI * 0.07;
        });
    } Promise.resolve();
  }

  public moveToMaskott(moveTo: THREE.Vector3, rotate: number, maskottName: MaskottEnum): Promise<void> {
    this.eventEmitter.emit('loadMaskott');
    this._sceneViewport.threeControls.dampingFactor = 0.04;
    this._sceneViewport.threeControls.mouseButtons.left = CameraControls.ACTION.NONE;
    this._sceneViewport.threeControls.mouseButtons.right = CameraControls.ACTION.NONE;
    return Promise.all([
      this._sceneViewport.threeControls.moveTo(moveTo.x, moveTo.y, moveTo.z, true),
      this._sceneViewport.threeControls.rotateTo(rotate, 0, true),
    ])
      .then(() => {
        this._sceneViewport.threeControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
        this._sceneViewport.threeControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
        this._sceneViewport.threeControls.draggingDampingFactor = 0.5;
        this.eventEmitter.emit('maskottChange', maskottName);
        Promise.resolve();
      });
  }

  public getDefaultMaskott(maskott: string): void {
    const maskottObjectOkami = this.getMaskottByName(MaskottEnum.OKAMI)?.maskottObject;
    const maskottObjectMira = this.getMaskottByName(MaskottEnum.MIRA)?.maskottObject;
    if (maskott === MaskottEnum.MIRA) {
      this.chooseMaskott = MaskottEnum.MIRA;
      this._sceneViewport.threeControls.setTarget(-1, 1, 1.7, false);
      this._sceneViewport.threeControls.setPosition(-1.5, 2, 1.7, false);
      this._sceneViewport.threeControls.rotateTo(-Math.PI * 0.44, 0, false);
      if (maskottObjectOkami) maskottObjectOkami.position.z = -1.6;

      this._mainView.blendingShader.uniforms.forEach((value) => {
        value.uniform.u_miraBlending.value = 1.0;
        value.uniform.u_okamiBlending.value = 0.0;
      });
    } else {
      this.chooseMaskott = MaskottEnum.OKAMI;
      if (maskottObjectOkami && maskottObjectMira) {
        this._sceneViewport.threeControls.setPosition(maskottObjectOkami.position.x + 0.5, 1.4, 2.6, false);
        this._sceneViewport.threeControls.setTarget(maskottObjectOkami.position.x, 1, 1.1, false);
        maskottObjectMira.position.z = -1.6;
      }

      this._mainView.blendingShader.uniforms.forEach((value) => {
        value.uniform.u_miraBlending.value = 0.0;
        value.uniform.u_okamiBlending.value = 1.0;
      });
    }
  }

  public handleClick(event: MouseEvent): void {
    const intersects = this.raycastSystem.raycast(event);

    this.changeMaskott(intersects[0].object.parent?.name);
  }

  public tweenChangeData(from: MaskottDataFromOrTo, to: MaskottDataFromOrTo): void {
    const maskottObjectOkami = this.getMaskottByName(MaskottEnum.OKAMI)?.maskottObject;
    const maskottObjectMira = this.getMaskottByName(MaskottEnum.MIRA)?.maskottObject;
    const data = to;
    new TWEEN.Tween(from)
      .to({
        okamiPositionZ: data.okamiPositionZ,
        miraPositionZ: data.miraPositionZ,
        okamiBlending: data.okamiBlending,
        miraBlending: data.miraBlending,
      }, 1000)
      .onUpdate(({ miraPositionZ, okamiPositionZ, miraBlending, okamiBlending }) => {
        if (maskottObjectOkami) maskottObjectOkami.position.z = okamiPositionZ;
        if (maskottObjectMira) maskottObjectMira.position.z = miraPositionZ;
        this._mainView.blendingShader.uniforms.forEach((value) => {
          value.uniform.u_miraBlending.value = miraBlending;
          value.uniform.u_okamiBlending.value = okamiBlending;
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
