import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { Store } from "webext-redux";
import App from "@/App.tsx";
import "@/index.css";

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
