import { addTabById, removeTabById, setActiveTabs, setTabs } from '@/redux/tabsSlice';
import { store } from '@/redux/store.ts';
import { getVideoId } from '@/utils';
import { TabCreatePayload, TabUpdatePayload, Tabs } from '@/models';

export const handleTabCreated = (tab: chrome.tabs.Tab) => {
  const { url, id, title, windowId, lastAccessed } = tab;
  if (id && url && title) {
    const videoId = getVideoId(new URL(url));   
    const date = Date.now();

    if (videoId) {
      const tabToCreate: TabCreatePayload = {
        tabId: id,
        title,
        url,
        windowId,
        date,
        video: {
          id: videoId,
          isPlaying: false,
          isLiked: false,
          isDisliked: false
        }
      };

      if(lastAccessed) {
        tabToCreate.lastAccessed = lastAccessed;
      }

      store.dispatch(addTabById({...tabToCreate}));
    }
  }
};

export const handleTabUpdated = (
  _tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => {
  const { id, title, windowId, lastAccessed } = tab;
  if (id && changeInfo.url && title) {
    const videoId = getVideoId(new URL(changeInfo.url));
    const date = Date.now();

    if (videoId) { 
      const tab: TabUpdatePayload = {        
        video: {
          id: videoId,
          isPlaying: false,
          isLiked: false,
          isDisliked: false
        },
        tabId: id,
        title,
        date,
        url: changeInfo.url,
        windowId,
        lastAccessed
      };

      store.dispatch(addTabById({...tab}));
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
    console.log('activeTabs', tabs)
    tabs.forEach((tab) => {
      const { url, id } = tab;
      if(url && id) {
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
    console.log(tabs);

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
              isPlaying: false
            },
            windowId,
            date: Date.now(),
            title: title.replace(' - YouTube', ''),
            url,
          };
        }
      }
    });
    
    store.dispatch(setTabs(tabsMap));
  });
};