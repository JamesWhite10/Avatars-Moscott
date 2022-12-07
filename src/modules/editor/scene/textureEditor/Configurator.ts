import { VrmAvatar } from '@avs/vrm-avatar';
import * as THREE from 'three';
import * as ThreeVrm from '@pixiv/three-vrm';
import { SceneViewport } from '../viewports/SceneViewport';

export class Configurator extends VrmAvatar {
  private readonly _sceneViewport: SceneViewport;

  private assetsBones: Record<string, THREE.Bone[]> = {};

  public assetsMeshes: Record<string, THREE.SkinnedMesh[]> = {};

  public assetsSpringJointsSets: Record<string, ThreeVrm.VRMSpringBoneJoint[]> = {};

  public colliders: ThreeVrm.VRMSpringBoneCollider[] = [];

  constructor(sceneViewport: SceneViewport, model: ThreeVrm.VRM) {
    super(model);
    this._sceneViewport = sceneViewport;
    this.colliders = this.getAllColliders();
  }

  applyAsset(part: ThreeVrm.VRM, slot: string, partName: string) {
    this.removeAsset(slot);
    this.resetInitPose();
    const newPart = { ...part } as ThreeVrm.VRM;
    this.assetsBones[slot] = this.appendSpringBones(newPart);
    this.assetsMeshes[slot] = this.moveAssetSkeletonToBase(newPart, partName);
    this.assetsSpringJointsSets[slot] = this.addSpringsJoints(newPart);
    this.vrm.springBoneManager?.reset();
  }

  removeAsset(slot: string) {
    this.removeAssetMeshes(this.assetsMeshes[slot]);
    this.removeSpringsJoints(this.assetsSpringJointsSets[slot]);
  }

  private appendSpringBones(asset: ThreeVrm.VRM) {
    const newBones: THREE.Bone[] = [];
    const newAsset = { ...asset } as ThreeVrm.VRM;

    const rootBone: THREE.Bone | undefined = this.getVrmRootBone(newAsset);
    if (rootBone) {
      rootBone.traverse((bone) => {
        if (!this.vrm.scene.getObjectByName(bone.name)) newBones.push(bone as THREE.Bone);
      });
      newBones.forEach((bone) => {
        if (bone.parent) this.vrm.scene.getObjectByName(bone.parent.name)?.add(bone);
      });
    }
    return newBones;
  }

  private moveAssetSkeletonToBase(asset: ThreeVrm.VRM, namePart: string): THREE.SkinnedMesh[] {
    const objects: THREE.SkinnedMesh[] = [];

    const newAsset = asset.scene.clone(true);

    newAsset.children.forEach((node) => {
      if (node instanceof THREE.SkinnedMesh) {
        node.name = namePart;
        const bones: THREE.Bone[] = [];
        const objSkeleton = node.skeleton;
        (node.skeleton as THREE.Skeleton).dispose();
        this.vrm.scene.add(node);
        objSkeleton.bones.forEach((bone: THREE.Bone) => {
          if (bone) {
            bone.parent?.attach(bone);
            bone.updateWorldMatrix(true, true);
            bone.updateMatrixWorld(true);

            bones.push(this.vrm.scene.getObjectByName(bone.name) as THREE.Bone);
          }
        });
        const skeleton = new THREE.Skeleton(bones);
        node.bind(skeleton);
        objects.push(node);
      }
    });

    return objects;
  }

  private addSpringsJoints(asset: ThreeVrm.VRM): ThreeVrm.VRMSpringBoneJoint[] {
    const joints: ThreeVrm.VRMSpringBoneJoint[] = [];
    const newAsset = { ...asset };
    if (newAsset.springBoneManager) {
      newAsset.springBoneManager.joints.forEach((joint) => {
        this.vrm.springBoneManager?.addJoint(joint);
        joints.push(joint);
      });
    }
    return joints;
  }

  private removeAssetMeshes(meshes?: THREE.Mesh[]): void {
    const { threeRenderer } = this._sceneViewport;
    meshes?.forEach((mesh) => {
      mesh.geometry.dispose();
      (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => m.dispose());
      mesh.removeFromParent();
      threeRenderer.renderLists.dispose();
    });
  }

  private removeSpringsJoints(joints?: ThreeVrm.VRMSpringBoneJoint[]): void {
    joints?.forEach((joint) => {
      this.vrm.springBoneManager?.deleteJoint(joint);
    });
  }

  private getVrmRootBone(vrm: ThreeVrm.VRM): THREE.Bone | undefined {
    let rootBone = vrm.humanoid?.getRawBone(ThreeVrm.VRMHumanBoneName.Spine)?.node;
    if (rootBone && rootBone.parent) {
      while (rootBone.parent instanceof THREE.Bone) {
        rootBone = rootBone.parent;
      }
    }
    return (rootBone as THREE.Bone) || undefined;
  }
}
