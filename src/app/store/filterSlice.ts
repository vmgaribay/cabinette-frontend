/**
 * filterSlice.ts
 *
 * Redux slice to store controls for visible sites.
 *
 * State:
 * - filterUnitcodes: Array of selected park unitcodes.
 * - showBookmarkedOnly: Boolean to show only bookmarked sites.
 * - unitcodeFilteredSiteIDs: Array of site IDs filtered by NPS unitcodes.
 * - visibleSiteIDs: Array of currently visible site IDs.
 *
 * Actions:
 * - setFilterUnitcodes: Set unitcodes for filtering.
 * - setShowBookmarkedOnly: Toggle bookmarked sites filtering.
 * - setUnitcodeFilteredSiteIDs: Set site IDs filtered by NPS unitcodes.
 * - setVisibleSiteIDs: Set currently visible site IDs.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  filterUnitcodes: string[];
  showBookmarkedOnly: boolean;
}

const initialState: FilterState = {
  filterUnitcodes: [],
  showBookmarkedOnly: false,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilterUnitcodes(state, action: PayloadAction<string[]>) {
      state.filterUnitcodes = action.payload;
    },
    setShowBookmarkedOnly(state, action: PayloadAction<boolean>) {
      state.showBookmarkedOnly = action.payload;
    },
  },
});

export const { setFilterUnitcodes, setShowBookmarkedOnly } =
  filterSlice.actions;
export default filterSlice.reducer;
