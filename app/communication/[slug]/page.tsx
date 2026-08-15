import Link from 'next/link';
import { communication } from '../../../lib/content';

export function generateStaticParams() {
  return communication.map((drill) => ({ slug: drill.slug }));
}

export default function CommunicationDetail({ params }: { params: { slug: string } }) {
  const drill = communication.find((item) => item.slug === params.slug) ?? communication[0];

  return (
    <div className="page">
      <Link href="/communication" className="subtle link-subtle">
        ← Practice room
      </Link>
      <div className="lesson-content" style={{ marginTop: 28 }}>
        <div className="eyebrow">Communication drill</div>
        <h1 className="h1">{drill.title}</h1>
        <p className="subtle lesson-lead">{drill.desc}</p>
        <div className="callout">
          <div className="callout-label">Prompt</div>
          <div className="callout-body">
            Answer this out loud in two minutes. Record yourself if useful, then listen once for
            structure, specificity, and whether the listener can follow your choices.
          </div>
        </div>
        <h2>Answer framework</h2>
        <p>
          Start with the context in one sentence. Name the decision or moment that mattered. Explain
          your reasoning with one concrete detail. Close with the result and what you would carry
          forward.
        </p>
        <textarea
          className="textarea"
          aria-label="Personal answer notes"
          placeholder="Draft your answer here. Notes are not saved yet."
        />
      </div>
    </div>
  );
}
