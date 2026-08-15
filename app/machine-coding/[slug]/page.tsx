import Link from 'next/link';
import { Editor } from '../../../components/editor';
import { challenges } from '../../../lib/content';

export function generateStaticParams() {
  return challenges.map((challenge) => ({ slug: challenge.slug }));
}

export default function Challenge({ params }: { params: { slug: string } }) {
  const challenge = challenges.find((item) => item.slug === params.slug) ?? challenges[0];

  return (
    <div className="page">
      <Link href="/machine-coding" className="subtle link-subtle">
        ← All challenges
      </Link>
      <div className="hero" style={{ marginTop: 25, marginBottom: 23 }}>
        <div>
          <div className="eyebrow">
            {challenge.level} · {challenge.time}
          </div>
          <h1 className="h1">{challenge.title}</h1>
          <p className="subtle">{challenge.desc}</p>
        </div>
      </div>
      <div className="callout">
        <div className="callout-label">Prompt</div>
        <div className="callout-body">
          Build a focused, production-minded version. Talk through assumptions, keep the
          first pass small, and leave a clear acceptance checklist for the final five minutes.
        </div>
      </div>
      <div className="section-head">
        <h2 className="h2">Workspace</h2>
        <span className="subtle">Drafts save in this browser</span>
      </div>
      <Editor id={challenge.slug} />
    </div>
  );
}
