import filterReducer, {
  setFilterUnitcodes,
  setShowBookmarkedOnly,
} from "../filterSlice";

  const initialState = {
    filterUnitcodes: [],
    showBookmarkedOnly: false,
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

  test("immutability check", () => {
    const prevState = { ...initialState };
    filterReducer(prevState, setShowBookmarkedOnly(true));
    expect(prevState.showBookmarkedOnly).toBe(false);
  });
