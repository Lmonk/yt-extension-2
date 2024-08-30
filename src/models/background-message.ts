export enum BgMessageEnum {
  LIKE_VIDEO = 'LIKE_VIDEO_SW',
  DISLIKE_VIDEO = 'DISLIKE_VIDEO_SW',
  CLOSE_TAB = 'CLOSE_TAB_SW',
  UPDATE_TAB_DATA = 'UPDATE_TAB_DATA_SW',
  TOGGLE_PLAY_VIDEO = 'TOGGLE_PLAY_VIDEO_SW'
};

export type TogglePlayVideoMessage = {
  type: typeof BgMessageEnum.TOGGLE_PLAY_VIDEO,
  payload: {
    tabId: number;
    isPlaying: boolean;
  };
}

export type LikeVideoMessage = {
  type: typeof BgMessageEnum.LIKE_VIDEO,
  payload: {
    tabId: number;
    isLiked: boolean;
  };
}

export type DislikeVideoMessage = {
  type: typeof BgMessageEnum.DISLIKE_VIDEO,
  payload: {
    tabId: number;
    isDisliked: boolean;
  };
}

export type CloseTabMessage = {
  type: typeof BgMessageEnum.CLOSE_TAB,
  payload: {
    tabId: number;
  };
}

export type UpdateTabDataMessage = {
  type: typeof BgMessageEnum.UPDATE_TAB_DATA,
  payload: {
    tabId: number;
    isPlaying?: boolean;
    isLiked?: boolean;
    isDisliked?: boolean;
  };
}

export type BgMessage = 
  | LikeVideoMessage 
  | DislikeVideoMessage 
  | CloseTabMessage 
  | UpdateTabDataMessage 
  | TogglePlayVideoMessage;

export type BgMessageHandler<T extends BgMessage> = (
  message: T, 
  sender?: chrome.runtime.MessageSender, 
  sendResponse?: () => void
) => void;
