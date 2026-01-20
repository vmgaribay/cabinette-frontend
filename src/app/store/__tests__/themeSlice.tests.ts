import themeReducer, { setTheme, toggleTheme } from "../themeSlice";

const initialState = { mode: "default" };

test("returns initial state", () => {
  expect(themeReducer(undefined, { type: undefined })).toEqual(initialState);
});

test("handles setTheme to light", () => {
  const nextState = themeReducer(initialState, setTheme("light"));
  expect(nextState.mode).toBe("light");
});

test("handles setTheme to default", () => {
  const nextState = themeReducer({ mode: "light" }, setTheme("default"));
  expect(nextState.mode).toBe("default");
});

test("handles toggleTheme from default to light", () => {
  const nextState = themeReducer(initialState, toggleTheme());
  expect(nextState.mode).toBe("light");
});

test("handles toggleTheme from light to default", () => {
  const nextState = themeReducer({ mode: "light" }, toggleTheme());
  expect(nextState.mode).toBe("default");
});

test("immutability check", () => {
  const prevState = { mode: "default" };
  themeReducer(prevState, setTheme("light"));
  expect(prevState.mode).toBe("default");
});
