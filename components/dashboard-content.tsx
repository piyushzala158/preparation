'use client';

import Link from 'next/link';
import { questions } from '../lib/content';
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

export function DashboardContent() {
  const { state } = useStudy();
  const completed = getCompletedCount(state);
  const total = getTotalLessons();
  const tracks = getTrackProgress(state);
  const continueLesson = getContinueLesson(state);
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="page">
      <section className="hero hero-minimal">
        <div className="hero-copy">
          <div className="eyebrow">{today}</div>
          <h1 className="h1">Start here</h1>
          <p className="subtle">
            {total} lessons · {completed} completed
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/learn" className="btn primary">
            Browse lessons
          </Link>
        </div>
      </section>

      <section className="card continue">
        <div className="section-head section-head-tight">
          <h2 className="h2">{completed === total ? 'Review a lesson' : 'Continue learning'}</h2>
        </div>
        <div className="lesson-card">
          <div className={`lesson-icon ${lessonIconClass(continueLesson.icon)}`}>
            {continueLesson.icon}
          </div>
          <div>
            <div className="eyebrow eyebrow-tight">
              {continueLesson.track} · {continueLesson.difficulty}
            </div>
            <h3 className="lesson-title">{continueLesson.title}</h3>
            <p className="subtle lesson-summary">{continueLesson.summary}</p>
            <div className="tag-row">
              <span className="tag">{continueLesson.estimatedMinutes} min</span>
              {continueLesson.tags.slice(0, 2).map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={`/learn/${continueLesson.slug}`}
              className="btn small"
              style={{ marginTop: 18 }}
            >
              {state.completed[continueLesson.id] ? 'Review lesson' : 'Start lesson'}
            </Link>
          </div>
        </div>
      </section>

      <div className="section-head">
        <h2 className="h2">Tracks</h2>
        <Link href="/progress" className="subtle link-subtle">
          See progress
        </Link>
      </div>
      <section className="card track-list">
        {tracks.map((track) => (
          <div className="track-row" key={track.name}>
            <span className={`track-dot ${track.color}`} />
            <div className="track-info">
              <div className="track-name">{track.name}</div>
              <div className="track-meta">
                {track.done} of {track.count} lessons
              </div>
              {track.count > 0 && (
                <div className="progress-line" style={{ marginTop: 8 }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.round((track.done / track.count) * 100)}%` }}
                  />
                </div>
              )}
            </div>
            <span className="track-percent">
              {track.count > 0 ? Math.round((track.done / track.count) * 100) : 0}%
            </span>
          </div>
        ))}
      </section>

      <div className="section-head">
        <h2 className="h2">Quick practice</h2>
        <Link href="/search" className="subtle link-subtle">
          Browse questions
        </Link>
      </div>
      <div className="question-grid stagger-children">
        {questions.slice(0, 3).map((question, index) => (
          <Link
            href={`/search?q=${encodeURIComponent(question)}`}
            className="card question-card interactive-card"
            key={question}
          >
            <div className="eyebrow eyebrow-tight">0{index + 1} · Interview question</div>
            <div className="question">{question}</div>
            <div className="foot">5 min read · JavaScript</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
