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
  u_miraBlending: { value: number };
  u_okamiBlending: { value: number };
  miraTexture: { value: THREE.Texture };
  okamiTexture: { value: THREE.Texture };
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
    uniform sampler2D miraTexture;
    uniform sampler2D okamiTexture;
    uniform float u_miraBlending;
    uniform float u_okamiBlending;

    varying vec2 vUv;

    void main(void) {
      vec3 c;
      vec4 miraTexture2D = texture2D(miraTexture, vUv);
      vec4 okamiTexture2D = texture2D(okamiTexture, vUv);
      if ( miraTexture2D.a < .5 ) discard;
      if ( okamiTexture2D.a < .5 ) discard;
      c = miraTexture2D.rgb * u_miraBlending + okamiTexture2D.rgb * u_okamiBlending;
      gl_FragColor = vec4(c, 1.0);
    }
  `;
  }

  public createUniform(textureOne: THREE.Texture, textureSecond: THREE.Texture, name: string): Uniform {
    const uniformOptions: UniformOptions = {
      name,
      uniform: {
        u_miraBlending: { value: 0.0 },
        u_okamiBlending: { value: 1.0 },
        miraTexture: { value: textureOne },
        okamiTexture: { value: textureSecond },
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
