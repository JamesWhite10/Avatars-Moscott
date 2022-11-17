import * as THREE from 'three';
import { GLTFLoader, GLTF as ThreeGLTF, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { DataTexture, Texture, TextureLoader } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as ThreeVRM from '@pixiv/three-vrm';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export interface Loader {
  load: (
    url: string,
    onLoad: (result: unknown) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void,
  ) => void;
}

export type ResourcesManagerOptions = {
  useQueryTimestamp?: boolean;
};

export interface Resource {
  type: ResourceType;
  error?: Error;
  content?: unknown;
  loaded: boolean;
}

export enum ResourceType {
  GLB = 'GLB',
  HDR_TEXTURE = 'HDR_TEXTURE',
  TEXTURE = 'TEXTURE',
  VRM = 'VRM',
  FBX = 'FBX',
}

export interface GlbResource extends Resource {
  type: ResourceType.GLB;
  content?: ThreeGLTF;
}

export interface TextureResource extends Resource {
  type: ResourceType.TEXTURE;
  content?: Texture;
}

export interface FbxResource extends Resource {
  type: ResourceType.FBX;
  content?: THREE.Group;
}

export interface HdrTextureResource extends Resource {
  type: ResourceType.HDR_TEXTURE;
  content?: DataTexture;
}

export interface VrmResource extends Resource {
  type: ResourceType.VRM;
  content?: ThreeGLTF;
}

export interface ResourceLoadData {
  url: string;
  loaded: number;
  total: number;
}

export type ResourcesRecord = Record<string, (
  GlbResource | HdrTextureResource | TextureResource | VrmResource | FbxResource)>;

class ResourcesManager {
  public gltfLoader: GLTFLoader = new GLTFLoader();

  public vrmLoader: GLTFLoader = new GLTFLoader();

  public fbxLoader: FBXLoader = new FBXLoader();

  public rgbeLoader: RGBELoader = new RGBELoader();

  public textureLoader: TextureLoader = new TextureLoader();

  public resources: ResourcesRecord = {};

  private useQueryTimestamp: boolean;

  private readonly queryTimestampKey = '_ts';

  private overallProgressLoad: number = 0;

  private resourceLoadData: ResourceLoadData[] = [];

  constructor(params: ResourcesManagerOptions = {}) {
    this.gltfLoader.setCrossOrigin('anonymous');
    this.textureLoader.setCrossOrigin('anonymous');
    this.vrmLoader.setCrossOrigin('anonymous');
    this.rgbeLoader.setCrossOrigin('anonymous');
    this.fbxLoader.setCrossOrigin('anonymous');
    this.useQueryTimestamp = params.useQueryTimestamp ?? true;
  }

  public addGlb(url: string): this {
    this.addResource(url, ResourceType.GLB);
    return this;
  }

  public addVrm(url: string): this {
    this.resourceLoadData.push({ url, total: 0, loaded: 0 });
    this.addResource(url, ResourceType.VRM);
    return this;
  }

  public addTexture(url: string): this {
    this.addResource(url, ResourceType.TEXTURE);
    return this;
  }

  public addFbx(url: string):void {
    this.resourceLoadData.push({ url, total: 0, loaded: 0 });
    this.addResource(url, ResourceType.FBX);
  }

  public getTextureByUrlOrFail(url: string): Texture {
    return this.getResourceContentByUrlOrFail<TextureResource>(url, ResourceType.TEXTURE);
  }

  public getGlbByUrlOrFail(url: string): ThreeGLTF {
    return this.getResourceContentByUrlOrFail<GlbResource>(url, ResourceType.GLB);
  }

  public getFbxByUrlOrFail(url: string): THREE.Group {
    return this.getResourceContentByUrlOrFail<FbxResource>(url, ResourceType.FBX);
  }

  public addHdrTexture(url: string): this {
    this.addResource(url, ResourceType.HDR_TEXTURE);
    return this;
  }

  public getResourceByUrl<T extends Resource>(url: string, type: ResourceType): T | undefined {
    const resource = this.resources[url];
    if (resource?.type !== type) return undefined;
    return resource as T;
  }

  public getVrmByUrlOrFail = (url: string): GLTF => {
    return this.getResourceContentByUrlOrFail<VrmResource>(url, ResourceType.VRM);
  };

  public getResourceContentByUrlOrFail<T extends Resource>(url: string, type: ResourceType): Required<T>['content'] {
    const resource = this.getResourceByUrl<T>(url, type);

    if (!resource?.content) throw new Error(`Resource content for ${url} not found`);

    return resource?.content;
  }

  public checkAllResourcesAreLoaded(): boolean {
    return !Object.values(this.resources).some((resource) => !resource?.loaded);
  }

  public load(onProgress: (progress: number) => void): Promise<void> {
    if (this.checkAllResourcesAreLoaded()) return Promise.resolve();

    return Promise
      .all(Object.keys(this.resources).map((url) => {
        if (this.resources[url]?.loaded) return Promise.resolve();

        return this.loadResource(url, this.resources[url] as Resource, onProgress);
      }))
      .then(() => undefined);
  }

  public addResource(url: string, type: ResourceType): this {
    if (this.resources[url]) return this;

    this.resources[url] = { type, loaded: false, content: undefined, error: undefined };
    return this;
  }

  protected getLoaderByResource(resource: Resource): Loader {
    if (resource.type === ResourceType.GLB) return this.gltfLoader;
    if (resource.type === ResourceType.HDR_TEXTURE) return this.rgbeLoader;
    if (resource.type === ResourceType.TEXTURE) return this.textureLoader;
    if (resource.type === ResourceType.FBX) return this.fbxLoader;
    if (resource.type === ResourceType.VRM) {
      this.vrmLoader.register((parser) => new ThreeVRM.VRMLoaderPlugin(parser));
      return this.vrmLoader;
    }
    throw new Error(`Loader for type ${resource.type} not defined`);
  }

  protected loadResource(
    url: string,
    resource: Resource,
    onProgress: (value: number) => void,
  ): Promise<void> {
    const loader = this.getLoaderByResource(resource);
    let resourceUrl = url;
    if (this.useQueryTimestamp) {
      resourceUrl = this.addQueryTimestampToUrl(url);
    }
    return new Promise((resolve, reject) => loader.load(
      resourceUrl,
      (content) => {
        resource.loaded = true;
        resource.content = content;
        resource.error = undefined;
        resolve();
      },
      (xhr) => {
        this.resourceLoadData.forEach((item) => {
          if (item.url === url) {
            item.loaded = xhr.loaded;
            item.total = xhr.total;
            if (this.overallProgressLoad < this.countPercentLoader()) {
              this.overallProgressLoad = this.countPercentLoader();
              const progress = this.countPercentLoader();
              onProgress(progress - 2);
            }
          }
        });
      },
      () => {
        resource.loaded = true;
        resource.content = undefined;
        resource.error = new Error(`Unable load resource. Type: ${resource.type}. Url: ${url}`);
        reject(resource.error);
      },
    ));
  }

  private countPercentLoader(): number {
    const count = this.resourceLoadData.reduce((prev, item) => {
      return {
        load: prev.load + item.loaded,
        total: prev.total + item.total,
      };
    }, { load: 0, total: 0 });
    return (count.load / count.total) * 100;
  }

  private addQueryTimestampToUrl(url: string): string {
    let urlObject: URL;

    if (url.indexOf('://') > 0 || url.indexOf('//') === 0) {
      urlObject = new URL(url);
    } else {
      urlObject = new URL(url, window.location.origin);
    }

    const params = new URLSearchParams(urlObject.search);
    params.set(this.queryTimestampKey, Date.now().toString());
    urlObject.search = params.toString();

    return urlObject.toString();
  }
}

export default ResourcesManager;
