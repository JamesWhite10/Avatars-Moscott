import * as THREE from 'three';
import { Style } from '../../../../../types/index';
import ResourcesManager from '../../ResourcesManager';
import { ShadersType } from '../types/shadersType';
import { Shader, ShaderOptions } from '../Shader';

export interface CreateUniformsOptions {
  textureFirst: THREE.Texture;
  textureSecond: THREE.Texture;
  textureThird: THREE.Texture;
  textureFourth: THREE.Texture;

  meshName: string;
  isPortal: boolean;
}

export type UniformValueType = { value: THREE.Texture | number | boolean };

export interface Uniform {
  [key: string]: UniformValueType;
}

export class BlendingShader extends Shader {
  public uniforms: ShadersType<Uniform>[] = [];

  public currentTextureName: string = '';

  public additionalTextureName: string = '';

  constructor({ fragmentShader, vertexShader }: ShaderOptions) {
    super({ vertexShader, fragmentShader });
  }

  public createUniform(options: CreateUniformsOptions): Uniform {
    const uniformOptions: ShadersType<Uniform> = {
      name: options.meshName,
      uniform: {
        isPortal: { value: options.isPortal },
        blendingFirstTexture: { value: 0.0 },
        blendingSecondTexture: { value: 0.0 },
        blendingThirdTexture: { value: 0.0 },
        blendingFourthTexture: { value: 0.0 },

        textureFirst: { value: options.textureFirst },
        textureSecond: { value: options.textureSecond },
        textureThird: { value: options.textureThird },
        textureFourth: { value: options.textureFourth },
      },
    };

    this.uniforms.push(uniformOptions);

    return uniformOptions.uniform;
  }

  public sortTextureStyles(resourcesManager: ResourcesManager, styles: Style[], meshName: string): void {
    const textures = styles.map((style) => {
      const textureUrl = style.background[meshName];
      if (!textureUrl) return;
      return { texture: resourcesManager.getTextureByUrlOrFail(textureUrl), name: style.name };
    });

    if (textures[0] && textures[2] && textures[3] && textures[1]) {
      const uniform = this.createUniform({
        meshName,
        isPortal: false,
        textureFirst: textures[2].texture,
        textureSecond: textures[0].texture,
        textureThird: textures[1].texture,
        textureFourth: textures[3].texture,
      });
      this.createMaterialShader(uniform, meshName, true);
    }
  }

  public sortVideoTextureStyles(resourcesManager: ResourcesManager, videos: NodeListOf<Element>, meshName: string): void {
    const textures = Array.from(videos).map((node) => {
      (node as HTMLVideoElement).play();
      return new THREE.VideoTexture(node as HTMLVideoElement);
    });

    textures.forEach((texture) => {
      texture.flipY = false;
    });

    const uniform = this.createUniform({
      meshName,
      isPortal: true,
      textureFirst: textures[2],
      textureSecond: textures[0],
      textureThird: textures[1],
      textureFourth: textures[3],
    });
    this.createMaterialShader(uniform, meshName);
  }
}
