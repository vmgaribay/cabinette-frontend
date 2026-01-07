/**
 * provider.tsx
 *
 * Redux provider and theme wrapper.
 * - Wraps app in Redux store context.
 * - Loads bookmarks.
 * - Applies theme class based on Redux theme state.
 *
 * Props:
 * - children: React node(s) to render.
 */
"use client";

import { Provider, useSelector } from "react-redux";
import { store } from "./store";
import { useEffect, useState } from "react";
import { setBookmarks } from "./bookmarksSlice";
import type { RootState } from "./store";
import { setTheme } from "./themeSlice";

/** ClientProvider component wrapping app with Redux/theme.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element}
 */
export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cabinette_bookmarks");
      if (stored) {
        try {
          store.dispatch(setBookmarks(JSON.parse(stored)));
        } catch {}
      }
      const theme = localStorage.getItem("cabinette_theme");
      if (theme === "light" || theme === "default") {
        store.dispatch(setTheme(theme));
      }
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeWrapper>{children}</ThemeWrapper>
    </Provider>
  );
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className={mode === "light" ? "light-theme" : ""}>{children}</div>
  );
}
