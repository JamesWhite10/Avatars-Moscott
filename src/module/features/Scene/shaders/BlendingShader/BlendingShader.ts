import * as THREE from 'three';
import blendingFragment from './BlendingFragment.glsl';
import blendingVertex from './BlendingVertex.glsl';

export interface MaterialOptions {
  name: string;
  material: THREE.ShaderMaterial;
}

export interface UniformOptions {
  name: string;
  uniform: Uniform;
}

export interface Uniform {
  blendingFistTexture: { value: number };
  blendingSecondTexture: { value: number };
  firstTexture: { value: THREE.Texture };
  secondTexture: { value: THREE.Texture };
}

export class BlendingShader {
  public materials: MaterialOptions[] = [];

  public uniforms: UniformOptions[] = [];

  public createUniform(textureOne: THREE.Texture, textureSecond: THREE.Texture, name: string): Uniform {
    const uniformOptions: UniformOptions = {
      name,
      uniform: {
        blendingFistTexture: { value: 0.0 },
        blendingSecondTexture: { value: 1.0 },
        firstTexture: { value: textureOne },
        secondTexture: { value: textureSecond },
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
    });

    this.materials.push({ material: shaderMaterial, name });
  }

  public getMaterialByName(value: string): THREE.ShaderMaterial | undefined {
    const materialOptions = this.materials.find((item) => item.name === value);
    return materialOptions?.material;
  }
}
