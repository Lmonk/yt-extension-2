declare module 'color-thief-node' { 
  export function getColorFromURL(imageURL: string, quality?: number): Promise<[number, number, number]>;
  export function getPaletteFromURL(imageURL: string, colorCount?: number, quality?: number): Promise<[number, number, number][]>;
}