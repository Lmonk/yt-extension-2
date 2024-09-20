const isPaused = (videoElem: HTMLVideoElement) => {
  return videoElem.paused && !videoElem.ended;
};

const videoSelector = "#player-container #movie_player video.html5-main-video";
const likeSelector =
  "#primary-inner ytd-watch-metadata like-button-view-model button";
const dislikeSelector =
  "#primary-inner ytd-watch-metadata dislike-button-view-model button";

export const getVideoStatus = () => {
  const videoElement = document.querySelectorAll(
    videoSelector
  )[0] as HTMLVideoElement;
  const likeElement = document.querySelector(likeSelector);
  const dislikeElement = document.querySelector(dislikeSelector);

  if (!videoElement || !likeElement || !dislikeElement) {
    setTimeout(getVideoStatus, 1000);
  } else {
    const isPlaying = !isPaused(videoElement);
    const isLiked = likeElement.ariaPressed === "true";
    const isDisliked = dislikeElement.ariaPressed === "true";

    return { isPlaying, isLiked, isDisliked };
  }
};
