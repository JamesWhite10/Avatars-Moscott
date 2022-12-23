import * as ThreeVRM from '@pixiv/three-vrm';
import * as THREE from 'three';
import { Configurator } from './index';
import { SceneViewport } from '../viewports/SceneViewport';
import { VrmAvatar } from '@avs/vrm-avatar';
import PrimitiveCollider from '../../features/PrimitiveCollider';
import dissolveVertex from '../shaders/DissolveShader/DissolveVertex.glsl';
import dissolveFragment from '../shaders/DissolveShader/DissolveFragment.glsl';
import { PrepareObjectMaterial } from './TextureEditor';
import { NOISE } from '../../../../config/textures';

export interface CharactersData {
  name: string;
  model: THREE.Object3D;
  vrmAvatar: VrmAvatar;
}

export interface VrmConfiguratorOptions {
  name: string;
  rootVrm: ThreeVRM.VRM;
  configurator: Configurator.Configurator;
  textures: Record<string, THREE.Texture>[];
}

export interface VrmEditorOptions {
  sceneViewport: SceneViewport;
}

export class VrmEditor {
  private readonly _sceneViewport: SceneViewport;

  public vrmMaterials: THREE.MeshStandardMaterial[] = [];

  public vrmConfiguratorData: VrmConfiguratorOptions[] = [];

  public charactersData: CharactersData[] = [];

  public charactersGroup: THREE.Group = new THREE.Group();

  constructor(options: VrmEditorOptions) {
    this._sceneViewport = options.sceneViewport;
  }

  public loadPart(vrmSource: string, textureSource: string, configName: string, slot: string, partName: string): void {
    const resource = this._sceneViewport.resourcesManager.resources[vrmSource];
    if (!resource) {
      this._sceneViewport.resourcesManager.addVrm(vrmSource);
      this._sceneViewport.resourcesManager.addTexture(textureSource);
      this._sceneViewport.resourcesManager.load()
        .then(() => {
          this.changeVrmPart(vrmSource, textureSource, configName, slot, partName);
        });
    } else {
      this.changeVrmPart(vrmSource, textureSource, configName, slot, partName);
    }
  }

  public changeVrmPart(vrmSource: string, textureSource: string, configName: string, slot: string, partName: string): void {
    const vrm = this._sceneViewport.resourcesManager.getVrmByUrlOrFail(vrmSource);
    const texture = this._sceneViewport.resourcesManager.getTextureByUrlOrFail(textureSource);
    this.applyToBaseParts(vrm.userData.vrm, partName, configName, slot);
    const configurator = this.vrmConfiguratorData.find((item) => item.name === configName);
    if (configurator) {
      this.applyTexture(partName, configName, texture);
      this.preparePartsTexture(configurator, 0);
    }
  }

  public changeTexture(partName: string, configName: string, textureSource: string): void {
    const configurator = this.vrmConfiguratorData.find((item) => item.name === configName);
    if (configurator) {
      this._sceneViewport.resourcesManager.addTexture(textureSource);
      this._sceneViewport.resourcesManager.load()
        .then(() => {
          const texture = this._sceneViewport.resourcesManager.getTextureByUrlOrFail(textureSource);
          this.applyTexture(partName, configName, texture);
          this.preparePartsTexture(configurator, 0);
        });
    }
  }

  public addBaseSkeleton(part: ThreeVRM.VRM, objectName: string): void {
    const configurator = new Configurator.Configurator(this._sceneViewport, part);
    this.vrmConfiguratorData.push({ configurator, name: objectName, rootVrm: part, textures: [] });
  }

  public applyToBaseParts(part: ThreeVRM.VRM, partName: string, objectName: string, slotName: string) {
    const configuratorData = this.vrmConfiguratorData.find((object) => object.name === objectName);
    if (configuratorData) configuratorData.configurator.applyAsset(part, slotName, partName);
  }

  public applyTexture(partType: string, objectName: string, texture: THREE.Texture): void {
    const object = this.vrmConfiguratorData.find((item) => item.name === objectName);
    if (object) {
      const currentTexture = object.textures.find((item) => item[partType]);
      if (!currentTexture) object.textures.push({ [partType]: texture });
      else currentTexture[partType] = texture;
    }
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

  public addObjectToScene(isCollider = false): void {
    const { threeScene } = this._sceneViewport;
    if (isCollider) {
      this.vrmConfiguratorData.forEach((configData) => {
        const collider = this.createCharacterCollider(configData.rootVrm, configData.name);

        this.preparePartsTexture(configData);
        this.charactersGroup.add(collider);
        collider.add(configData.rootVrm.scene);
        this.charactersData.push({ name: configData.name, vrmAvatar: new VrmAvatar(configData.rootVrm), model: collider });

        threeScene.add(collider);
      });
    }
  }

  public createCharacterCollider(model: ThreeVRM.VRM, rootVrmName: string): THREE.Object3D {
    const primitiveCollider = new PrimitiveCollider({
      data: { position: new THREE.Vector3(0, 0.8, 0) },
    });
    primitiveCollider.object.name = rootVrmName;
    primitiveCollider.object.position.set(2.8, 0.04, -1.5);

    return primitiveCollider.object;
  }

  private applyCharacterTexture = (options: PrepareObjectMaterial): ThreeVRM.VRM => {
    const { textureName, dissolveTexture, textures, model } = options;
    model.scene.traverse((node) => {
      if (node instanceof THREE.SkinnedMesh) {
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
                shader.uniforms.uTime = { value: options.dissolveValue || 0.0 };

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

  public preparePartsTexture(item: VrmConfiguratorOptions, dissolveValue = 1): void {
    const dissolveTexture = this._sceneViewport.resourcesManager.getTextureByUrlOrFail(NOISE);
    this.applyCharacterTexture({
      model: item.rootVrm,
      textureName: item.name,
      textures: item.textures,
      dissolveTexture,
      dissolveValue,
    });
  }
}
