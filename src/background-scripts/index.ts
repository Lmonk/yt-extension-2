import { createWrapStore } from "webext-redux";
import { store } from "@/redux/store";
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
import { setTabs, setVideoColors } from "@/redux/tabsSlice.ts";
import { throttle } from "@/utils/helpers";

const wrapStore = createWrapStore();

wrapStore(store);

const saveState = () => {
  const state = store.getState();

  chrome.storage.local.set({ state });
};

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

// Function to get chrome storage items as a Promise
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getChromeStorage = (keys: string[]): Promise<any> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, resolve);
  });
};

// Get both chrome.storage.local items
const loadInitialState = async () => {
  const [{ state }] = await Promise.all([getChromeStorage(["state"])]);
  if (state?.tabs) {
    const { tabsMap, videoColors } = state.tabs;

    // Dispatch tabsMap if not empty
    store.dispatch(setTabs(tabsMap));

    // Dispatch videoColors if not empty
    store.dispatch(setVideoColors(videoColors));
    initializeTabs();

    // Now subscribe to store changes and save state
    const [throttledSave] = throttle(saveState, 1000);
    store.subscribe(throttledSave);
  }
};

// Run the function to load initial state and set up store subscription
loadInitialState();
