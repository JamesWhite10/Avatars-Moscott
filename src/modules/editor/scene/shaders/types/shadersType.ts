import * as THREE from 'three';

export interface ShadersType<T> {
  name?: string;
  uniform: T;
}

export interface MaterialOptions {
  name: string;
  material: THREE.ShaderMaterial;
}
