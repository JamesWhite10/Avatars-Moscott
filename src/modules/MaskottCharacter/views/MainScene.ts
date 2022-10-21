import { MaskottEnum } from '../../../enum/MaskottEnum';
import { MiraCharacter } from '../Mira/MiraCharacter';
import { OkamiCharacter } from '../Okami/OkamiCharacter';
import { RaycastSystem } from '../../features/RaycastSystem';
import { MainView } from '../../features/Scene/views/MainView';
import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import SceneViewport from '../../features/Scene/viewports/SceneViewport';
import { getRendererSnapshot } from '../../utils/getRendererSnapshot';
import { MaskottInterface } from '../MaskottInterface/MaskottInterface';
import EventEmitter from 'eventemitter3';

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

  public miraMaskott: MaskottInterface | null = null;

  public okamiMaskott: MaskottInterface | null = null;

  public raycastSystem: RaycastSystem;

  constructor(options: MainSceneOptions) {
    this._sceneViewport = options.sceneViewport;
    this.eventEmitter = new EventEmitter<SceneEventType>();
    this._mainView = options.mainView;
    this.raycastSystem = new RaycastSystem(options.sceneViewport.threeScene, options.sceneViewport.threeCamera);
  }

  public maskottInit(): void {
    this.okamiMaskott = new OkamiCharacter(this._sceneViewport.threeScene);
    this.miraMaskott = new MiraCharacter(this._sceneViewport.threeScene);
  }

  public onUpdate(): void {
    TWEEN.update();
  }

  public changeMaskott(value = ''): Promise<void> | void {
    const isSame = value === this.chooseMaskott;
    if (value === MaskottEnum.MIRA) {
      if (isSame) this.getSameMaskott(this.miraMaskott, this.okamiMaskott);
      this.chooseMaskott = value;
      return this.moveToMira(!isSame);
    }
    // todo : рассинхрон из-за неверного нейминга мальчика, как поменяем модельки убрать лишнее условие
    if (value === MaskottEnum.YUKU || value === MaskottEnum.OKAMI) {
      if (isSame) this.getSameMaskott(this.okamiMaskott, this.miraMaskott);
      this.chooseMaskott = value as MaskottEnum;
      return this.moveToOkami(!isSame)
        .then(() => Promise.resolve());
    }
  }

  public getSameMaskott(chooseMaskott: MaskottInterface | null, otherMakott: MaskottInterface | null): void {
    if (chooseMaskott?.character && otherMakott?.character) {
      chooseMaskott.character.position.z = -1.6;
      otherMakott.character.position.z = 0;
    }
  }

  public moveToMira(isChange = true): Promise<void> {
    return new Promise((resolve) => {
      this.eventEmitter.emit('loadMaskott');
      const maskottDataTo = { okamiPositionZ: -1.6, miraPositionZ: 0, okamiBlending: 0.0, miraBlending: 1.0 };
      const maskottDataFrom = { okamiPositionZ: 0, miraPositionZ: -1.6, okamiBlending: 1.0, miraBlending: 0.0 };

      this.tweenChangeData(maskottDataFrom, maskottDataTo, isChange);
      if (isChange) {
        this._sceneViewport.threeControls.dampingFactor = 0.04;
        this._sceneViewport.threeControls.mouseButtons.left = CameraControls.ACTION.NONE;
        this._sceneViewport.threeControls.mouseButtons.right = CameraControls.ACTION.NONE;
        Promise.all([
          this._sceneViewport.threeControls.moveTo(-0.756, 1, 1, true),
          this._sceneViewport.threeControls.setTarget(-0.3, 1, 1, true),
        ])
          .finally(() => {
            this._sceneViewport.threeControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
            this._sceneViewport.threeControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
            this._sceneViewport.threeControls.draggingDampingFactor = 0.5;
            resolve();
            this.eventEmitter.emit('maskottChange', MaskottEnum.MIRA);
          });
      } else {
        this.eventEmitter.emit('maskottChange', MaskottEnum.MIRA);
        resolve();
      }
    });
  }

  public moveToOkami(isChange = true): Promise<void> {
    return new Promise((resolve) => {
      this.eventEmitter.emit('loadMaskott');
      const maskottDataTo = { okamiPositionZ: 0, miraPositionZ: -1.6, okamiBlending: 1.0, miraBlending: 0.0 };
      const maskottDataFrom = { okamiPositionZ: -1.6, miraPositionZ: 0, okamiBlending: 0.0, miraBlending: 1.0 };

      this.tweenChangeData(maskottDataFrom, maskottDataTo, isChange);

      if (isChange) {
        this._sceneViewport.threeControls.dampingFactor = 0.04;
        this._sceneViewport.threeControls.mouseButtons.left = CameraControls.ACTION.NONE;
        this._sceneViewport.threeControls.mouseButtons.right = CameraControls.ACTION.NONE;
        Promise.all([
          this._sceneViewport.threeControls.moveTo(3.86, 1, 1, true),
          this._sceneViewport.threeControls.setTarget(3, 1, 1, true),
        ])
          .finally(() => {
            this._sceneViewport.threeControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
            this._sceneViewport.threeControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
            this._sceneViewport.threeControls.draggingDampingFactor = 0.5;
            this.eventEmitter.emit('maskottChange', MaskottEnum.YUKU);
            resolve();
          });
      } else {
        this.eventEmitter.emit('maskottChange', MaskottEnum.YUKU);
        resolve();
      }
    });
  }

  public getDefaultMaskott(maskott: string): void {
    if (maskott === MaskottEnum.MIRA) {
      this.chooseMaskott = MaskottEnum.MIRA;

      this._sceneViewport.threeControls.setPosition(0, 1.4, 2.6, false);
      this._sceneViewport.threeControls.setTarget(0, 1, 1.1, false);

      if (this.okamiMaskott?.character) this.okamiMaskott.character.position.z = -1.6;

      this._mainView.blendingShader.uniforms.forEach((value) => {
        value.uniform.u_miraBlending.value = 1.0;
        value.uniform.u_okamiBlending.value = 0.0;
      });
    } else {
      this.chooseMaskott = MaskottEnum.OKAMI;
      if (this.okamiMaskott?.character && this.miraMaskott?.character) {
        this._sceneViewport.threeControls.setPosition(this.okamiMaskott?.character.position.x + 0.5, 1.4, 2.6, false);
        this._sceneViewport.threeControls.setTarget(this.okamiMaskott?.character.position.x, 1, 1.1, false);
        this.miraMaskott.character.position.z = -1.6;
      }

      this._mainView.blendingShader.uniforms.forEach((value) => {
        value.uniform.u_miraBlending.value = 0.0;
        value.uniform.u_okamiBlending.value = 1.0;
      });
    }
  }

  public getSnapshot(): string {
    const { background } = this._sceneViewport.threeScene;
    const rendererSize = this._sceneViewport.threeRenderer.getSize(new THREE.Vector2());

    this._sceneViewport.threeScene.background = null;

    this._sceneViewport.threeCamera.children.forEach((child) => this._sceneViewport.snapshotThreeCamera.add(child));

    this._sceneViewport.threeRenderer.render(this._sceneViewport.threeScene, this._sceneViewport.snapshotThreeCamera);

    const snapshot = getRendererSnapshot({ trim: false, renderer: this._sceneViewport.threeRenderer });

    this._sceneViewport.threeScene.background = background;
    this._sceneViewport.threeRenderer.setSize(rendererSize.width, rendererSize.height);

    this._sceneViewport.snapshotThreeCamera.children.forEach((child) => this._sceneViewport.threeCamera.add(child));

    return snapshot;
  }

  public handleClick(event: MouseEvent): void {
    const intersects = this.raycastSystem.raycast(event);

    this.changeMaskott(intersects[0].object.parent?.name);
  }

  public tweenChangeData(from: MaskottDataFromOrTo, to: MaskottDataFromOrTo, isChangeTexture = true): void {
    const data = to;
    new TWEEN.Tween(from)
      .to({
        okamiPositionZ: data.okamiPositionZ,
        miraPositionZ: data.miraPositionZ,
        okamiBlending: data.okamiBlending,
        miraBlending: data.miraBlending,
      }, 1000)
      .onUpdate(({ miraPositionZ, okamiPositionZ, miraBlending, okamiBlending }) => {
        if (this.okamiMaskott?.character) this.okamiMaskott.character.position.z = okamiPositionZ;
        if (this.miraMaskott?.character) this.miraMaskott.character.position.z = miraPositionZ;
        if (isChangeTexture) {
          this._mainView.blendingShader.uniforms.forEach((value) => {
            value.uniform.u_miraBlending.value = miraBlending;
            value.uniform.u_okamiBlending.value = okamiBlending;
          });
        }
      })
      .start();
  }
}
