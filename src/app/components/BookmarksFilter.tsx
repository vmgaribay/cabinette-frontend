/**
 * BookmarksFilter.tsx
 *
 * React component for managing and filtering bookmarked sites.
 * - Allows bookmark filtering.
 * - Provides options for downloading, uploading, and merging bookmarks as JSON files.
 * - Displays popup messages.
 *
 * Props:
 * - themeRef: Reference to theme.
 */
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import type { RootState } from "../store/store";
import { setShowBookmarkedOnly } from "../store/filterSlice";
import { setBookmarks } from "../store/bookmarksSlice";
import {
  HiArrowDownTray,
  HiArrowUpTray,
  HiOutlineBookmark,
} from "react-icons/hi2";

/**
 * BookmarksFilter
 *
 * Component for bookmark utilities and filtering.
 * - Provides toggle to show only bookmarked sites.
 * - Download, upload, and merge features.
 * - Popup messages for action confirmation.
 *
 * @param {Object} props
 * @param {RefObject<HTMLDivElement|null>} props.themeRef - Reference to themed div.
 * @returns {JSX.Element}
 */
export default function BookmarksFilter() {
  const dispatch = useDispatch();
  const showBookmarkedOnly = useSelector(
    (state: RootState) => state.filter.showBookmarkedOnly,
  );
  const bookmarks = useSelector((state: RootState) => state.bookmarks.siteIds);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [messageQueue, setMessageQueue] = useState<
    { id: number; text: string }[]
  >([]);
  const messageReference = useRef(1);

  const addMessage = (text: string) => {
    const id = messageReference.current++;
    setMessageQueue((msgs) => [...msgs, { id, text }]);
  };
  useEffect(() => {
    if (messageQueue.length === 0) return;
    const timeout = setTimeout(() => {
      setMessageQueue((msgs) => msgs.slice(1));
    }, 6000);
    return () => clearTimeout(timeout);
  }, [messageQueue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  /**
   * Downloads current bookmarks and date stamp as a JSON file.
   */
  function handleDownload() {
    const metaObject = {
      date: new Date().toISOString(),
      bookmarks,
    };
    const blob = new Blob([JSON.stringify(metaObject, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cabinette_bookmarks.json";
    a.click();
    URL.revokeObjectURL(url);
    addMessage("Download of all bookmarks initialized.");
    setMenuOpen(false);
  }

  /**
   * Loads bookmarks from JSON file.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Triggered by file selection.
   */
  function handleRestore(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (bookmarks.length > 0) {
      const proceed = window.confirm(
        `Warning: Importing will overwrite ${bookmarks.length} bookmarks from this session.\nDo you wish to continue?\n\n( Tip: To retain current bookmarks, use "Add to Existing Bookmarks" )`,
      );
      if (!proceed) {
        event.target.value = "";
        return;
      }
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (validityCheck(imported)) {
          dispatch(setBookmarks(imported.bookmarks));
          addMessage(
            `Bookmarks from file created on ${new Date(imported.date).toLocaleString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })} loaded successfully.`,
          );
        } else {
          alert(
            "Invalid bookmarks file. Please select a file exported from this app.",
          );
        }
      } catch {
        alert(
          "Failed to parse bookmarks file. Please select a file exported from this app.",
        );
      }
    };
    reader.readAsText(file);
    setMenuOpen(false);
  }

  /**
   * Loads bookmarks from a JSON file, merges them with current bookmarks, and downloads the merged set.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Triggered by file selection.
   */
  function handleAddToExisting(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (validityCheck(imported)) {
          const merged = Array.from(
            new Set([...bookmarks, ...imported.bookmarks]),
          );
          dispatch(setBookmarks(merged));
          addMessage(
            `Bookmarks merged with file created on ${new Date(imported.date).toLocaleString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}.`,
          );
          handleDownload();
        } else {
          alert(
            "Invalid bookmarks file. Please select a file exported from this app.",
          );
        }
      } catch {
        alert(
          "Failed to parse bookmarks file. Please select a file exported from this app.",
        );
      }
    };
    reader.readAsText(file);
    setMenuOpen(false);
  }

  /**
   * Checks if an object is a valid bookmarks file (with date and bookmarks array).
   * @param {any} sample - The object to check.
   * @returns {boolean} True if valid.
   */
  function validityCheck(
    sample: unknown,
  ): sample is { date: string; bookmarks: string[] } {
    if (
      sample &&
      typeof sample === "object" &&
      "date" in sample &&
      typeof sample.date === "string" &&
      "bookmarks" in sample &&
      Array.isArray(sample.bookmarks) &&
      sample.bookmarks.every((id) => typeof id === "string")
    ) {
      return true;
    }
    return false;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 7,
        position: "relative",
      }}
    >
      <label style={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
        <input
          type="checkbox"
          checked={showBookmarkedOnly}
          onChange={(e) => dispatch(setShowBookmarkedOnly(e.target.checked))}
          disabled={bookmarks.length === 0}
        />
        <span style={{ color: `rgba(var(--light), 0.9)`, fontSize: 14 }}>
          Show only bookmarked sites
        </span>
      </label>
      <button
        className="highlight-button"
        onClick={() => setMenuOpen((open) => !open)}
        title="Save or load existing bookmarks"
      >
        <HiArrowDownTray />/<HiArrowUpTray /> <HiOutlineBookmark /> Utilities
      </button>
      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            zIndex: 10,
            background: `rgba(var(--dark))`,
            border: `1px solid rgb(var(--accent))`,
            borderRadius: 6,
            boxShadow: `0 2px 8px rgba(var(--dark),0.1)`,
            marginTop: 153,
            left: 138,
            minWidth: 180,
          }}
        >
          <button
            className="menu-item"
            title="Export/download current bookmarks as a JSON file."
            onClick={handleDownload}
          >
            <HiArrowDownTray /> Export Bookmarks
          </button>
          <label
            className="menu-item"
            title="Import/upload bookmarks from a specified file."
            style={{ cursor: "pointer" }}
          >
            <HiArrowUpTray /> Import Bookmarks
            <input
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={handleRestore}
            />
          </label>
          <label
            className="menu-item"
            title="Retrieve bookmarks from a specified file, merge with current bookmarks, and export merged bookmarks to a new file."
            style={{ cursor: "pointer" }}
          >
            <input
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={handleAddToExisting}
            />
            Add to Existing Bookmarks
          </label>
          <button
            className="menu-item"
            title="Close menu."
            onClick={() => setMenuOpen(false)}
          >
            X Cancel
          </button>
        </div>
      )}
      {messageQueue.length > 0 && (
        <div style={{ position: "fixed", top: 0, left: 30, zIndex: 1000 }}>
          <div key={messageQueue[0].id} className="popup">
            {messageQueue[0].text}
          </div>
        </div>
      )}
    </div>
  );
}
