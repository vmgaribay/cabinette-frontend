/**
 * store.ts
 *
 * Redux store configuration.
 * - Combines slices.
 * - Exports store, RootState, and AppDispatch types.
 *
 * Slices:
 * - bookmarks: Manages bookmarked site IDs.
 * - theme: Manages current theme.
 *
 * Exports:
 * - store: Configured Redux store instance.
 * - RootState: Type for Redux state.
 * - AppDispatch: Type for Redux dispatch.
 */
import { configureStore } from "@reduxjs/toolkit";
import bookmarksReducer from "./bookmarksSlice";
import themeReducer from "./themeSlice";
import filterReducer from "./filterSlice";

export const store = configureStore({
  reducer: {
    bookmarks: bookmarksReducer,
    theme: themeReducer,
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
