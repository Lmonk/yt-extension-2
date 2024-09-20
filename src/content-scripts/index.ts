import {
  filterOutShorts,
  filterOutShortsFromRecomendations,
} from "./default.ts";
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

  // chrome.runtime.sendMessage({ type: 'GET_ALL_VIDEO_IDS'}, async (response) => {
  //   console.log(response)
  //   const { videoIds } = response;
  //   const result: {[key: string]: number[] | null} = {};
  //   const colorThief = new ColorThief();

  //   const results = await Promise.all(
  //     videoIds.map(async (id: string) => {
  //       const imgUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  //       const colors = await colorThief.getPaletteAsync(imgUrl, 5, {colorType: "array"});

  //       return { id, colors };
  //     })
  //   );

  //   results.forEach(({ id, colors }) => {
  //     result[id] = colors;
  //   });

  //   console.log('GET_TEXT_COLORS_RESULT', result)
  //   chrome.runtime.sendMessage({ type: 'SET_TEXT_COLORS', payload: { textColors: result }})
  // });
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

function addEventListenerToShortsRecomendationElement() {
  const shortsRecomendationsElem = document.querySelector(
    "ytd-watch-next-secondary-results-renderer ytd-reel-shelf-renderer"
  );

  if (shortsRecomendationsElem) {
    shortsRecomendationsElem.addEventListener(
      "load",
      filterOutShortsFromRecomendations
    );
  } else {
    setTimeout(addEventListenerToShortsRecomendationElement, 1000);
  }
}

function removeEventListenerToShortsRecomendationElement() {
  const shortsRecomendationsElem = document.querySelector(
    "ytd-watch-next-secondary-results-renderer ytd-reel-shelf-renderer"
  );

  if (shortsRecomendationsElem) {
    shortsRecomendationsElem.removeEventListener(
      "load",
      filterOutShortsFromRecomendations
    );
  }
}

(function () {
  window.addEventListener("load", filterOutShorts);

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
    // chrome.runtime.sendMessage({ type: 'UPDATE_TAB_DATA_SW', payload: { isPlaying: true }});

    addEventListenerToVideoElement();
    addEventListenerToLikesElement();
    addEventListenerToShortsRecomendationElement();

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === "GET_VIDEO_STATUS") {
        const result = getVideoStatus();
        // console.log("GET_VIDEO_STATUS", result);
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
      // console.log(message, _sender);
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
    removeEventListenerToShortsRecomendationElement();
  });
})();
