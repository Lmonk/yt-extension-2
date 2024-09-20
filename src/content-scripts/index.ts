import { onPageLoaded } from "./tab.ts";
import { getVideoStatus } from "./video.ts";
import { BgMessageEnum, ContentMessagesEnum } from "@/models";
import { getVideoId } from "@/utils";

const togglePlay = (videoEl: HTMLMediaElement, isPlaying: boolean) => {
  if (isPlaying) {
    videoEl.pause();
  } else {
    videoEl.play();
  }
};

const playListener = () => {
  chrome.runtime.sendMessage({
    type: BgMessageEnum.UPDATE_TAB_DATA,
    payload: { isPlaying: true },
  });
};

const pauseListener = () => {
  chrome.runtime.sendMessage({
    type: BgMessageEnum.UPDATE_TAB_DATA,
    payload: { isPlaying: false },
  });
};

const likedListener = (event: Event, likeElement: HTMLElement) => {
  const videoId = getVideoId(window.location.href);
  const currentTarget = (event.currentTarget || likeElement) as HTMLElement;

  if (currentTarget) {
    chrome.runtime.sendMessage({
      type: BgMessageEnum.UPDATE_TAB_DATA,
      payload: { isLiked: currentTarget.ariaPressed === "true", videoId },
    });
  }
};

const dislikedListener = (event: Event, dislikedElement: HTMLElement) => {
  const videoId = getVideoId(window.location.href);
  const currentTarget = (event.currentTarget || dislikedElement) as HTMLElement;

  if (currentTarget) {
    chrome.runtime.sendMessage({
      type: BgMessageEnum.UPDATE_TAB_DATA,
      payload: { isDisliked: currentTarget.ariaPressed === "true", videoId },
    });
  }
};

function addEventListenerToVideoElement() {
  const videoElms = document.querySelectorAll("#player-container video");
  const videoEl = videoElms[0];

  if (videoEl) {
    videoEl.addEventListener("play", playListener);
    videoEl.addEventListener("pause", pauseListener);
  } else {
    setTimeout(addEventListenerToVideoElement, 1000);
  }
}

function removeEventListenerFromVideoElement() {
  const videoElms = document.querySelectorAll("#player-container video");
  const videoEl = videoElms[0];

  if (videoEl) {
    videoEl.removeEventListener("play", playListener);
    videoEl.removeEventListener("pause", pauseListener);
  }
}

function addEventListenerToLikesElement() {
  const likeElement = document.querySelector(
    "#primary-inner ytd-watch-metadata like-button-view-model button"
  ) as HTMLElement;
  const dislikeElement = document.querySelector(
    "#primary-inner ytd-watch-metadata dislike-button-view-model button"
  ) as HTMLElement;

  if (likeElement && dislikeElement) {
    likeElement.addEventListener("click", (event) =>
      likedListener(event, likeElement)
    );
    dislikeElement.addEventListener("click", (event) =>
      dislikedListener(event, dislikeElement)
    );
  } else {
    setTimeout(addEventListenerToLikesElement, 1000);
  }
}

function removeEventListenerFromLikesElement() {
  const likeElement = document.querySelector(
    "#primary-inner ytd-watch-metadata like-button-view-model button"
  );
  const dislikeElement = document.querySelector(
    "#primary-inner ytd-watch-metadata dislike-button-view-model button"
  );

  if (likeElement) {
    likeElement.removeEventListener("play", playListener);
  }

  if (dislikeElement) {
    dislikeElement.removeEventListener("pause", pauseListener);
  }
}

(function () {
  if (!window.location.href.startsWith("https://www.youtube.com/watch?v=")) {
    return;
  }

  window.addEventListener("load", () => {
    const videoState = getVideoStatus();

    chrome.runtime.sendMessage({
      type: BgMessageEnum.UPDATE_TAB_DATA,
      payload: { ...videoState },
    });
  });

  window.addEventListener("load", () => {
    addEventListenerToVideoElement();
    addEventListenerToLikesElement();

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === "GET_VIDEO_STATUS") {
        const result = getVideoStatus();
        if (result) {
          sendResponse({ success: true, result });
        } else {
          sendResponse({ success: false, error: "No video element found." });
        }
      }
    });

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === ContentMessagesEnum.TOGGLE_PLAY_VIDEO) {
        const videoElms = document.querySelectorAll("#player-container video");
        const videoEl = videoElms[0] as HTMLMediaElement;

        if (videoEl) {
          togglePlay(videoEl, message.isPlaying);
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: "No video element found." });
        }
      }
    });

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === ContentMessagesEnum.LIKE_VIDEO) {
        const likeElement = document.querySelector(
          "#primary-inner ytd-watch-metadata like-button-view-model button"
        ) as HTMLElement;

        if (likeElement) {
          likeElement.click();
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: "No video element found." });
        }
      }
    });

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === ContentMessagesEnum.DISLIKE_VIDEO) {
        const dislikeElement = document.querySelector(
          "#primary-inner ytd-watch-metadata dislike-button-view-model button"
        ) as HTMLElement;

        if (dislikeElement) {
          dislikeElement.click();
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: "No video element found." });
        }
      }
    });
  });

  window.addEventListener("load", onPageLoaded);

  window.addEventListener("beforeunload", () => {
    removeEventListenerFromVideoElement();
    removeEventListenerFromLikesElement();
  });
})();
