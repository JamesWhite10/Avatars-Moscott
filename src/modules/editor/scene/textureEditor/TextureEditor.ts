import * as THREE from 'three';
import * as ThreeVRM from '@pixiv/three-vrm';
import { HdrTextureResource, ResourceType } from '../ResourcesManager';
import { BlendingShader } from '../shaders/index';
import { SceneViewport } from '../viewports/index';
import PrimitiveCollider from '../../features/PrimitiveCollider';
import { EnvironmentConfigType } from '../../../../types/index';
import standardBlendingFragment from '../shaders/BlendingShader/StandartBlendingShader/BlendingFragment.glsl';
import standardBlendingVertex from '../shaders/BlendingShader/StandartBlendingShader/BlendingVertex.glsl';
import blendingCustomVertex from '../shaders/BlendingShader/CustomBlendingShader/BlendingVertex.glsl';
import blendingCustomFragment from '../shaders/BlendingShader/CustomBlendingShader/BlendingFragment.glsl';
import dissolveFragment from '../shaders/DissolveShader/DissolveFragment.glsl';
import dissolveVertex from '../shaders/DissolveShader/DissolveVertex.glsl';
import { VrmAvatar } from '@avs/vrm-avatar';
import { ThreeMemoryCleaner } from '../ThreeMemoryCleaner';
import { Configurator } from './index';

export interface MainViewOptions {
  sceneViewport: SceneViewport.SceneViewport;
}

export interface VrmConfiguratorData {
  name: string;
  rootVrm: ThreeVRM.VRM;
  configurator: Configurator.Configurator;
  textures: Record<string, THREE.Texture>[];
}

export interface CharactersData {
  name: string;
  model: THREE.Object3D;
  vrmAvatar: VrmAvatar;
}

export interface PrepareObjectMaterial {
  model: ThreeVRM.VRM;
  textureName: string;
  textures: Record<string, THREE.Texture>[];
  dissolveTexture: THREE.Texture;
}

export class TextureEditor {
  private _sceneViewport: SceneViewport.SceneViewport;

  public blendingShader: BlendingShader.BlendingShader;

  private _mixers: THREE.AnimationMixer[] = [];

  public vrmMaterials: THREE.MeshStandardMaterial[] = [];

  public sceneMaterials: THREE.MeshStandardMaterial[] = [];

  public charactersGroup: THREE.Group = new THREE.Group();

  public charactersData: CharactersData[] = [];

  public vrmConfiguratorData: VrmConfiguratorData[] = [];

  constructor(options: MainViewOptions) {
    this._sceneViewport = options.sceneViewport;
    this.blendingShader = new BlendingShader.BlendingShader({
      fragmentShader: blendingCustomFragment,
      vertexShader: blendingCustomVertex,
    });
  }

  public onUpdate(delta: number): void {
    this._mixers?.forEach((mixer) => {
      mixer.update(delta);
    });
  }

  public applyHdrTexture(environment: EnvironmentConfigType): void {
    const pmremGenerator = new THREE.PMREMGenerator(this._sceneViewport.threeRenderer);

    const hdrTexture = this._sceneViewport.resourcesManager.getResourceContentByUrlOrFail<HdrTextureResource>(
      environment.environment,
      ResourceType.HDR_TEXTURE,
    );

    this._sceneViewport.threeScene.environment = pmremGenerator.fromEquirectangular(hdrTexture).texture;
    hdrTexture.dispose();
    pmremGenerator.dispose();
  }

