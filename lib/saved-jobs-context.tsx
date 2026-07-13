"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "rabotaj-saved-jobs";

type SavedJobsContextValue = {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => boolean;
};

const SavedJobsContext = createContext<SavedJobsContextValue | null>(null);

export function SavedJobsProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setSavedIds(JSON.parse(stored));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds, hydrated]);

  const isSaved = (id: string) => savedIds.includes(id);

  const toggleSaved = (id: string) => {
    let nowSaved = false;
    setSavedIds((prev) => {
      if (prev.includes(id)) {
        nowSaved = false;
        return prev.filter((savedId) => savedId !== id);
      }
      nowSaved = true;
      return [...prev, id];
    });
    return nowSaved;
  };

  return (
    <SavedJobsContext.Provider value={{ savedIds, isSaved, toggleSaved }}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const ctx = useContext(SavedJobsContext);
  if (!ctx) throw new Error("useSavedJobs must be used within SavedJobsProvider");
  return ctx;
}
