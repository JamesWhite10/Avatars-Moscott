import { GLTFLoader, GLTF as ThreeGLTF, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { DataTexture, Texture, TextureLoader } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as ThreeVRM from '@pixiv/three-vrm';

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
}

export interface GlbResource extends Resource {
  type: ResourceType.GLB;
  content?: ThreeGLTF;
}

export interface TextureResource extends Resource {
  type: ResourceType.TEXTURE;
  content?: Texture;
}

export interface HdrTextureResource extends Resource {
  type: ResourceType.HDR_TEXTURE;
  content?: DataTexture;
}

export interface VrmResource extends Resource {
  type: ResourceType.VRM;
  content?: ThreeGLTF;
}

export type ResourcesRecord = Record<string, (
  GlbResource | HdrTextureResource | TextureResource | VrmResource)>;

class ResourcesManager {
  public gltfLoader: GLTFLoader = new GLTFLoader();

  public vrmLoader: GLTFLoader = new GLTFLoader();

  public rgbeLoader: RGBELoader = new RGBELoader();

  public textureLoader: TextureLoader = new TextureLoader();

  public resources: ResourcesRecord = {};

  private useQueryTimestamp: boolean;

  private readonly queryTimestampKey = '_ts';

  private overallProgressLoad: number = 0;

  constructor(params: ResourcesManagerOptions = {}) {
    this.gltfLoader.setCrossOrigin('anonymous');
    this.textureLoader.setCrossOrigin('anonymous');
    this.vrmLoader.setCrossOrigin('anonymous');
    this.rgbeLoader.setCrossOrigin('anonymous');
    this.useQueryTimestamp = params.useQueryTimestamp ?? true;
  }

  public addGlb(url: string): this {
    this.addResource(url, ResourceType.GLB);
    return this;
  }

  public addVrm(url: string): this {
    this.addResource(url, ResourceType.VRM);
    return this;
  }

  public addTexture(url: string): this {
    this.addResource(url, ResourceType.TEXTURE);
    return this;
  }

  public getTextureByUrlOrFail(url: string): Texture {
    return this.getResourceContentByUrlOrFail<TextureResource>(url, ResourceType.TEXTURE);
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
        if (resource.type === ResourceType.VRM) {
          const progressLoaded = (xhr.loaded / xhr.total) * 100;
          if (progressLoaded > this.overallProgressLoad) {
            this.overallProgressLoad = progressLoaded;
            onProgress(Math.floor(this.overallProgressLoad));
          }
        }
      },
      () => {
        resource.loaded = true;
        resource.content = undefined;
        resource.error = new Error(`Unable load resource. Type: ${resource.type}. Url: ${url}`);
        reject(resource.error);
      },
    ));
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
