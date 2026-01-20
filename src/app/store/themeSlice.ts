/**
 * themeSlice.ts
 *
 * Redux slice to manage application theme.
 * - Retrieves theme if it exists in localStorage.
 * - Provides actions to set/toggle the theme mode.
 *
 * State:
 * - mode: Current mode ('default' | 'light').
 *
 * Actions:
 * - setTheme: Set the mode explicitly.
 * - toggleTheme: Toggle between 'default' and 'light'.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  mode: "default" | "light";
}

const initialState: ThemeState = {
  mode: "default",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<"default" | "light">) {
      state.mode = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("cabinette_theme", action.payload);
      }
    },
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "default" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("cabinette_theme", state.mode);
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
