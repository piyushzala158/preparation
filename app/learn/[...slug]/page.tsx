import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LessonActions } from '../../../components/lesson-actions';
import { content, getLesson } from '../../../lib/content';
import { getNextLesson, slugifyHeading } from '../../../lib/progress';

export function generateStaticParams() {
  return content.map((item) => ({ slug: item.slug.split('/') }));
}

export default function Lesson({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const item = getLesson(slug);
  if (!item) notFound();

  const nextLesson = getNextLesson(slug);
  const sectionIds = item.sections?.map((section) => slugifyHeading(section.heading)) ?? [];

  return (
    <div className="page">
      <div className="two-col">
        <aside className="side-menu">
          <div className="eyebrow">{item.track}</div>
          <a className="active" href="#overview">
            Overview
          </a>
          {item.sections?.map((section, index) => (
            <a key={section.heading} href={`#${sectionIds[index]}`}>
              {section.heading}
            </a>
          ))}
          <a href="#checklist">Review checklist</a>
        </aside>

        <article className="lesson-content">
          <Link href="/learn" className="subtle link-subtle">
            ← All lessons
          </Link>
          <div className="eyebrow" style={{ marginTop: 28 }}>
            {item.track} · {item.difficulty}
          </div>
          <h1 className="h1" id="overview">
            {item.title}
          </h1>
          <p className="subtle lesson-lead">{item.summary}</p>

          <div style={{ margin: '25px 0' }}>
            <LessonActions id={item.id} />
          </div>

          {item.sections?.[0] && (
            <div className="callout">
              <div className="callout-label">30-second explanation</div>
              <div className="callout-body">{item.sections[0].body}</div>
            </div>
          )}

          {item.sections?.map((section, index) => (
            <section key={section.heading} id={sectionIds[index]}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {section.code && <pre className="code">{section.code}</pre>}
            </section>
          ))}

          <section id="checklist">
            <h2>Review checklist</h2>
            <ul>
              <li>Can I explain the mental model without relying on buzzwords?</li>
              <li>Can I name a failure mode and how I would measure it?</li>
              <li>Can I describe the tradeoff in a real product context?</li>
            </ul>
          </section>

          <div className="lesson-footer">
            <Link href="/learn" className="btn">
              ← Curriculum
            </Link>
            {nextLesson ? (
              <Link href={`/learn/${nextLesson.slug}`} className="btn primary">
                Next lesson →
              </Link>
            ) : (
              <Link href="/learn" className="btn primary">
                Back to lessons
              </Link>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
