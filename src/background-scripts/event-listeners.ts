import {
  CloseTabMessage,
  DislikeVideoMessage,
  LikeVideoMessage,
  BgMessageHandler,
  TogglePlayVideoMessage,
  UpdateTabDataMessage,
  BgMessageEnum,
  ContentMessagesEnum,
  UpdateVideoStatusPayload,
} from "@/models";
import { store } from "../redux/store.ts";
import { updateVideoStatusByTabId } from "@/redux/tabsSlice";

export const likeVideoListener: BgMessageHandler<LikeVideoMessage> = (
  message
) => {
  if (message.type === BgMessageEnum.LIKE_VIDEO) {
    chrome.tabs.sendMessage(
      message.payload.tabId,
      {
        type: ContentMessagesEnum.LIKE_VIDEO,
        isLiked: message.payload.isLiked,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error sending message to tab:",
            chrome.runtime.lastError
          );
        } else if (response && response.success) {
          console.log("Video liked successfully.");
        } else {
          console.error("Failed to trigger video play:", response?.error);
        }
      }
    );
  }
};

export const dislikeVideoListener: BgMessageHandler<DislikeVideoMessage> = (
  message
) => {
  if (message.type === BgMessageEnum.DISLIKE_VIDEO) {
    chrome.tabs.sendMessage(
      message.payload.tabId,
      {
        type: ContentMessagesEnum.DISLIKE_VIDEO,
        isDisliked: message.payload.isDisliked,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error sending message to tab:",
            chrome.runtime.lastError
          );
        } else if (response && response.success) {
          console.log("Video disliked successfully.");
        } else {
          console.error("Failed to trigger video play:", response?.error);
        }
      }
    );
  }
};

export const closeTabListener: BgMessageHandler<CloseTabMessage> = (
  message
) => {
  if (message.type === BgMessageEnum.CLOSE_TAB) {
    chrome.tabs.remove(message.payload.tabId, () => {
      if (chrome.runtime.lastError) {
        console.error("Error closing tab:", chrome.runtime.lastError);
      } else {
        console.log("Tab closed successfully");
      }
    });
  }
};

export const togglePlayVideoListener: BgMessageHandler<
  TogglePlayVideoMessage
> = (message) => {
  if (message.type === BgMessageEnum.TOGGLE_PLAY_VIDEO) {
    console.log("togglePlayVideoListener", message.payload);
    chrome.tabs.sendMessage(
      message.payload.tabId,
      {
        type: ContentMessagesEnum.TOGGLE_PLAY_VIDEO,
        isPlaying: message.payload.isPlaying,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error sending message to tab:",
            chrome.runtime.lastError
          );
        } else if (response && response.success) {
          console.log("Video play triggered successfully.");
        } else {
          console.error("Failed to trigger video play:", response?.error);
        }
      }
    );
  }
};

export const updateTabDataListener: BgMessageHandler<UpdateTabDataMessage> = (
  message,
  sender
) => {
  if (sender && sender.tab && sender.tab.url) {
    const { id: tabId } = sender.tab;

    if (!tabId) {
      return;
    }

    const tabUpdate: UpdateVideoStatusPayload = {
      video: {},
    };

    const { payload, type } = message;

    if (type === BgMessageEnum.UPDATE_TAB_DATA) {
      if (typeof payload.isPlaying !== "undefined") {
        tabUpdate.video.isPlaying = payload.isPlaying;
      }

      if (typeof payload.isLiked !== "undefined") {
        tabUpdate.video.isLiked = payload.isLiked;
        if (payload.isLiked) {
          tabUpdate.video.isDisliked = false;
        }
      }

      if (typeof payload.isDisliked !== "undefined") {
        tabUpdate.video.isDisliked = payload.isDisliked;
        if (payload.isDisliked) {
          tabUpdate.video.isLiked = false;
        }
      }

      store.dispatch(updateVideoStatusByTabId({ tabId, tabUpdate }));
    }
  }
};
