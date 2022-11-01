function checkRowIsBlank(imageData: ImageData, y: number): boolean {
  for (let x = 0; x < imageData.width; ++x) {
    if (imageData.data[y * imageData.width * 4 + x * 4 + 3] !== 0) return false;
  }
  return true;
}

function checkColumnIsBlank(imageData: ImageData, x: number, y1: number, y2: number): boolean {
  for (let y = y1; y < y2; ++y) {
    if (imageData.data[y * imageData.width * 4 + x * 4 + 3] !== 0) return false;
  }
  return true;
}

export function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const context = canvas.getContext('2d');

  if (!context) throw new Error('Context 2d not exist');

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let x1 = 0;
  let y1 = 0;
  let x2 = imageData.width;
  let y2 = imageData.height;

  while (y1 < y2 && checkRowIsBlank(imageData, y1)) ++y1;
  while (y2 - 1 > y1 && checkRowIsBlank(imageData, y2 - 1)) --y2;
  while (x1 < x2 && checkColumnIsBlank(imageData, x1, y1, y2)) ++x1;
  while (x2 - 1 > x1 && checkColumnIsBlank(imageData, x2 - 1, y1, y2)) --x2;

  if ((y2 - y1) <= 0 || (x2 - x1) <= 0) {
    return canvas;
  }

  const trimmedImageData = context.getImageData(x1, y1, x2 - x1, y2 - y1);
  const resultCanvas = canvas.ownerDocument.createElement('canvas');
  const resultCanvasContext = resultCanvas.getContext('2d');

  if (!resultCanvasContext) throw new Error('Context 2d not exist');

  resultCanvas.width = trimmedImageData.width;
  resultCanvas.height = trimmedImageData.height;
  resultCanvasContext.putImageData(trimmedImageData, 0, 0);

  return resultCanvas;
}
