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
  u_miraBlending: { value: number };
  u_yukiBlending: { value: number };
  miraTexture: { value: THREE.Texture };
  yukiTexture: { value: THREE.Texture };
}

export class BlendingShader {
  public materials: MaterialOptions[] = [];

  public uniforms: UniformOptions[] = [];

  public createUniform(textureOne: THREE.Texture, textureSecond: THREE.Texture, name: string): Uniform {
    const uniformOptions: UniformOptions = {
      name,
      uniform: {
        u_miraBlending: { value: 0.0 },
        u_yukiBlending: { value: 1.0 },
        miraTexture: { value: textureOne },
        yukiTexture: { value: textureSecond },
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
