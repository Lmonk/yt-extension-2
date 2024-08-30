import { useSelector } from 'react-redux';
import { ProfileIcon, SettingsIcon } from '@/assets/images/icons';
import TabList from '@/components/tab-list';
import SimpleBar from 'simplebar-react';
import { activeTabsSelector, inactiveTabsSelector } from '@/redux/tabsSlice';


function ExtensionPopup() {
  const activeTabs = useSelector(activeTabsSelector);
  const inactiveTabs = useSelector(inactiveTabsSelector);

  const openNewTab = async () => {
    chrome.tabs.create({ 'url': chrome.runtime.getURL('index.html#/statistic-page') });
  }

  return (
    <div className="popup-wrapper">
      <div className="container mx-auto py-4">
        <div className="flex flex-col">          
          <div className="px-4">
            <div className="flex justify-between mb-2">
              <div className="text-sm font-semibold text-white">Youtube Extension</div>
              <div className="flex flex-row">
                <div className="w-7 h-6 fill-white hover:opacity-60 cursor-pointer mr-2">
                  <SettingsIcon />
                </div>          
                <div className="w-5 h-6 fill-white hover:opacity-60 cursor-pointer" onClick={() => openNewTab()}>
                  <ProfileIcon />
                </div>
              </div>
            </div>
          </div>
          <SimpleBar className="videos-container">
            <div className="text-lg font-semibold text-white p-2 mb-2">Active videos:</div>
            <TabList tabs={activeTabs} />
            <div className="text-lg font-semibold text-white p-2 mb-2">Rest videos:</div>
            <TabList tabs={inactiveTabs}/>
          </SimpleBar>
        </div>
      </div>
    </div>
  );
}

export default ExtensionPopup;