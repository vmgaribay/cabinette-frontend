import { selectVisibleSiteIDs } from "../selector";

test("returns all site IDs when showBookmarkedOnly is false", () => {
    const state = {
      filter: {
        unitcodeFilteredSiteIDs: ["site1", "site2", "site3"],
        showBookmarkedOnly: false,
      },
      bookmarks: { siteIds: ["site2"] },
    };
    expect(selectVisibleSiteIDs(state)).toEqual(["site1", "site2", "site3"]);
  });

test("returns only bookmarked site IDs when showBookmarkedOnly is true", () => {
    const state = {
      filter: {
        unitcodeFilteredSiteIDs: ["site1", "site2", "site3"],
        showBookmarkedOnly: true,
      },
      bookmarks: { siteIds: ["site2", "site3"] },
    };
    expect(selectVisibleSiteIDs(state)).toEqual(["site2", "site3"]);
  });

test("returns empty array if no filtered site IDs", () => {
    const state = {
      filter: {
        unitcodeFilteredSiteIDs: [],
        showBookmarkedOnly: false,
      },
      bookmarks: { siteIds: ["site2"] },
    };
    expect(selectVisibleSiteIDs(state)).toEqual([]);
  });

test("returns empty array if no bookmarks and showBookmarkedOnly is true", () => {
    const state = {
      filter: {
        unitcodeFilteredSiteIDs: ["site1", "site2"],
        showBookmarkedOnly: true,
      },
      bookmarks: { siteIds: [] },
    };
    expect(selectVisibleSiteIDs(state)).toEqual([]);
  });
