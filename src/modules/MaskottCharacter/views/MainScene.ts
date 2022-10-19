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

export interface MainSceneOptions {
  sceneViewport: SceneViewport;
  mainView: MainView;
}
// todo: странное название
export type MaskottDataFromOrTo = {
  okamiPositionZ: number;
  miraPositionZ: number;
  okamiBlending: number;
  miraBlending: number;
};

export class MainScene {
  private _sceneViewport: SceneViewport;

  private _mainView: MainView;

  public chooseMaskott!: MaskottEnum;

  public miraMaskott: MaskottInterface | null = null;

  public okamiMaskott: MaskottInterface | null = null;

  public raycastSystem: RaycastSystem;

  constructor(options: MainSceneOptions) {
    this._sceneViewport = options.sceneViewport;
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

  public changeMaskott(value = ''): void {
    const isSame = value === this.chooseMaskott;
    if (value === MaskottEnum.MIRA) {
      if (isSame) this.getSameMaskott(this.miraMaskott, this.okamiMaskott);
      this.chooseMaskott = value;
      this.moveToMira(!isSame);
    } else if (value === MaskottEnum.OKAMI) {
      if (isSame) this.getSameMaskott(this.okamiMaskott, this.miraMaskott);
      this.chooseMaskott = value;
      this.moveToOkami(!isSame);
    }
  }

  public getSameMaskott(chooseMaskott: MaskottInterface | null, otherMakott: MaskottInterface | null): void {
    if (chooseMaskott?.character && otherMakott?.character) {
      chooseMaskott.character.position.z = -1.6;
      otherMakott.character.position.z = 0;
    }
  }

  public moveToMira(isChange = true): void {
    const maskottDataTo = { okamiPositionZ: -1.6, miraPositionZ: 0, okamiBlending: 0.0, miraBlending: 1.0 };
    const maskottDataFrom = { okamiPositionZ: 0, miraPositionZ: -1.6, okamiBlending: 1.0, miraBlending: 0.0 };

    this.tweenChangeData(maskottDataFrom, maskottDataTo, isChange);
    if (isChange) {
      this._sceneViewport.threeControls.dampingFactor = 0.04;
      this._sceneViewport.threeControls.mouseButtons.left = CameraControls.ACTION.NONE;
      this._sceneViewport.threeControls.mouseButtons.right = CameraControls.ACTION.NONE;
      Promise.all([
        this._sceneViewport.threeControls.moveTo(-1.3, 1, 1, true),
        this._sceneViewport.threeControls.setTarget(-0.4, 1, 1, true),
      ])
        .finally(() => {
          this._sceneViewport.threeControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
          this._sceneViewport.threeControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
          this._sceneViewport.threeControls.draggingDampingFactor = 0.5;
        });
    }
  }

  public moveToOkami(isChange = true): void {
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
        });
    }
  }

  public getDefaultMaskott(): void {
    const randomNumber = Math.floor(Math.random() * 2);
    if (!randomNumber) {
      this.chooseMaskott = MaskottEnum.MIRA;

      this._sceneViewport.threeControls.setPosition(0, 1.4, 2.6, false);
      this._sceneViewport.threeControls.setTarget(0, 1, 1.1, false);

      if (this.okamiMaskott?.character) this.okamiMaskott.character.position.z = -1.6;

      this._mainView.blendingShader.uniforms.forEach((value) => {
        value.uniform.u_blendingCa.value = 1.0;
        value.uniform.u_blendingCb.value = 0.0;
      });
    } else {
      this.chooseMaskott = MaskottEnum.OKAMI;
      if (this.okamiMaskott?.character && this.miraMaskott?.character) {
        this._sceneViewport.threeControls.setPosition(this.okamiMaskott?.character.position.x + 0.5, 1.4, 2.6, false);
        this._sceneViewport.threeControls.setTarget(this.okamiMaskott?.character.position.x, 1, 1.1, false);
        this.miraMaskott.character.position.z = -1.6;
      }

      this._mainView.blendingShader.uniforms.forEach((value) => {
        value.uniform.u_blendingCa.value = 0.0;
        value.uniform.u_blendingCb.value = 1.0;
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
            value.uniform.u_blendingCa.value = miraBlending;
            value.uniform.u_blendingCb.value = okamiBlending;
          });
        }
      })
      .start();
  }
}
