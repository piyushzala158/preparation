import Link from 'next/link';
import { rounds } from '../../lib/content';

export default function Rounds() {
  return (
    <div className="page">
      <div className="eyebrow">Interview mode</div>
      <h1 className="h1">Interview rounds</h1>
      <p className="subtle" style={{ maxWidth: 620 }}>
        Every round rewards a different kind of clarity. Use these playbooks to practice the shape
        of the answer—not just the facts inside it.
      </p>
      <div className="section-head">
        <h2 className="h2">Round playbooks</h2>
        <span className="subtle">{rounds.length} rounds</span>
      </div>
      <div className="round-grid">
        {rounds.map((round) => (
          <Link
            href={`/rounds/${round.slug}`}
            key={round.slug}
            className="card round-card interactive-card"
          >
            <div className="round-number">Round {round.number}</div>
            <div className="round-title">{round.title}</div>
            <p className="subtle">{round.desc}</p>
            <div className="tag-row">
              <span className="tag">Expectations</span>
              <span className="tag">Frameworks</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
