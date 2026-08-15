import Link from 'next/link';
import { challenges } from '../../lib/content';

export default function Machine() {
  return (
    <div className="page">
      <div className="eyebrow">Build under a timebox</div>
      <h1 className="h1">Machine coding</h1>
      <p className="subtle" style={{ maxWidth: 620 }}>
        Small products with clear constraints. Practice state, boundaries, edge cases,
        and communication.
      </p>
      <div className="section-head">
        <h2 className="h2">{challenges.length} challenges</h2>
      </div>
      <div className="challenge-grid">
        {challenges.map((challenge) => (
          <Link
            href={`/machine-coding/${challenge.slug}`}
            className="card challenge-card"
            key={challenge.slug}
          >
            <div className="round-number">
              {challenge.level} <span className="challenge-time">· {challenge.time}</span>
            </div>
            <div className="round-title">{challenge.title}</div>
            <p className="subtle">{challenge.desc}</p>
            <div className="challenge-foot">
              <span className="tag">Starter ready</span>
              <span className="result-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
