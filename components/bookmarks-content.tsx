'use client';

import Link from 'next/link';
import { getBookmarkedLessons } from '../lib/progress';
import { useStudy } from './study-provider';

export function BookmarksContent() {
  const { state } = useStudy();
  const saved = getBookmarkedLessons(state);

  if (saved.length === 0) {
    return (
      <div className="empty">
        <p>No bookmarks yet.</p>
        <p className="subtle" style={{ marginTop: 8 }}>
          Bookmark lessons while reading to see them here.
        </p>
        <Link href="/learn" className="btn" style={{ marginTop: 20 }}>
          Browse lessons
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="section-head">
        <h2 className="h2">{saved.length} saved topics</h2>
      </div>
      <div className="results">
        {saved.map((item) => (
          <Link key={item.id} href={`/learn/${item.slug}`} className="card result">
            <div className="result-main">
              <div className="result-title">{item.title}</div>
              <div className="result-meta">
                {item.track} · {item.difficulty} · {item.estimatedMinutes} min
              </div>
            </div>
            <span className="result-saved">★</span>
            <span className="result-arrow">→</span>
          </Link>
        ))}
      </div>
    </>
  );
}
