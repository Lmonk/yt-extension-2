const isPaused = (videoElem: HTMLVideoElement) => {
  return videoElem.paused && !videoElem.ended;
}

export const getVideoStatus = () => {
  const videoElement = document.querySelectorAll('#player-container #movie_player video.html5-main-video')[0] as HTMLVideoElement;
  const likeElement = document.querySelector('#primary-inner ytd-watch-metadata like-button-view-model button');
  const dislikeElement = document.querySelector('#primary-inner ytd-watch-metadata dislike-button-view-model button');
  console.log(videoElement, likeElement?.ariaPressed, dislikeElement?.ariaPressed)
  if(!videoElement || !likeElement || !dislikeElement) {
    setTimeout(getVideoStatus, 1000);
  } else {
    const isPlaying = !isPaused(videoElement);
    const isLiked = likeElement.ariaPressed === 'true';
    const isDisliked = dislikeElement.ariaPressed === 'true';

    return { isPlaying, isLiked, isDisliked };
  } 
}