import * as THREE from 'three';
import { MaskottInterface } from '../MaskottInterface/MaskottInterface';
import { FeatureFactory } from './FeautureFactory';
import { MaskottEnum } from '../../../enum/MaskottEnum';

export class MiraCharacter implements MaskottInterface {
  private _feautures: FeatureFactory;

  public character: THREE.Object3D | null = null;

  public characterLight: THREE.SpotLight | null = null;

  constructor(threeScene: THREE.Scene) {
    this._feautures = new FeatureFactory();
    this.initForPreview(threeScene);
  }

  public initForPreview = (scene: THREE.Scene) => {
    const feautures = this._feautures.makeEnvironmentFeature();
    const light = feautures.setupLightStrategy.setupLight(scene);
    this.characterLight = light;

    this.character = scene.getObjectByName(MaskottEnum.MIRA) || null;
  };
}
