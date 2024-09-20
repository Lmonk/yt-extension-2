import { Video } from "@/models";
import { useDispatch } from "react-redux";
import { setTabs } from "@/redux/tabsSlice";

const getStorageVideoMap = () => {
  const savedState = localStorage.getItem("videoMap");
  let result = {};

  if (savedState) {
    result = JSON.parse(savedState) as { [key: string]: Video };
  }

  return result; // Default initial state
};

const useLocalStorage = () => {
  const dispatch = useDispatch();
  const tabs = getStorageVideoMap();

  dispatch(setTabs(tabs));

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.storageArea === localStorage) {
      dispatch(setTabs(JSON.parse(localStorage.videoMap)));
    }
  };

  window.addEventListener("storage", handleStorageEvent, false);

  return () => {
    window.removeEventListener("storage", handleStorageEvent);
  };
};

const localStorageHooks = {
  useLocalStorage,
};

export default localStorageHooks;
