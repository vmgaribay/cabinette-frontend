import filterReducer, {
  setFilterUnitcodes,
  setShowBookmarkedOnly,
  setUnitcodeFilteredSiteIDs,
} from "../filterSlice";

  const initialState = {
    filterUnitcodes: [],
    showBookmarkedOnly: false,
    unitcodeFilteredSiteIDs: [],
  };

  test("returns initial state", () => {
    expect(filterReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test("handles setFilterUnitcodes", () => {
    const nextState = filterReducer(initialState, setFilterUnitcodes(["JOTR", "COPA"]));
    expect(nextState.filterUnitcodes).toEqual(["JOTR", "COPA"]);
  });

  test("handles setShowBookmarkedOnly", () => {
    const nextState = filterReducer(initialState, setShowBookmarkedOnly(true));
    expect(nextState.showBookmarkedOnly).toBe(true);
  });

  test("handles setUnitcodeFilteredSiteIDs", () => {
    const nextState = filterReducer(initialState, setUnitcodeFilteredSiteIDs(["site1", "site2"]));
    expect(nextState.unitcodeFilteredSiteIDs).toEqual(["site1", "site2"]);
  });

  test("immutability check", () => {
    const prevState = { ...initialState };
    filterReducer(prevState, setShowBookmarkedOnly(true));
    expect(prevState.showBookmarkedOnly).toBe(false);
  });
