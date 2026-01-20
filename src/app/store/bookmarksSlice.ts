/**
 * bookmarksSlice.ts
 *
 * Redux slice to manage bookmarked sites.
 * - Stores array of bookmarked site IDs.
 * - Enables bookmark toggling.
 * - Bookmarks persist in localStorage.
 *
 * State:
 * - siteIds: Array site IDs.
 *
 * Actions:
 * - setBookmarks: Replace bookmarks array.
 * - toggleBookmark: Add/remove a site from bookmarks.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookmarksState {
  siteIds: string[];
}

const initialState: BookmarksState = {
  siteIds: [],
};

const bookmarksSlice = createSlice({
  name: "cabinette_bookmarks",
  initialState,
  reducers: {
    setBookmarks(state, action: PayloadAction<string[]>) {
      state.siteIds = action.payload;
    },
    toggleBookmark(state, action: PayloadAction<string>) {
      const idx = state.siteIds.indexOf(action.payload);
      if (idx === -1) {
        state.siteIds.push(action.payload);
      } else {
        state.siteIds.splice(idx, 1);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "cabinette_bookmarks",
          JSON.stringify(state.siteIds),
        );
      }
    },
  },
});

export const { toggleBookmark, setBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
