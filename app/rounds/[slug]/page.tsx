import Link from 'next/link';
import { rounds } from '../../../lib/content';

export function generateStaticParams() {
  return rounds.map((round) => ({ slug: round.slug }));
}

export default function Round({ params }: { params: { slug: string } }) {
  const round = rounds.find((item) => item.slug === params.slug) ?? rounds[0];

  return (
    <div className="page">
      <Link href="/rounds" className="subtle link-subtle">
        ← All round playbooks
      </Link>
      <div className="lesson-content" style={{ marginTop: 30 }}>
        <div className="eyebrow">Round {round.number} · Interview playbook</div>
        <h1 className="h1">{round.title}</h1>
        <p className="subtle lesson-lead">{round.desc}</p>
        <div className="callout">
          <div className="callout-label">What good looks like</div>
          <div className="callout-body">
            Be structured, specific, and curious. State your assumptions, show your
            reasoning, and make the tradeoffs visible before you land on an answer.
          </div>
        </div>
        <h2 className="h2" style={{ marginTop: 38 }}>
          Your preparation checklist
        </h2>
        <div className="card track-list" style={{ marginTop: 15 }}>
          {[
            'Clarify the prompt and timebox the answer.',
            'Start with the mental model, then add implementation detail.',
            'Name one tradeoff and one failure mode.',
            'Close with a concrete example from your experience.',
          ].map((item, index) => (
            <div className="track-row" key={item}>
              <span className="track-index">0{index + 1}</span>
              <div className="track-info">{item}</div>
            </div>
          ))}
        </div>
        <h2>Likely follow-ups</h2>
        <ul>
          <li>What would change at ten times the traffic?</li>
          <li>How would you test or observe this in production?</li>
          <li>What would you deliberately leave out of v1?</li>
        </ul>
        <Link href="/search" className="btn primary" style={{ marginTop: 20 }}>
          Practice questions
        </Link>
      </div>
    </div>
  );
}
