"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { setBookmarks } from './bookmarksSlice';


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
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}