import { content } from './content';
import { StudyItem, StudyState } from './types';

export interface TrackProgress {
  name: string;
  count: number;
  done: number;
  color: string;
}

const TRACK_COLORS: Record<string, string> = {
  JavaScript: 'green',
  React: 'blue',
  Browser: 'orange',
  Performance: 'blue',
  TypeScript: 'green',
  Accessibility: 'orange',
};

export function getTotalLessons() {
  return content.length;
}

export function getCompletedCount(state: StudyState) {
  return Object.keys(state.completed).length;
}

export function getReadinessPercent(state: StudyState) {
  const total = getTotalLessons();
  if (total === 0) return 0;
  return Math.round((getCompletedCount(state) / total) * 100);
}

export function getTrackProgress(state: StudyState): TrackProgress[] {
  const byTrack = new Map<string, { count: number; done: number }>();

  for (const lesson of content) {
    const entry = byTrack.get(lesson.track) ?? { count: 0, done: 0 };
    entry.count += 1;
    if (state.completed[lesson.id]) entry.done += 1;
    byTrack.set(lesson.track, entry);
  }

  return Array.from(byTrack.entries()).map(([name, { count, done }]) => ({
    name,
    count,
    done,
    color: TRACK_COLORS[name] ?? 'green',
  }));
}

export function getFirstIncompleteLesson(state: StudyState): StudyItem | undefined {
  return content.find((lesson) => !state.completed[lesson.id]);
}

export function getContinueLesson(state: StudyState): StudyItem {
  return getFirstIncompleteLesson(state) ?? content[0];
}

export function getNextLesson(currentSlug: string): StudyItem | undefined {
  const index = content.findIndex((lesson) => lesson.slug === currentSlug);
  if (index === -1 || index >= content.length - 1) return undefined;
  return content[index + 1];
}

export function getBookmarkedLessons(state: StudyState) {
  const ids = new Set(state.bookmarked);
  return content.filter((lesson) => ids.has(lesson.id));
}

export function slugifyHeading(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
