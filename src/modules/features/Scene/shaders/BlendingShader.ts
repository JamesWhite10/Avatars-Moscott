import * as THREE from 'three';

export interface MaterialOptions {
  name: string;
  material: THREE.ShaderMaterial;
}

export interface UniformOptions {
  name: string;
  uniform: Uniform;
}

export interface Uniform {
  u_blendingCa: { value: number };
  u_blendingCb: { value: number };
  textureOne: { value: THREE.Texture };
  textureSecond: { value: THREE.Texture };
}

export class BlendingShader {
  public materials: MaterialOptions[] = [];

  public uniforms: UniformOptions[] = [];

  private getVertexShader(): string {
    return `
    varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
  }

  private getFragmentShader(): string {
    return `
    uniform sampler2D textureOne;
    uniform sampler2D textureSecond;
    uniform float u_blendingCa;
    uniform float u_blendingCb;

    varying vec2 vUv;

    void main(void) {
      vec3 c;
      vec4 Ca = texture2D(textureOne, vUv);
      vec4 Cb = texture2D(textureSecond, vUv);
      if ( Ca.a < .5 ) discard;
      if ( Cb.a < .5 ) discard;
      c = Ca.rgb * u_blendingCa + Cb.rgb * u_blendingCb;
      gl_FragColor= vec4(c, 1.0);
    }
  `;
  }

  public createUniform(textureOne: THREE.Texture, textureSecond: THREE.Texture, name: string): Uniform {
    const uniformOptions: UniformOptions = {
      name,
      uniform: {
        u_blendingCa: { value: 0.0 },
        u_blendingCb: { value: 1.0 },
        textureOne: { value: textureOne },
        textureSecond: { value: textureSecond },
      },
    };

    this.uniforms.push(uniformOptions);

    return uniformOptions.uniform;
  }

  public createMaterialShader(uniforms: any, name: string): void {
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getFragmentShader(),
    });

    this.materials.push({ material: shaderMaterial, name });
  }

  public getMaterialByName(value: string): THREE.ShaderMaterial | undefined {
    const materialOptions = this.materials.find((item) => item.name === value);
    return materialOptions?.material;
  }
}
