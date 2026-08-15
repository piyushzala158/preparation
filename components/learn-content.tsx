'use client';

import Link from 'next/link';
import { content } from '../lib/content';
import {
  getCompletedCount,
  getContinueLesson,
  getTotalLessons,
  getTrackProgress,
} from '../lib/progress';
import { useStudy } from './study-provider';

function lessonIconClass(icon: string) {
  if (icon === '↻') return 'green';
  if (icon === '⚛') return 'blue';
  return 'orange';
}

export function LearnContent() {
  const { state } = useStudy();
  const completed = getCompletedCount(state);
  const total = getTotalLessons();
  const tracks = getTrackProgress(state);
  const nextLesson = getContinueLesson(state);

  return (
    <>
      <div className="section-head">
        <h2 className="h2">Your tracks</h2>
        <span className="subtle">
          {completed} / {total} complete
        </span>
      </div>
      <div className="grid-2">
        <section className="card track-list">
          {tracks.map((track) => (
            <div className="track-row" key={track.name}>
              <span className={`track-dot ${track.color}`} />
              <div className="track-info">
                <div className="track-name">{track.name}</div>
                <div className="track-meta">
                  {track.done} of {track.count} lessons
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
        </section>
        <section className="card continue">
          <div className="eyebrow">Recommended next</div>
          <h2 className="h2">{nextLesson.title}</h2>
          <p className="subtle">{nextLesson.summary}</p>
          <div className="tag-row">
            <span className="tag">{nextLesson.track}</span>
            <span className="tag">{nextLesson.estimatedMinutes} min</span>
          </div>
          <Link
            href={`/learn/${nextLesson.slug}`}
            className="btn primary"
            style={{ marginTop: 25 }}
          >
            {state.completed[nextLesson.id] ? 'Review lesson' : 'Start lesson'}
          </Link>
        </section>
      </div>

      <div className="section-head">
        <h2 className="h2">All lessons</h2>
        <span className="subtle">{content.length} published</span>
      </div>
      <div className="results stagger-children">
        {content.map((item) => (
          <Link key={item.id} href={`/learn/${item.slug}`} className="card result">
            <div className={`lesson-icon ${lessonIconClass(item.icon)}`}>{item.icon}</div>
            <div className="result-main">
              <div className="result-title">{item.title}</div>
              <div className="result-meta">
                {item.track} · {item.difficulty} · {item.estimatedMinutes} min
                {state.completed[item.id] ? ' · Completed' : ''}
              </div>
            </div>
            <span className="tag">{item.tags[0]}</span>
            <span className="result-arrow">→</span>
          </Link>
        ))}
      </div>
    </>
  );
}
