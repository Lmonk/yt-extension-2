// import { useCallback } from 'react';
import { Video } from '@/models';
import { useDispatch } from 'react-redux';
import { setTabs } from '@/redux/tabsSlice';

const getStorageVideoMap = () => {
  const savedState = localStorage.getItem('videoMap');
  let result = {};

  if (savedState) {
    result = JSON.parse(savedState) as { [key: string]: Video };
    console.log(result);
  }

  return result; // Default initial state
};

const useLocalStorage = () => {
  const dispatch = useDispatch();
  const tabs = getStorageVideoMap();

  dispatch(setTabs(tabs));

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.storageArea === localStorage) {
      console.log(localStorage);
  
      dispatch(setTabs(JSON.parse(localStorage.videoMap)));
    }
  };
  
  window.addEventListener('storage', handleStorageEvent, false);

return () => {
  window.removeEventListener('storage', handleStorageEvent);
}
  // const addVideoMap = useCallback(
  //   (video: Video) => {
  //     setVideoMap((prevState: Map<string, Video>) => {
  //       const newMap = new Map(prevState);
          
  //       return newMap.set(video.url, video);
  //     })
  //   }, 
  //   [setVideoMap]
  // );
}

const localStorageHooks = {
  useLocalStorage
};

export default localStorageHooks;