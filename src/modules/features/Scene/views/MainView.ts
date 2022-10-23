import * as THREE from 'three';
import { MaskottEnum } from '../../../../enum/MaskottEnum';
import { GlbResource, HdrTextureResource, ResourceType } from '../../../ResourcesManager';
import scene from '../../../assets/json/scene/scene.json';
import MiraBaseTexture from '../../../assets/json/scene/maskotts/Mira.json';
import OkamiBaseTexture from '../../../assets/json/scene/maskotts/Okami.json';
import { MeshEnum } from '../../../enums/MeshEnum';
import { BlendingShader } from '../shaders/BlendingShader';
import SceneViewport from '../viewports/SceneViewport';
import { TextureMaskottEnum } from '../../../enums/TextureMaskottEnum';

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

  private _currentTextures = [{
    texture: MiraBaseTexture.background.base,
    backgroundName: TextureMaskottEnum.BASE_BLUE,
  }, {
    texture: OkamiBaseTexture.background.base,
    backgroundName: TextureMaskottEnum.BASE_ORANGE,
  },
  ];

  constructor(options: MainViewOptions) {
    this._sceneViewport = options.sceneViewport;
    this.blendingShader = new BlendingShader();
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
          const materialUrl = MiraBaseTexture.background.base[key as keyof typeof MiraBaseTexture.background.base];
          const texture = this._sceneViewport.resourcesManager.getTextureByUrlOrFail(materialUrl);
          texture.flipY = false;
          this._texture.baseBlue.push(texture);
        } else if (item.backgroundName === TextureMaskottEnum.BASE_ORANGE) {
          const materialUrl = OkamiBaseTexture.background.base[key as keyof typeof OkamiBaseTexture.background.base];
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

    this._sceneViewport.threeScene.add(background.scene);
  }

  public appleShadow(): void {
    this._sceneViewport.threeScene.getObjectByName(MaskottEnum.MIRA)?.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.receiveShadow = true;
        node.castShadow = true;
        (node.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5;
      }
    });

    this._sceneViewport.threeScene.getObjectByName(MaskottEnum.OKAMI)?.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.receiveShadow = true;
        node.castShadow = true;
        (node.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5;
      }
    });
  }
}
