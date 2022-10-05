import { GLTFLoader, GLTF as ThreeGLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { DataTexture } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

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
}

export interface GlbResource extends Resource {
  type: ResourceType.GLB;
  content?: ThreeGLTF;
}

export interface HdrTextureResource extends Resource {
  type: ResourceType.HDR_TEXTURE;
  content?: DataTexture;
}

export type ResourcesRecord = Record<string, (
  GlbResource | HdrTextureResource)>;

class ResourcesManager {
  public gltfLoader: GLTFLoader = new GLTFLoader();

  public rgbeLoader: RGBELoader = new RGBELoader();

  public resources: ResourcesRecord = {};

  private useQueryTimestamp: boolean;

  private readonly queryTimestampKey = '_ts';

  private overallProgressLoad: number = 0;

  constructor(params: ResourcesManagerOptions = {}) {
    this.gltfLoader.setCrossOrigin('anonymous');
    this.useQueryTimestamp = params.useQueryTimestamp ?? true;
  }

  public addGlb(url: string): this {
    this.addResource(url, ResourceType.GLB);
    return this;
  }

  public getResourceContentByUrlOrFail<T extends Resource>(url: string, type: ResourceType): Required<T>['content'] {
    const resource = this.getResourceByUrl<T>(url, type);

    if (!resource?.content) throw new Error(`Resource content for ${url} not found`);

    return resource?.content;
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
        this.overallProgressLoad = ((xhr.loaded / 33935200) * 100);
        onProgress(this.overallProgressLoad);
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
