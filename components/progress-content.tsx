'use client';

import Link from 'next/link';
import {
  getBookmarkedLessons,
  getCompletedCount,
  getReadinessPercent,
  getTotalLessons,
  getTrackProgress,
} from '../lib/progress';
import { useStudy } from './study-provider';

export function ProgressContent() {
  const { state } = useStudy();
  const completed = getCompletedCount(state);
  const total = getTotalLessons();
  const readiness = getReadinessPercent(state);
  const tracks = getTrackProgress(state);
  const bookmarked = getBookmarkedLessons(state);
  const nextIncomplete = tracks.find((track) => track.done < track.count);

  return (
    <>
      <div className="stats-grid stats-grid-minimal">
        <div className="stat-card">
          <div className="stat-top">
            <span>Lessons completed</span>
          </div>
          <div className="stat-num">
            {completed}
            <small> / {total}</small>
          </div>
          <div className="progress-line" style={{ marginTop: 12 }}>
            <div className="progress-fill" style={{ width: `${readiness}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <span>Bookmarks</span>
          </div>
          <div className="stat-num">{bookmarked.length}</div>
          <div className="stat-note">
            {bookmarked.length === 0 ? 'None saved yet' : 'Saved for later'}
          </div>
        </div>
      </div>

      <div className="section-head">
        <h2 className="h2">Track progress</h2>
      </div>
      <div className="card track-list">
        {tracks.map((track) => (
          <div className="track-row" key={track.name}>
            <span className={`track-dot ${track.color}`} />
            <div className="track-info">
              <div className="track-name">{track.name}</div>
              <div className="track-meta">
                {track.done} of {track.count} lessons complete
              </div>
              <div className="progress-line" style={{ marginTop: 8 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${track.count > 0 ? Math.round((track.done / track.count) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
            <span className="track-percent">
              {track.count > 0 ? Math.round((track.done / track.count) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>

      <div className="section-head">
        <h2 className="h2">Next step</h2>
      </div>
      <div className="card continue">
        {completed === total ? (
          <>
            <div className="eyebrow">All done</div>
            <h2 className="h2">You have completed every lesson</h2>
            <p className="subtle">Review a lesson or try a machine-coding challenge.</p>
            <Link href="/learn" className="btn primary">
              Review lessons
            </Link>
          </>
        ) : (
          <>
            <div className="eyebrow">Recommended</div>
            <h2 className="h2">
              {nextIncomplete
                ? `Continue your ${nextIncomplete.name} track`
                : 'Pick up your next lesson'}
            </h2>
            <p className="subtle">
              {completed === 0
                ? 'Start with your first lesson to build momentum.'
                : `${completed} of ${total} lessons done. Keep going.`}
            </p>
            <Link href="/learn" className="btn primary">
              Go to lessons
            </Link>
          </>
        )}
      </div>
    </>
  );
}
