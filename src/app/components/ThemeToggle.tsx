/**
 * ThemeToggle.tsx
 *
 * React component for switching mode/theme.
 * - Displays a fixed-position toggle.
 * - Shows current theme and switches on click.
 * - Uses Redux for theme state management.
 *
 * Props:
 * - None.
 */
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/themeSlice";
import type { RootState } from "../store/store";

/**
 * ThemeToggle component for switching between themes.
 * @returns {JSX.Element}
 */
export default function ThemeToggle() {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      title={`Switch to ${currentTheme === "light" ? "Default" : "Light"} Theme`}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        outline: "none",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 36,
          height: 18,
          borderRadius: 12,
          background:
            currentTheme === "light"
              ? "rgba(var(--accent), 0.7)"
              : "rgba(var(--dark), 0.7)",
          border: `2px solid rgb(var(--accent))`,
          position: "relative",
          transition: "background 0.2s",
          verticalAlign: "middle",
        }}
      >
        <span
          style={{
            display: "block",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background:
              currentTheme === "light"
                ? "rgb(var(--light))"
                : "rgb(var(--accent))",
            position: "absolute",
            top: 1,
            left: currentTheme === "light" ? 20 : 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            transition: "left 0.2s, background 0.2s",
          }}
        />
      </span>
      <span
        style={{
          marginLeft: 12,
          color: "rgb(var(--accent))",
          fontWeight: 600,
          fontSize: "1.1em",
          verticalAlign: "middle",
          userSelect: "none",
        }}
      >
        {currentTheme === "light" ? "Light" : "Default"}
      </span>
    </button>
  );
}
