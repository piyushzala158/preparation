'use client';

import { useStudy } from './study-provider';

export function LessonActions({ id }: { id: string }) {
  const { state, updateState } = useStudy();
  const done = Boolean(state.completed[id]);
  const saved = state.bookmarked.includes(id);

  const markComplete = () => {
    updateState((prev) => ({
      ...prev,
      completed: { ...prev.completed, [id]: new Date().toISOString() },
    }));
  };

  const toggleBookmark = () => {
    updateState((prev) => {
      const bookmarked = prev.bookmarked.includes(id)
        ? prev.bookmarked.filter((item) => item !== id)
        : [...prev.bookmarked, id];
      return { ...prev, bookmarked };
    });
  };

  return (
    <div className="hero-actions">
      <button className={`btn ${done ? 'primary' : ''}`} onClick={markComplete} disabled={done}>
        {done ? 'Completed' : 'Mark complete'}
      </button>
      <button className="btn" onClick={toggleBookmark}>
        {saved ? 'Saved' : 'Bookmark'}
      </button>
    </div>
  );
}
