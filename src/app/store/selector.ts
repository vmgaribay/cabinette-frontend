/**
 * selector.ts
 *
 * Redux selectors for filtering visible site IDs based on filter state.
 * - Provides memoized selectors to cache results.
 * - Determines which sites to display on the map.
 */
import { createSelector } from "@reduxjs/toolkit";

/**
 * selectVisibleSiteIDs
 *
 * Selector that returns the list of visible site IDs for the map
 * filtered by unit code and (optionally) by bookmarked status.
 *
 * @param {Object} state - The Redux state.
 * @returns {string[]} Array of visible site IDs.
 */
export const selectVisibleSiteIDs = createSelector(
  [
    (state) => state.filter.unitcodeFilteredSiteIDs,
    (state) => state.filter.showBookmarkedOnly,
    (state) => state.bookmarks.siteIds,
  ],
  (unitcodeFilteredSiteIDs, showBookmarkedOnly, bookmarkedIDs) => {
    if (showBookmarkedOnly) {
      return unitcodeFilteredSiteIDs.filter((id: string) =>
        bookmarkedIDs.includes(id),
      );
    }
    return unitcodeFilteredSiteIDs;
  },
);
