'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { allContent } from '../lib/content';

export function SearchClient({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [kind, setKind] = useState('all');

  const results = useMemo(
    () =>
      allContent.filter(
        (item) =>
          (kind === 'all' || item.kind === kind) &&
          (!query ||
            `${item.title} ${item.track} ${item.tags.join(' ')}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [query, kind],
  );

  return (
    <>
      <div className="search-box">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search lessons, questions, rounds…"
          aria-label="Search content"
        />
      </div>
      <div className="filter-row">
        {[
          ['all', 'All'],
          ['lesson', 'Lessons'],
          ['question', 'Questions'],
          ['round', 'Rounds'],
          ['communication', 'Communication'],
        ].map(([value, label]) => (
          <button
            key={value}
            className={`filter ${kind === value ? 'selected' : ''}`}
            onClick={() => setKind(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="subtle" style={{ marginBottom: 12 }}>
        {results.length} results {query && <>for “{query}”</>}
      </div>
      <div className="results">
        {results.map((item) => (
          <Link
            className="card result"
            href={
              item.kind === 'lesson'
                ? `/learn/${item.slug}`
                : item.kind === 'round'
                  ? `/rounds/${item.slug.replace('rounds/', '')}`
                  : item.kind === 'communication'
                    ? `/communication/${item.slug.replace('communication/', '')}`
                    : '/search'
            }
            key={item.id}
          >
            <div className="result-main">
              <div className="result-title">{item.title}</div>
              <div className="result-meta">
                {item.track} · {item.difficulty} · {item.kind}
              </div>
            </div>
            <span className="tag">{item.tags[0]}</span>
            <span className="result-arrow">→</span>
          </Link>
        ))}
      </div>
      {!results.length && (
        <div className="empty">
          No matches yet. Try “rendering”, “React”, or “performance”.
        </div>
      )}
    </>
  );
}
