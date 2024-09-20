import { createWrapStore } from "webext-redux";
import { store } from "../redux/store.ts";
import {
  likeVideoListener,
  dislikeVideoListener,
  closeTabListener,
  togglePlayVideoListener,
  updateTabDataListener,
} from "@/background-scripts/event-listeners.ts";
import {
  handleTabCreated,
  handleTabUpdated,
  handleTabRemoved,
  initializeTabs,
} from "@/background-scripts/tab-events-handlers.ts";
import { BgMessage, BgMessageEnum, BgMessageHandler } from "@/models";
import "@/background-scripts/messages-from-content.ts";
import { getVideoId } from "@/utils/video.ts";
import { setVideoColors } from "@/redux/tabsSlice.ts";

const wrapStore = createWrapStore();
wrapStore(store);

initializeTabs();

// chrome.storage.local.get(["initialized"], (result) => {
//   console.log(result);
//   if (!result.initialized) {
//     // Run store wrapper for the first session
//     wrapStore(store);

//     initializeTabs();
//     // Set the firstSession flag to prevent future runs in this session
//     chrome.storage.local.set({ initialized: true }, () => {
//       const currentTime = new Date();
//       const hours = currentTime.getHours().toString().padStart(2, "0"); // Ensures 2 digits
//       const minutes = currentTime.getMinutes().toString().padStart(2, "0");
//       const seconds = currentTime.getSeconds().toString().padStart(2, "0");
//       console.log(`Current Time: ${hours}:${minutes}:${seconds}`);
//       console.log("firstSession flag set for this session.");
//     });
//   } else {
//     console.log("Store wrapper already initialized in this session.");
//   }
// });

chrome.windows.onRemoved.addListener((windowId) => {
  console.log(`Window ${windowId} closed`);

  chrome.windows.getAll({}, (windows) => {
    if (windows.length === 0) {
      console.log("All windows closed. Likely browser shutdown.");
      chrome.storage.local.set({ initialized: false }, () => {
        console.log("Set initialized false.");
      });
    }
  });
});

const messageHandlers: {
  [K in BgMessageEnum]: BgMessageHandler<Extract<BgMessage, { type: K }>>;
} = {
  [BgMessageEnum.LIKE_VIDEO]: likeVideoListener,
  [BgMessageEnum.DISLIKE_VIDEO]: dislikeVideoListener,
  [BgMessageEnum.CLOSE_TAB]: closeTabListener,
  [BgMessageEnum.UPDATE_TAB_DATA]: updateTabDataListener,
  [BgMessageEnum.TOGGLE_PLAY_VIDEO]: togglePlayVideoListener,
};

chrome.tabs.onCreated.addListener(handleTabCreated);
chrome.tabs.onUpdated.addListener(handleTabUpdated);
chrome.tabs.onRemoved.addListener(handleTabRemoved);

chrome.runtime.onMessage.addListener(
  <K extends BgMessageEnum>(
    message: Extract<BgMessage, { type: K }>,
    sender: chrome.runtime.MessageSender,
    sendResponse: () => void
  ) => {
    const handler = messageHandlers[message.type];

    if (handler) {
      handler(message, sender, sendResponse);
    } else {
      console.warn(`No handler found for message type: ${message.type}`);
    }

    return true;
  }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PAGE_IS_LOADED") {
    if (sender.tab && sender.tab.id !== undefined) {
      chrome.tabs.query({}, (tabs) => {
        const tabVideoIds: { [key: number]: string } = {};
        tabs.forEach((tab) => {
          const { url, id } = tab;
          if (url && id) {
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
  if (message.type === "SET_VIDEO_COLORS") {
    console.log("SET_VIDEO_COLORS", message.result);
    store.dispatch(setVideoColors({ ...message.result }));
  }
});