  public applyVideoTexture = (config: SceneViewport.SceneConfig) => {
    const { environment, styles } = config;

    const background = this._sceneViewport.resourcesManager.getGlbByUrlOrFail(environment.background);
    let videos: NodeListOf<Element>;

    styles.forEach((style) => {
      Object.keys(style.videoBackground).forEach((id) => {
        videos = document.querySelectorAll(`#${id}`);
      });
    });

    background.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        this.blendingShader.sortVideoTextureStyles(this._sceneViewport.resourcesManager, videos, 'portal_video');
        const material = this.blendingShader.getMaterialByName('portal_video');
        if (material && node.name === 'portal_video') {
          node.material = material;
          node.material.dispose();
        }
      }
    });
  };

  public applyTexture(config: SceneViewport.SceneConfig): void {
    const { styles, environment } = config;

    const background = this._sceneViewport.resourcesManager.getGlbByUrlOrFail(environment.background);

    styles.forEach((style) => {
      Object.values(style.background).forEach((texture) => {
        const textureItem = this._sceneViewport.resourcesManager.getTextureByUrlOrFail(texture);
        textureItem.flipY = false;
      });
    });

    background.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.name = node.name.toLowerCase();
        this.blendingShader.sortTextureStyles(this._sceneViewport.resourcesManager, styles, node.name);
        const material = this.blendingShader.getMaterialByName(node.name);
        if (material) {
          node.material.map = material.uniforms.textureFourth.value;
          node.castShadow = false;
          node.receiveShadow = true;
          node.material.onBeforeCompile = (shader: THREE.Shader) => {
            shader.uniforms.textureFirst = { value: material.uniforms.textureFirst.value };
            shader.uniforms.textureSecond = { value: material.uniforms.textureSecond.value };
            shader.uniforms.textureThird = { value: material.uniforms.textureThird.value };
            shader.uniforms.textureFourth = { value: material.uniforms.textureFourth.value };

            shader.uniforms.blendingFirstTexture = { value: 1.0 };
            shader.uniforms.blendingSecondTexture = { value: 0.0 };
            shader.uniforms.blendingThirdTexture = { value: 0.0 };
            shader.uniforms.blendingFourthTexture = { value: 0.0 };

            shader.vertexShader = standardBlendingVertex.replace('#include <uv_pars_vertex>', '#include <common>\n'
              + '#include <uv_pars_vertex>');
            shader.fragmentShader = standardBlendingFragment.replace('#include <packing>', '#include <common>\n'
              + '#include <packing>');

            node.material.userData.shader = shader;
          };
          if (node.name === 'plane') {
            node.material = material;
            node.material.transparent = true;
            node.material.depthTest = true;
            node.material.depthWrite = false;
          }
          ThreeMemoryCleaner.disposeThreeMaterial(node.material);
          node.material.needsUpdate = true;
          this.sceneMaterials.push(node.material);
        }
      }
    });

    const { animations } = background;

    animations.forEach((animation, index) => {
      this._mixers[index] = new THREE.AnimationMixer(background.scene);
      this._mixers[index].timeScale = 0.3;
      this._mixers[index].clipAction(animation).play();
    });

    this._sceneViewport.threeScene.add(background.scene);
  }

  public addSkeleton(part: ThreeVRM.VRM, objectName: string): void {
    const configurator = new Configurator.Configurator(this._sceneViewport, part);
    this.vrmConfiguratorData.push({ configurator, name: objectName, rootVrm: part, textures: [] });
  }

  public addCharacterParts(part: ThreeVRM.VRM, type: string, objectName: string) {
    const currentObject = this.vrmConfiguratorData.find((object) => object.name === objectName);
    if (currentObject) {
      const configurator = (currentObject.configurator as Configurator.Configurator);
      configurator.applyAsset(part, type);
    }
  }

  public applyPartTexture(partType: string, objectName: string, texture: THREE.Texture): void {
    const object = this.vrmConfiguratorData.find((item) => item.name === objectName);
    if (object) object.textures.push({ [partType]: texture });
  }

  public prepareAndAddObjects(dissolveTexture: THREE.Texture): void {
    this.vrmConfiguratorData.forEach((item) => {
      const colliderObject = this.createCharacterCollider(item.rootVrm, item.name);
      const newCurrentVrm = this.applyCharacterTexture({
        model: item.rootVrm,
        textureName: item.name,
        textures: item.textures,
        dissolveTexture,
      });

      colliderObject.add(newCurrentVrm.scene);

      this.charactersGroup.add(colliderObject);
      this.charactersData.push({ name: item.name, vrmAvatar: new VrmAvatar(item.rootVrm), model: colliderObject });
      this._sceneViewport.threeScene.add(this.charactersGroup);
    });
  }

  public createCharacterCollider(model: ThreeVRM.VRM, objectName: string): THREE.Object3D {
    const primitiveCollider = new PrimitiveCollider({
      data: { position: new THREE.Vector3(0, 0.8, 0) },
    });
    primitiveCollider.object.name = objectName;
    primitiveCollider.object.position.set(2.8, 0, -1.5);

    return primitiveCollider.object;
  }

  public applyCharacterTexture = (options: PrepareObjectMaterial): ThreeVRM.VRM => {
    const { textureName, dissolveTexture, textures, model } = options;
    model.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const textureObject = textures.find((item) => {
          const key = Object.keys(item).find((value) => value.includes(node.name));
          if (key) return item;
          return undefined;
        });

        if (textureObject) {
          Object.values(textureObject).forEach((item) => {
            if (textureObject) {
              item.flipY = false;
              node.material.map = item;
              const newMaterial = new THREE.MeshStandardMaterial({ map: item, transparent: true, side: THREE.DoubleSide });
              newMaterial.onBeforeCompile = (shader: THREE.Shader) => {
                shader.uniforms.uHeightMap = { value: dissolveTexture };
                shader.uniforms.uTime = { value: 0.0 };

                shader.vertexShader = dissolveVertex.replace('#include <uv_pars_vertex>', '#include <common>\n'
                  + '#include <uv_pars_vertex>');
                shader.fragmentShader = dissolveFragment.replace('#include <packing>', '#include <common>\n'
                  + '#include <packing>');
                newMaterial.userData.shader = shader;
                newMaterial.userData.name = textureName;
              };
              node.material = newMaterial;
              node.castShadow = true;
              node.material.envMapIntensity = 0.7;
              node.receiveShadow = false;
              this.vrmMaterials.push(newMaterial);
            }
          });
        }
      }
    });
    model.scene.name = textureName;

    return model;
  };
}
