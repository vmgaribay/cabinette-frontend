import { setFilterUnitcodes } from "../filterSlice";
import { makeSelectVisibleSiteIDs } from "../selector";

const scoredSites = [
  { id: "site1", parks_within_30_mi_unitcodes: "JOTR, LOTR", score: 1 },
  { id: "site2", parks_within_30_mi_unitcodes: "JOTR", score: 2 },
  { id: "site3", parks_within_30_mi_unitcodes: "LOTR", score: 3 },
];

test("returns all site IDs when showBookmarkedOnly is false and no unitcodes are filtered", () => {
    const state = {
      filter: {
        filterUnitcodes: [],
        showBookmarkedOnly: false,
      },
      bookmarks: { siteIds: ["site2"] },
    };
    const selectVisibleSiteIDs = makeSelectVisibleSiteIDs();
    expect(selectVisibleSiteIDs(state, scoredSites)).toEqual(["site1", "site2", "site3"]);
  });

test("returns only bookmarked site IDs when showBookmarkedOnly is true", () => {
    const state = {
      filter: {
        filterUnitcodes: ["JOTR","LOTR"],
        showBookmarkedOnly: true,
      },
      bookmarks: { siteIds: ["site2", "site3"] },
    };
    const selectVisibleSiteIDs = makeSelectVisibleSiteIDs();
    expect(selectVisibleSiteIDs(state, scoredSites)).toEqual(["site2", "site3"]);
  });

test("returns complete array if no filtered unitcodes", () => {
    const state = {
      filter: {
        filterUnitcodes: [],
        showBookmarkedOnly: false,
      },
      bookmarks: { siteIds: ["site2"] },
    };
    const selectVisibleSiteIDs = makeSelectVisibleSiteIDs();
    expect(selectVisibleSiteIDs(state, scoredSites)).toEqual(["site1", "site2", "site3"]);
  });

test("returns empty array if no bookmarks and showBookmarkedOnly is true", () => {
    const state = {
      filter: {
        filterUnitcodes: ["JOTR", "LOTR"],
        showBookmarkedOnly: true,
      },
      bookmarks: { siteIds: [] },
    };
    const selectVisibleSiteIDs = makeSelectVisibleSiteIDs();
    expect(selectVisibleSiteIDs(state, scoredSites)).toEqual([]);
  });
