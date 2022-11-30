import * as Three from 'three';

export class ThreeMemoryCleaner {
  public static disposeThreeGraph(threeObject: Three.Object3D): void {
    threeObject.traverse((object) => {
      if (object instanceof Three.Mesh) return this.disposeThreeMesh(object);
    });
  }

  public static disposeThreeMesh(mesh: Three.Mesh): void {
    mesh.geometry.dispose();

    if (mesh.material instanceof Three.MeshStandardMaterial) this.disposeThreeMaterial(mesh.material);
  }

  public static disposeThreeMaterial(material: Three.MeshStandardMaterial): void {
    material.dispose();

    [
      material.map,
      material.aoMap,
      material.metalnessMap,
      material.emissiveMap,
      material.normalMap,
      material.bumpMap,
      material.alphaMap,
      material.displacementMap,
      material.envMap,
      material.lightMap,
      material.roughnessMap,
      material.map,
    ].forEach((texture: Three.Texture | null) => {
      if (texture) texture.dispose();
    });
  }
}
