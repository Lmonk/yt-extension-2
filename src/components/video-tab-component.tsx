import { CloseIcon } from "@/assets/images/icons";

type VideoComponentProps = {
  tab: number
  index: number
}

function VideoTabComponent({ tab, index }: VideoComponentProps) {

  const closeTab = (tab: number) => {
    chrome.runtime.sendMessage({ type: 'CLOSE_TAB_SW', payload: { tabId: tab }}, function() {
      console.log(`Tab ${tab} is closed`);
    });
  }

  return (
    <div className="border border-solid border-gray-500 cursor-pointer py-1 pl-2 pr-6 rounded-md relative mt-1 mr-2 min-w-18">
      <div className="text-xs text-white font-semibold">{`Tab-${index + 1}`}</div>
      <div className="w-2 fill-white absolute top-1/2 right-1 cursor-pointer -translate-y-1/2 hover:opacity-60" onClick={() => closeTab(tab)}><CloseIcon /></div>
    </div>
  )
}

export default VideoTabComponent;