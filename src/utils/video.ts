export const getVideoId = (url: string | URL) => {
  const urlObj = new URL(url);

  return urlObj.searchParams.get("v");
}