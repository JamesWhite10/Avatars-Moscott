import * as THREE from 'three';
import { MaskottEnum } from '../../../../enum/MaskottEnum';
import { GlbResource, HdrTextureResource, ResourceType } from '../../../ResourcesManager';
import scene from '../../../assets/json/scene/scene.json';
import Mira from '../../../assets/json/scene/maskotts/Mira.json';
import Yuki from '../../../assets/json/scene/maskotts/Yuki.json';
import { MeshEnum } from '../../../enums/MeshEnum';
import { BlendingShader } from '../shaders/BlendingShader';
import SceneViewport from '../viewports/SceneViewport';
import * as ThreeVRM from '@pixiv/three-vrm';
import { TextureMaskottEnum } from '../../../enums/TextureMaskottEnum';
import PrimitiveCollider from '../../PrimitiveCollider';

export interface MainViewOptions {
  sceneViewport: SceneViewport;
}

export interface TexturesParams {
  baseOrange: THREE.Texture[];
  baseBlue: THREE.Texture[];
}

const meshes: string[] = [
  'mountains_mesh',
  'planet_mesh',
  'portal_mesh',
  'sky_mesh',
  'floor_mesh',
];

export class MainView {
  private _sceneViewport: SceneViewport;

  public blendingShader: BlendingShader;

  private _texture: TexturesParams = { baseOrange: [], baseBlue: [] };

  private _mixer!: null | THREE.AnimationMixer;

  private _currentTextures = [{
    texture: Mira.background.base,
    backgroundName: TextureMaskottEnum.BASE_BLUE,
  }, {
    texture: Yuki.background.base,
    backgroundName: TextureMaskottEnum.BASE_ORANGE,
  },
  ];

  constructor(options: MainViewOptions) {
    this._sceneViewport = options.sceneViewport;
    this.blendingShader = new BlendingShader();
  }

  public onUpdate(delta: number): void {
    this._mixer?.update(delta);
  }

  public applyHdrTexture(): void {
    const pmremGenerator = new THREE.PMREMGenerator(this._sceneViewport.threeRenderer);

    const hdrTexture = this._sceneViewport.resourcesManager.getResourceContentByUrlOrFail<HdrTextureResource>(
      scene.environment,
      ResourceType.HDR_TEXTURE,
    );

    this._sceneViewport.threeScene.environment = pmremGenerator.fromEquirectangular(hdrTexture).texture;
    hdrTexture.dispose();
    pmremGenerator.dispose();
  }

  public applyTexture(): void {
    const background = this._sceneViewport.resourcesManager
      .getResourceContentByUrlOrFail<GlbResource>(scene.background, ResourceType.GLB);

    this._currentTextures.forEach((item) => {
      Object.keys(item.texture).forEach((key) => {
        if (item.backgroundName === TextureMaskottEnum.BASE_BLUE) {
          const materialUrl = Mira.background.base[key as keyof typeof Mira.background.base];
          const texture = this._sceneViewport.resourcesManager.getTextureByUrlOrFail(materialUrl);
          texture.flipY = false;
          this._texture.baseBlue.push(texture);
        } else if (item.backgroundName === TextureMaskottEnum.BASE_ORANGE) {
          const materialUrl = Yuki.background.base[key as keyof typeof Yuki.background.base];
          const texture = this._sceneViewport.resourcesManager.getTextureByUrlOrFail(materialUrl);
          texture.flipY = false;
          this._texture.baseOrange.push(texture);
        }
      });
    });

    for (let i = 0; i < 5; i++) {
      const uniform = this.blendingShader.createUniform(this._texture.baseBlue[i], this._texture.baseOrange[i], meshes[i]);
      this.blendingShader.createMaterialShader(uniform, meshes[i]);
    }

    background.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        if (node.name === MeshEnum.MOUNTAINS_MESH) {
          node.material = this.blendingShader.getMaterialByName(MeshEnum.MOUNTAINS_MESH);
        } else if (node.name === MeshEnum.PLANET_MESH) {
          node.material = this.blendingShader.getMaterialByName(MeshEnum.PLANET_MESH);
        } else if (node.name === MeshEnum.PORTAL_MESH) {
          node.material = this.blendingShader.getMaterialByName(MeshEnum.PORTAL_MESH);
        } else if (node.name === MeshEnum.SKY_MESH) {
          node.material = this.blendingShader.getMaterialByName(MeshEnum.SKY_MESH);
        } else if (node.name === MeshEnum.FLOOR_MESH) {
          node.material = this.blendingShader.getMaterialByName(MeshEnum.FLOOR_MESH);
        }
      }
    });

    const animation = background.animations[0];

    this._mixer = new THREE.AnimationMixer(background.scene);
    this._mixer.clipAction(animation).play();

    this._sceneViewport.threeScene.add(background.scene);
  }

  public addMaskotts(): void {
    const mira = this._sceneViewport.resourcesManager.getVrmByUrlOrFail(Mira.maskottSkins.baseSkin);
    const yuki = this._sceneViewport.resourcesManager.getVrmByUrlOrFail(Yuki.maskottSkins.baseSkin);

    this.applyMaskott(new THREE.Vector3(1.5, 0, 0), mira.userData.vrm, MaskottEnum.MIRA);
    this.applyMaskott(new THREE.Vector3(4, 0, 0), yuki.userData.vrm, MaskottEnum.YUKU);
  }

  public applyMaskott = (position: THREE.Vector3, model: ThreeVRM.VRM, maskottName: MaskottEnum): void => {
    const primitiveCollider = new PrimitiveCollider();
    primitiveCollider.object.name = maskottName;
    primitiveCollider.object.position.set(position.x, position.y, position.z);
    model.springBoneManager?.reset();

    ThreeVRM.VRMUtils.removeUnnecessaryVertices(model.scene);
    ThreeVRM.VRMUtils.removeUnnecessaryJoints(model.scene);

    model.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.receiveShadow = false;
        node.castShadow = false;
        node.material.gradientMap = 'none';
      }
    });

    primitiveCollider.object.add(model.scene);

    this._sceneViewport.threeScene.add(primitiveCollider.object);
  };
}
