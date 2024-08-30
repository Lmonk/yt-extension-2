import StatisticPage from '@/pages/StatisticPage.tsx';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ExtensionPopup from '@/pages/ExtensionPopup';
// import localStorageHooks from '@/hooks/localStorage.hooks'
// import { useDispatch } from 'react-redux';
// import { setVideoId } from '@/redux/tabsSlice';
// import { getVideoId } from '@/utils';

function App() {  
  // const dispatch = useDispatch();
  // localStorageHooks.useLocalStorage();

  // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //   const url = tabs[0].url;
  
  //   if(url) {
  //     const videoId = getVideoId(url);

  //     if(videoId) {
  //       dispatch(setVideoId(videoId));
  //     }
  //   }
  // });

  return (
    <Router>
      <Routes>
        <Route index path="/" element={<ExtensionPopup />} />
        <Route path="/statistic-page" element={<StatisticPage />} />
      </Routes>
    </Router>
  )
}

export default App;
