import * as THREE from 'three';
import { ShadersType } from '../types/shadersType';
import { Shader, ShaderOptions } from '../Shader';

export interface CreateUniformsOptions {
  uHeightMap: THREE.Texture;
  uDiffuseMap: THREE.Texture;
}

export interface Uniform {
  uTime: { value: number };
  uHeightMap: { value: THREE.Texture };
  uDiffuseMap: { value: THREE.Texture };
}

export class DissolveShader extends Shader {
  public uniforms: ShadersType<Uniform>[] = [];

  public currentTextureName: string = '';

  public additionalTextureName: string = '';

  constructor({ fragmentShader, vertexShader }: ShaderOptions) {
    super({ vertexShader, fragmentShader });
  }

  public createUniform(options: CreateUniformsOptions, uniformName: string): Uniform {
    const uniformOptions: ShadersType<Uniform> = {
      uniform: THREE.UniformsUtils.merge([
        THREE.UniformsLib.lights,
        {
          uTime: { value: 0.0 },
          uDiffuseMap: { value: options.uDiffuseMap },
          uHeightMap: { value: options.uHeightMap },
        },
      ]),
    };

    this.uniforms.push({ uniform: uniformOptions.uniform, name: uniformName });

    return uniformOptions.uniform;
  }

  public getUniformByName(value: string): ShadersType<Uniform> | undefined {
    return this.uniforms.find((item) => item.name === value);
  }
}
