import * as THREE from 'three';
import { HdrTextureResource, ResourceType } from '../ResourcesManager';
import { BlendingShader, DissolveShader } from '../shaders/index';
import { SceneViewport } from '../viewports/index';
import * as ThreeVRM from '@pixiv/three-vrm';
import PrimitiveCollider from '../../features/PrimitiveCollider';
import { EnvironmentConfigType } from '../../../../types/index';
import blendingFragment from '../shaders/BlendingShader/BlendingFragment.glsl';
import blendingVertex from '../shaders/BlendingShader/BlendingVertex.glsl';
import dissolveFragment from '../shaders/DissolveShader/DissolveFragment.glsl';
import dissolveVertex from '../shaders/DissolveShader/DissolveVertex.glsl';
import { NOISE } from '../../constans/TextureUrl';
import { VrmAvatar } from '@avs/vrm-avatar';

export interface MainViewOptions {
  sceneViewport: SceneViewport.SceneViewport;
}

export class TextureEditor {
  private _sceneViewport: SceneViewport.SceneViewport;

  public blendingShader: BlendingShader.BlendingShader;

  public dissolveShader: DissolveShader.DissolveShader;

  private _mixers: THREE.AnimationMixer[] = [];

  public vrmAvatars: VrmAvatar[] = [];

  constructor(options: MainViewOptions) {
    this._sceneViewport = options.sceneViewport;
    this.blendingShader = new BlendingShader.BlendingShader({ fragmentShader: blendingFragment, vertexShader: blendingVertex });
    this.dissolveShader = new DissolveShader.DissolveShader({ vertexShader: dissolveVertex, fragmentShader: dissolveFragment });
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
          node.material = this.blendingShader.getMaterialByName(node.name);
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
          if (node.name === 'plane') {
            material.depthTest = true;

            material.depthWrite = false;
          }
          node.material = material;
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

  public addCharacters(config: SceneViewport.SceneConfig): void {
    const { styles } = config;
    styles.forEach((style) => {
      const characterModel = this._sceneViewport.resourcesManager.getVrmByUrlOrFail(style.model || '');
      this.applyCharacterTexture(characterModel.userData.vrm, style.id);
    });
  }

  public applyCharacterTexture = (model: ThreeVRM.VRM, textureName: string): void => {
    const primitiveCollider = new PrimitiveCollider({
      data: { position: new THREE.Vector3(0, 0.8, 0) },
    });
    primitiveCollider.object.name = textureName;
    model.springBoneManager?.reset();

    primitiveCollider.object.position.set(2.8, 0.2, -1.5);

    const noiseTexture = this._sceneViewport.resourcesManager.getTextureByUrlOrFail(NOISE);

    model.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.receiveShadow = false;
        node.castShadow = false;
        if (Array.isArray(node.material)) {
          const materials: THREE.ShaderMaterial[] = [];
          node.material.forEach((material: THREE.ShaderMaterial) => {
            const map = material.uniforms.map.value;
            const uniform = this.dissolveShader.createUniform({ uDiffuseMap: map, uHeightMap: noiseTexture }, textureName);
            materials.push(this.dissolveShader.createMaterialShader(uniform, textureName, false, true));
          });
          node.material = materials;
        }
      }
    });

    model.scene.name = textureName;
    this.vrmAvatars.push(new VrmAvatar(model));

    primitiveCollider.object.add(model.scene);

    this._sceneViewport.threeScene.add(primitiveCollider.object);
  };

  public hideObjects(objectName: string, isVisible: boolean): void {
    const objectModel = this._sceneViewport.threeScene.getObjectByName(objectName);
    if (objectModel) objectModel.visible = isVisible;
  }
}
