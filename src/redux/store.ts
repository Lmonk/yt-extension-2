import { configureStore } from "@reduxjs/toolkit";
import { tabsReducer } from "@/redux/tabsSlice";

export const store = configureStore({
  reducer: {
    tabs: tabsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
