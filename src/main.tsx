import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { Store } from "webext-redux";
import App from "@/App.tsx";
import "@/index.css";

// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//   const url = tabs[0].url;

//   if(url) {
//     const currentUrl = new URL(url);

//     if (!currentUrl.searchParams.has('v') && currentUrl.protocol !== "chrome-extension:") {
//       window.close();
//     }
//   }
// });

const store = new Store();

store.ready().then(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).store = store;

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
});
