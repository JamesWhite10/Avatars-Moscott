import * as THREE from 'three';
import { HdrTextureResource, ResourceType } from '../ResourcesManager';
import { BlendingShader } from '../shaders/index';
import { SceneViewport } from '../viewports/index';
import * as ThreeVRM from '@pixiv/three-vrm';
import PrimitiveCollider from '../../features/PrimitiveCollider';
import { Avatar, EnvironmentConfigType } from '../../../types/index';

export interface MainViewOptions {
  sceneViewport: SceneViewport.SceneViewport;
}

export class TextureEditor {
  private _sceneViewport: SceneViewport.SceneViewport;

  public blendingShader: BlendingShader.BlendingShader;

  private _mixer!: null | THREE.AnimationMixer;

  constructor(options: MainViewOptions) {
    this._sceneViewport = options.sceneViewport;
    this.blendingShader = new BlendingShader.BlendingShader();
  }

  public onUpdate(delta: number): void {
    this._mixer?.update(delta);
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
        this.blendingShader.sortStyles(this._sceneViewport.resourcesManager, styles, node.name);
        node.material = this.blendingShader.getMaterialByName(node.name);
      }
    });

    const animation = background.animations[0];

    this._mixer = new THREE.AnimationMixer(background.scene);
    this._mixer.clipAction(animation).play();

    this._sceneViewport.threeScene.add(background.scene);
  }

  public addCharacters(characters: Avatar[]): void {
    characters.forEach((character) => {
      const characterModel = this._sceneViewport.resourcesManager.getVrmByUrlOrFail(character.model);
      this.applyCharacter(characterModel.userData.vrm, character.name);
    });
  }

  public applyCharacter = (model: ThreeVRM.VRM, characterName: string): void => {
    // todo: при нажатии на руку не работает райкст
    const primitiveCollider = new PrimitiveCollider();
    primitiveCollider.object.name = characterName;
    model.springBoneManager?.reset();

    primitiveCollider.object.position.set(2.8, 0, -1.5);

    ThreeVRM.VRMUtils.removeUnnecessaryVertices(model.scene);
    ThreeVRM.VRMUtils.removeUnnecessaryJoints(model.scene);

    // todo: надо доработать
    setInterval(() => {
      model.springBoneManager?.update(1 / 60);
      model.update(1 / 60);
    }, (1 / 60) * 2000);

    model.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.receiveShadow = false;
        node.castShadow = false;
      }
    });

    primitiveCollider.object.add(model.scene);

    this._sceneViewport.threeScene.add(primitiveCollider.object);
  };
}
