import { getVideoId } from '@/utils';

chrome.runtime.onMessage.addListener((request: { type: string, url: URL | string }, _sender, sendResponse) => {
  if (request.type === 'GET_VIDEO_ID') {
    const videoId = getVideoId(request.url);
    if(videoId) {
      sendResponse({ success: true, videoId });
    }

    return true;
  }
});