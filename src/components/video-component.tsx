// import { useState, useEffect } from 'react';
import { BgMessageEnum, TabItem } from '@/models';
import { PlayIcon, PauseIcon, LikedIcon, LikeIcon, DislikedIcon, DislikeIcon, CloseIcon } from '@/assets/images/icons';
import { Color } from '@/models';
import { sortColors, getTextAndBackgroundColors } from '@/utils';
import { useMemo } from 'react';

type VideoComponentProps = {
  tab: TabItem,
  textColors: Color[];
}

function VideoComponent({ tab, textColors }: VideoComponentProps) {
  const tmpColors = sortColors(textColors);
  const { textColor, backgroundColor } = getTextAndBackgroundColors(tmpColors[tmpColors.length - 1]);

  const bgColorCss = useMemo(() => {
    return `rgb(${backgroundColor[0]},${backgroundColor[1]},${backgroundColor[2]})`;
  }, [backgroundColor])

  const bgGradientCss = useMemo(() => {
    return `linear-gradient(to left, rgba(${backgroundColor[0]},${backgroundColor[1]},${backgroundColor[2]}, 1) 0%,
            rgba(${backgroundColor[0]},${backgroundColor[1]},${backgroundColor[2]}, 1) 15%, 
            rgba(${backgroundColor[0]},${backgroundColor[1]},${backgroundColor[2]}, 0) 18%),
            url("https://img.youtube.com/vi/${tab.video.id}/hqdefault.jpg")`;
  }, [tab, backgroundColor])

  const textColorCss = useMemo(() => {
    return `rgb(${textColor[0]},${textColor[1]},${textColor[2]})`;
  }, [textColor])

  const openVideoTab = (tab: TabItem) => {

    if(!tab) {
      return;
    }

    const tabId = tab.id;
    const { windowId } = tab;
    
    chrome.tabs.update(tabId, { active: true }, function() {
      chrome.windows.update(windowId, { focused: true }, () => {
        console.log('Tab with ID ' + tabId + ' and windowID' + windowId + ' is now active.');
      })
    });
  }

  const playVideo = (tab: TabItem) => {
    if(!tab) {
      return;
    }

    const { isPlaying } = tab.video;
    const tabId = tab.id;

    chrome.runtime.sendMessage({ type: BgMessageEnum.TOGGLE_PLAY_VIDEO, payload: { isPlaying, tabId }}, function() {
      console.log(`Video on tab ${tabId} is now ${!tab.video.isPlaying}`);
    });
  }

  const closeVideo = (tab: TabItem) => {
    if(!tab) {
      return;
    }

    const tabId = tab.id;
    chrome.runtime.sendMessage({ type: BgMessageEnum.CLOSE_TAB, payload: { tabId }}, function() {
      console.log(`Tab ${tabId} is closed`);
    });
  }

  const likeVideo = (tab: TabItem) => {
    if(!tab) {
      return;
    }

    const { isLiked, isDisliked } = tab.video;
    const tabId = tab.id;
    chrome.runtime.sendMessage({ type: BgMessageEnum.LIKE_VIDEO, payload: { tabId, isLiked, isDisliked }}, function() {
      console.log(`Tab ${tabId} is liked`);
    });
  }
  
  const dislikeVideo = (tab: TabItem) => {
    if(!tab) {
      return;
    }

    const { isLiked, isDisliked } = tab.video;
    const tabId = tab.id;
    chrome.runtime.sendMessage({ type: BgMessageEnum.DISLIKE_VIDEO, payload: { tabId, isLiked, isDisliked }}, function() {
      console.log(`Tab ${tabId} is disliked`);
    });
  }
  console.log('text color: ', textColor);
  return (
    // <div className="video-wrapper flex flex-row border-b border-gray-400 pr-4" style={{backgroundColor: `rgb(${textColors[2][0]},${textColors[2][1]},${textColors[2][2]})`}}>
    <div className="video-wrapper flex flex-row border-b border-gray-400 pr-4" style={{backgroundColor: bgColorCss}}>
      <div className="w-48 h-36 relative flex-shrink-0 cursor-pointer">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{
          backgroundImage: bgGradientCss,
          backgroundSize: '140% auto',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}>
        </div>
        {/* <div className="opacity-0 hover:opacity-80 duration-300 absolute inset-0 z-10 flex flex-col justify-center items-center bg-black">
        </div> */}
      </div>      
      {/* <img 
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          ref={imageRef}
        /> */}
      <div className="pl-2 pr-6 relative flex-grow overflow-hidden">
        <div className="w-4 h-4 fill-white absolute top-0 right-0 cursor-pointer hover:opacity-60" onClick={() => closeVideo(tab)}><CloseIcon /></div>
        <div className="text-sm text-white font-semibold mb-1 cursor-pointer hover:underline" style={{color: textColorCss}} onClick={() => openVideoTab(tab)}>{tab.title}</div>
        <div className="flex flex-row">
          <div className="w-4 h-4 fill-white rotate-y-180 m-1 cursor-pointer hover:opacity-60" onClick={() => likeVideo(tab)}>{tab.video.isLiked ? <LikedIcon /> : < LikeIcon />}</div>
          <div className="ml-2 w-4 h-4 fill-white cursor-pointer m-1"  onClick={() => playVideo(tab)}>{tab.video.isPlaying ? <PauseIcon /> : <PlayIcon />}</div>
          <div className="ml-2 w-4 h-4 fill-white m-1 cursor-pointer hover:opacity-60" onClick={() => dislikeVideo(tab)}>{tab.video.isDisliked ? <DislikedIcon /> : <DislikeIcon />}</div>
        </div>
      </div>
    </div>
  );
}

export default VideoComponent;