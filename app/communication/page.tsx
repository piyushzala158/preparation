import Link from 'next/link';
import { communication } from '../../lib/content';

export default function Communication() {
  return (
    <div className="page">
      <div className="eyebrow">Say the clear thing</div>
      <h1 className="h1">Communication</h1>
      <p className="subtle" style={{ maxWidth: 620 }}>
        Practice introducing yourself, clarifying ambiguity, explaining tradeoffs, and telling the
        honest project story.
      </p>
      <div className="section-head">
        <h2 className="h2">Practice room</h2>
        <span className="subtle">Speak answers out loud</span>
      </div>
      <div className="round-grid">
        {communication.map((drill, index) => (
          <Link href={`/communication/${drill.slug}`} className="card round-card" key={drill.slug}>
            <div className="round-number">Drill 0{index + 1}</div>
            <div className="round-title">{drill.title}</div>
            <p className="subtle">{drill.desc}</p>
            <span className="drill-link">Open drill →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
