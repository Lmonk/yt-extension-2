import { Color } from "@/models";
import ColorThief from "color-thief-ts";

export function onPageLoaded() {
  chrome.runtime.sendMessage({ type: 'PAGE_IS_LOADED', }, function(response) {
    const { success, tabVideoIds } = response;

    if(success) {
      getVideoColors(tabVideoIds);
    }
  });
};

export async function getVideoColors(tabVideoIds: {[key: number]: string}) {
  console.log('GET_TEXT_COLORS time', Date.now());
  const result: {[key: number]: Color[] | null} = {};
  console.log('GET_TEXT_COLORS', tabVideoIds)
  const colorThief = new ColorThief();
  
  const results = await Promise.all(
    Object.keys(tabVideoIds).map(Number).map(async (id: number) => {
      const imgUrl = `https://img.youtube.com/vi/${tabVideoIds[id]}/hqdefault.jpg`;
      const colors = await colorThief.getPaletteAsync(imgUrl, 5, {colorType: "array"});
      return { id, colors };
    })
  );

  results.forEach(({ id, colors }) => {
    result[id] = colors;
  });

  console.log('GET_TEXT_COLORS_RESULT', result)
  chrome.runtime.sendMessage({ type: 'SET_VIDEO_COLORS', result });
}