import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import {
  Tabs,
  Color,
  TabItem,
  TabCreatePayload,
  UpdateVideoStatusPayload,
} from "@/models";

export interface TabsSlice {
  tabsMap: Tabs;
  activeTabs: number[];
  videoColors: { [key: string]: Color[] };
}

const initialState: TabsSlice = {
  tabsMap: {},
  activeTabs: [],
  videoColors: {},
};

const slice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setTabs: (state, action: PayloadAction<Tabs>) => {
      console.log("setTabs", action.payload);
      return {
        ...state,
        tabsMap: action.payload,
      };
    },
    setActiveTabs: (state, action: PayloadAction<number[]>) => ({
      ...state,
      activeTabs: action.payload,
    }),
    setVideoColors: (
      state,
      action: PayloadAction<{ [key: string]: Color[] }>
    ) => ({ ...state, videoColors: action.payload }),
    addTabById: (state, action: PayloadAction<TabCreatePayload>) => {
      const { tabId, ...restPayload } = action.payload;

      return {
        ...state,
        tabsMap: {
          ...state.tabsMap,
          [tabId]: {
            ...restPayload,
          },
        },
      };
    },
    updateVideoStatusByTabId: (
      state,
      action: PayloadAction<{
        tabId: number;
        tabUpdate: UpdateVideoStatusPayload;
      }>
    ) => {
      const { tabId, tabUpdate } = action.payload;
      const { video, ...restUpdate } = tabUpdate;

      return {
        ...state,
        tabsMap: {
          ...state.tabsMap,
          [tabId]: {
            ...state.tabsMap[tabId],
            ...restUpdate,
            video: {
              ...state.tabsMap[tabId].video,
              ...video,
            },
          },
        },
      };
    },
    removeTabById: (state, action: PayloadAction<{ tabId: number }>) => {
      const { tabId } = action.payload;
      const newTabsMap = { ...state.tabsMap };

      delete newTabsMap[tabId];

      return {
        ...state,
        tabsMap: newTabsMap,
      };
    },
  },
});

export const tabsReducer = slice.reducer;
export const {
  setTabs,
  setActiveTabs,
  addTabById,
  updateVideoStatusByTabId,
  removeTabById,
  setVideoColors,
} = slice.actions;

export const tabsSelector = (state: RootState) => state.tabs.tabsMap;
export const videoColorsSelector = (state: RootState) => state.tabs.videoColors;

export const activeTabsSelector = createSelector(
  [tabsSelector],
  (tabs: Tabs): TabItem[] => {
    if (!tabs) {
      return [];
    }

    const keys = Object.keys(tabs).map(Number);
    const activeVideosIds = keys.filter((key) => tabs[key].lastAccessed);
    const activeTabs: TabItem[] = [];
    activeVideosIds.forEach((id) => activeTabs.push({ id, ...tabs[id] }));

    return activeTabs;
  }
);

export const inactiveTabsSelector = createSelector(
  [tabsSelector],
  (tabs: Tabs): TabItem[] => {
    if (!tabs) {
      return [];
    }

    const keys = Object.keys(tabs).map(Number);
    const activeTabIds = keys.filter((key) => !tabs[key].lastAccessed);
    const activeTabs: TabItem[] = [];
    activeTabIds.forEach((id) => activeTabs.push({ id, ...tabs[id] }));

    return activeTabs;
  }
);
