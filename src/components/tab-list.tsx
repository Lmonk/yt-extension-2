import { useMemo } from 'react';
import VideoComponent from '@/components/video-component';
import { videoColorsSelector } from '@/redux/tabsSlice';
import { useSelector } from 'react-redux';
import { TabItem } from '@/models';

interface VideoListProps {
  tabs: TabItem[]
}

function TabList({ tabs }: VideoListProps) {  
  const tabsAmount = useMemo(() => tabs.length, [tabs]);
  const videoColors = useSelector(videoColorsSelector);

  console.log(videoColors);
  return (
    <div>
      {tabsAmount > 0 ?
        <>
          {tabs.map(tab => (
            videoColors[tab.id] ? 
              <VideoComponent key={tab.id} tab={tab} textColors={videoColors[tab.id]}/>
              : null
          ))}
        </>
        : null
      }
    </div>
  );
}

export default TabList;