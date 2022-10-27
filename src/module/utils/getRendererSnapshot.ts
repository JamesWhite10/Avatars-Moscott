import { WebGLRenderer } from 'three';
import { trimCanvas } from './trimCanvas';

export type GetRendererSnapshotParams = {
  trim?: boolean;
  renderer: WebGLRenderer;
};

export function getRendererSnapshot(params: GetRendererSnapshotParams): string {
  const dataUrlType = 'image/png';
  let snapshotBase64 = '';

  const { trim, renderer } = params;

  if (!trim) {
    snapshotBase64 = renderer.domElement.toDataURL(dataUrlType);
  } else {
    const canvas2d = document.createElement('canvas');
    const context2d = canvas2d.getContext('2d');

    if (!context2d) throw new Error('Context2d not exist');

    canvas2d.width = renderer.domElement.width;
    canvas2d.height = renderer.domElement.height;

    context2d.drawImage(renderer.domElement, 0, 0);
    snapshotBase64 = trimCanvas(canvas2d).toDataURL(dataUrlType);
  }

  return snapshotBase64;
}
