'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { StudyState } from '../lib/types';

const STORAGE_KEY = 'prepdesk:state';

export const emptyStudyState: StudyState = {
  version: 1,
  completed: {},
  bookmarked: [],
  notes: {},
  editorDrafts: {},
};

type StudyContextValue = {
  state: StudyState;
  ready: boolean;
  updateState: (updater: (prev: StudyState) => StudyState) => void;
  resetState: () => void;
};

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudyState>(emptyStudyState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StudyState>;
        setState({ ...emptyStudyState, ...parsed, version: 1 });
      }
    } catch {
      // ponytail: ignore corrupt localStorage; start fresh
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const updateState = (updater: (prev: StudyState) => StudyState) => {
    setState((prev) => updater(prev));
  };

  const resetState = () => {
    setState(emptyStudyState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <StudyContext.Provider value={{ state, ready, updateState, resetState }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used within StudyProvider');
  return context;
}
