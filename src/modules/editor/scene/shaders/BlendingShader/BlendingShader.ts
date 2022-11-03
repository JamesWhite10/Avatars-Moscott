import * as THREE from 'three';
import blendingFragment from './BlendingFragment.glsl';
import blendingVertex from './BlendingVertex.glsl';
import { Style } from '../../../../../types/index';
import ResourcesManager from '../../ResourcesManager';

export interface CreateUniformsOptions {
  textureFirst: THREE.Texture;
  textureSecond: THREE.Texture;
  meshName: string;
  isPortal: boolean;
}

export interface MaterialOptions {
  name: string;
  material: THREE.ShaderMaterial;
}

export interface UniformOptions {
  name: string;
  uniform: Uniform;
}

export interface Uniform {
  isPortal: { value: boolean };
  blendingFirstTexture: { value: number };
  blendingSecondTexture: { value: number };
  textureFirst: { value: THREE.Texture };
  textureSecond: { value: THREE.Texture };
}

export class BlendingShader {
  public materials: MaterialOptions[] = [];

  public uniforms: UniformOptions[] = [];

  public currentTextureName: string = '';

  public additionalTextureName: string = '';

  public createUniform(options: CreateUniformsOptions): Uniform {
    const uniformOptions: UniformOptions = {
      name: options.meshName,
      uniform: {
        isPortal: { value: options.isPortal },
        blendingFirstTexture: { value: 0.0 },
        blendingSecondTexture: { value: 0.0 },
        textureFirst: { value: options.textureFirst },
        textureSecond: { value: options.textureSecond },
      },
    };

    this.uniforms.push(uniformOptions);

    return uniformOptions.uniform;
  }

  public createMaterialShader(uniforms: any, name: string): void {
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: blendingVertex,
      fragmentShader: blendingFragment,
      transparent: true,
    });

    this.materials.push({ material: shaderMaterial, name });
  }

  public getMaterialByName(value: string): THREE.ShaderMaterial | undefined {
    const materialOptions = this.materials.find((item) => item.name === value);
    return materialOptions?.material;
  }

  public sortTextureStyles(resourcesManager: ResourcesManager, styles: Style[], meshName: string): void {
    const textures = styles.map((style) => {
      const textureUrl = style.background[meshName];
      if (!textureUrl) return;
      return { texture: resourcesManager.getTextureByUrlOrFail(textureUrl), name: style.name };
    });

    if (textures[0] && textures[2]) {
      const uniform = this.createUniform({
        meshName,
        isPortal: false,
        textureFirst: textures[2].texture,
        textureSecond: textures[0].texture,
      });
      this.createMaterialShader(uniform, meshName);
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

    if (textures[0] && textures[2]) {
      const uniform = this.createUniform({
        meshName,
        isPortal: true,
        textureFirst: textures[0],
        textureSecond: textures[2],
      });
      this.createMaterialShader(uniform, meshName);
    }
  }
}
