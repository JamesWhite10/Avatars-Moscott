import { MaterialOptions } from './types/shadersType';
import * as THREE from 'three';

export interface ShaderOptions {
  fragmentShader: string;
  vertexShader: string;
}

export class Shader {
  public materials: MaterialOptions[] = [];

  public fragmentShader: string;

  public vertexShader: string;

  constructor(options: ShaderOptions) {
    this.fragmentShader = options.fragmentShader;
    this.vertexShader = options.vertexShader;
  }

  public getMaterialByName(value: string): THREE.ShaderMaterial | undefined {
    const materialOptions = this.materials.find((item) => item.name === value);
    return materialOptions?.material;
  }

  public createMaterialShader(uniforms: any, name: string, transparent = true, lights = false): THREE.ShaderMaterial {
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent,
      lights,
    });

    this.materials.push({ material: shaderMaterial, name });

    return shaderMaterial;
  }
}
