import {
  addTabById,
  removeTabById,
  setActiveTabs,
  setTabs,
} from "@/redux/tabsSlice";
import { store } from "@/redux/store.ts";
import { getVideoId } from "@/utils";
import { TabCreatePayload, Tabs } from "@/models";

export const handleTabCreated = async (tab: chrome.tabs.Tab) => {
  const { id, windowId, lastAccessed } = tab;
  if (id) {
    const date = Date.now();
    const tabData = await chrome.tabs.get(id);

    if (tabData.url && tabData.title) {
      const videoId = getVideoId(new URL(tabData.url));

      if (videoId) {
        const tabToCreate: TabCreatePayload = {
          tabId: id,
          title: tabData.title,
          url: tabData.url,
          windowId,
          date,
          video: {
            id: videoId,
            isPlaying: false,
            isLiked: false,
            isDisliked: false,
          },
        };

        if (lastAccessed) {
          tabToCreate.lastAccessed = lastAccessed;
        }
        console.log("tab create", tabToCreate);

        store.dispatch(addTabById({ ...tabToCreate }));
      }
    }
  }
};

export const handleTabUpdated = async (
  _tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => {
  if (changeInfo.status === "complete") {
    const { id, url, title, windowId, lastAccessed } = tab;

    if (id && url && title) {
      const videoId = getVideoId(new URL(url));
      const date = Date.now();

      if (videoId) {
        const tabToUpdate: TabCreatePayload = {
          tabId: id,
          title,
          url,
          windowId,
          date,
          video: {
            id: videoId,
            isPlaying: true,
            isLiked: false,
            isDisliked: false,
          },
        };

        if (lastAccessed) {
          tabToUpdate.lastAccessed = lastAccessed;
        }

        console.log("tab update", tabToUpdate);
        store.dispatch(addTabById({ ...tabToUpdate }));
      }
    }
  }
};

export const handleTabRemoved = (tabId: number) => {
  console.log(`Tab with ID ${tabId} was closed.`);
  store.dispatch(removeTabById({ tabId }));
};

export const initializeTabs = () => {
  const activeIds: number[] = [];

  chrome.tabs.query({ active: true }, (tabs) => {
    // console.log("activeTabs", tabs);
    tabs.forEach((tab) => {
      const { url, id } = tab;
      if (url && id) {
        const videoId = getVideoId(url);

        if (videoId) {
          activeIds.push(id);
        }
      }
    });

    store.dispatch(setActiveTabs(activeIds));
  });

  chrome.tabs.query({}, (tabs) => {
    const tabsMap: Tabs = {};

    tabs.forEach((tab) => {
      const { url, id: tabId, title, windowId, lastAccessed } = tab;

      if (url && tabId && title && windowId) {
        const videoId = getVideoId(new URL(url));

        if (videoId) {
          tabsMap[tabId] = {
            lastAccessed,
            video: {
              id: videoId,
              isLiked: false,
              isDisliked: false,
              isPlaying: false,
            },
            windowId,
            date: Date.now(),
            title: title.replace(" - YouTube", ""),
            url,
          };
        }
      }
    });

    store.dispatch(setTabs(tabsMap));
  });
};
