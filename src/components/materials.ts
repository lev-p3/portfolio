import * as THREE from "three";

type Surface = "wood" | "plaster" | "velvet" | "cloth";

function noise(x: number, y: number, seed: number) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 17.3) * 43758.5453;
  return value - Math.floor(value);
}

export function createSurface(surface: Surface, width = 256, height = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.Texture();
  const image = context.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const grain = noise(x, y, 11) - .5;
      const index = (y * width + x) * 4;
      let base: [number, number, number];
      if (surface === "wood") {
        const bands = Math.sin(y * .32 + Math.sin(x * .037) * 3 + noise(Math.floor(x / 20), Math.floor(y / 15), 4) * 1.3) * 10;
        const joints = y % 64 < 2 ? -25 : 0;
        base = [75 + bands + grain * 16 + joints, 48 + bands * .55 + grain * 12 + joints, 36 + bands * .4 + grain * 9 + joints];
      } else if (surface === "velvet") {
        const weave = ((x + y) % 3) * 1.5;
        base = [86 + grain * 15 + weave, 29 + grain * 9, 41 + grain * 11];
      } else if (surface === "cloth") {
        const threads = (x % 4 === 0 ? 7 : 0) + (y % 4 === 0 ? 5 : 0);
        base = [145 + grain * 8 + threads, 124 + grain * 8 + threads, 105 + grain * 7 + threads];
      } else {
        const mottling = noise(Math.floor(x / 7), Math.floor(y / 7), 8) * 16;
        base = [50 + grain * 7 + mottling, 43 + grain * 7 + mottling, 47 + grain * 7 + mottling];
      }
      image.data[index] = base[0];
      image.data[index + 1] = base[1];
      image.data[index + 2] = base[2];
      image.data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}
