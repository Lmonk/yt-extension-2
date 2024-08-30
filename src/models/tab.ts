import { Video } from '@/models/video';

export interface Tab {
  title: string;
  video: Video;
  url: string;
  windowId: number;
  lastAccessed?: number;
  date: number;
}

export interface Tabs {
  [key: number]: Tab;
}

export interface TabItem extends Tab { 
  id: number; 
};

export interface TabPayload extends Tab { 
  tabId: number; 
};

export interface TabCreatePayload {
  tabId: number;
  title: string;
  url: string;
  video: Video;
  windowId: number;
  lastAccessed?: number;
  date: number;
}

export interface TabUpdatePayload {
  tabId: number;
  title: string;
  url: string;
  video: Video;
  windowId: number;
  lastAccessed?: number;
  date: number;
}