import {createWrapStore} from 'webext-redux';
import { store } from '../redux/store.ts';
import { likeVideoListener, dislikeVideoListener, closeTabListener, togglePlayVideoListener, updateTabDataListener } from '@/background-scripts/event-listeners.ts';
import { handleTabCreated, handleTabUpdated, handleTabRemoved, initializeTabs } from '@/background-scripts/tab-events-handlers.ts';
import { BgMessage, BgMessageEnum, BgMessageHandler } from '@/models';
import '@/background-scripts/messages-from-content.ts';
// import { setTextColors } from '@/redux/tabsSlice.ts';
import { getVideoId } from '@/utils/video.ts';
import { setVideoColors } from '@/redux/tabsSlice.ts';

const wrapStore = createWrapStore();
wrapStore(store);

const messageHandlers: { [K in BgMessageEnum]: BgMessageHandler<Extract<BgMessage, { type: K }>> } = {
  [BgMessageEnum.LIKE_VIDEO]: likeVideoListener,
  [BgMessageEnum.DISLIKE_VIDEO]: dislikeVideoListener,
  [BgMessageEnum.CLOSE_TAB]: closeTabListener,
  [BgMessageEnum.UPDATE_TAB_DATA]: updateTabDataListener,
  [BgMessageEnum.TOGGLE_PLAY_VIDEO]: togglePlayVideoListener
};

initializeTabs();

chrome.tabs.onCreated.addListener(handleTabCreated);
chrome.tabs.onUpdated.addListener(handleTabUpdated);
chrome.tabs.onRemoved.addListener(handleTabRemoved);

chrome.runtime.onMessage.addListener(<K extends BgMessageEnum>(message: Extract<BgMessage, { type: K }>, sender: chrome.runtime.MessageSender, sendResponse: () => void) => {
  const handler = messageHandlers[message.type];

  if (handler) {
    handler(message, sender, sendResponse);
  } else {
    console.warn(`No handler found for message type: ${message.type}`);
  }
  
  return true; 
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.type === 'PAGE_IS_LOADED') {
    if (sender.tab && sender.tab.id !== undefined) {      
      chrome.tabs.query({}, (tabs) => {
        const tabVideoIds: {[key: number]: string} = {};
        tabs.forEach((tab) => {
          const { url, id } = tab;
          if(url && id) {
            const videoId = getVideoId(url);

            if (videoId) {
              tabVideoIds[id] = videoId;
            }
          }
        });
        sendResponse({ success: true, tabVideoIds });
      });
      return true;
    }
  }  
});

chrome.runtime.onMessage.addListener((message) => {
  if(message.type === 'SET_VIDEO_COLORS') {
    store.dispatch(setVideoColors({...message.result}));
    console.log('SET_VIDEO_COLORS', message.result)
  }
})

// Example usage: Trigger an action when any tab with 'example.com' is loaded
// function onYoutubeLoaded(tabId: number) {
//   chrome.tabs.query({}, (tabs) => {
//     const tabVideoIds: {[key: number]: string} = {};
//     tabs.forEach((tab) => {
//       const { url, id } = tab;
//       if(url && id) {
//         const videoId = getVideoId(url);

//         if (videoId) {
//           tabVideoIds[id] = videoId;
//         }
//       }
//     });

//     console.log(tabId, tabVideoIds);
//     console.log('GET_TEXT_COLORS time', Date.now());
//     chrome.tabs.sendMessage(tabId, { type: 'GET_TEXT_COLORS', tabVideoIds }, (response) => {
//       if (chrome.runtime.lastError) {
//         console.error('Error sending message to tab:', chrome.runtime.lastError);
//       } else if (response && response.success) {
//         store.dispatch(setTextColors(response.result));    
//         console.log('Got video colors.');
//       } else {
//         console.error('Failed to get video colors:', response?.error);
//       }
//     });
//     return true;
//   });
//   console.log(`A tab with youtube url was loaded! Tab ID: ${tabId}`);
// };