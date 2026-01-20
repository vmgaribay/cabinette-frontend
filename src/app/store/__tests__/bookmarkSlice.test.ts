import bookmarksReducer, { setBookmarks, toggleBookmark } from "../bookmarksSlice";

const initialState = { siteIds: [] };

test("returns initial state", () => {
  expect(bookmarksReducer(undefined, { type: undefined })).toEqual(initialState);
});

test("handles setBookmarks", () => {
  const nextState = bookmarksReducer(initialState, setBookmarks(["a", "b"]));
  expect(nextState.siteIds).toEqual(["a", "b"]);
});

test("adds a bookmark with toggleBookmark", () => {
  const nextState = bookmarksReducer(initialState, toggleBookmark("site1"));
  expect(nextState.siteIds).toEqual(["site1"]);
});

test("removes bookmark with toggleBookmark", () => {
  const stateWithBookmark = { siteIds: ["site1"] };
  const nextState = bookmarksReducer(stateWithBookmark, toggleBookmark("site1"));
  expect(nextState.siteIds).toEqual([]);
});

test("immutability check", () => {
  const prevState = { siteIds: ["site1"] };
  bookmarksReducer(prevState, toggleBookmark("site2"));
  expect(prevState.siteIds).toEqual(["site1"]);
});