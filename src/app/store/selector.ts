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

import { RootState } from "./store";
import { SiteInfoRow } from "../types";

export const makeSelectVisibleSiteIDs = () =>
  createSelector(
    [
      (_: RootState, scoredSites: SiteInfoRow[]) => scoredSites,
      (state: RootState) => state.filter.filterUnitcodes,
      (state: RootState) => state.filter.showBookmarkedOnly,
      (state: RootState) => state.bookmarks.siteIds,
    ],
    (scoredSites, filterUnitcodes, showBookmarkedOnly, bookmarkedIDs) => {
      let filtered = scoredSites;

      if (showBookmarkedOnly) {
        if (bookmarkedIDs.length === 0) return [];
        filtered = filtered.filter((site) => bookmarkedIDs.includes(site.id));
      }
      if (filterUnitcodes.length > 0) {
        filtered = filtered.filter((site) => {
          const siteUnitcodes = site.parks_within_30_mi_unitcodes
            ? site.parks_within_30_mi_unitcodes.split(",").map((s) => s.trim())
            : [];
          return filterUnitcodes.some((code) => siteUnitcodes.includes(code));
        });
      }
      return filtered.map((site) => site.id);
    },
  );
