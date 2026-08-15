import { LearnContent } from '../../components/learn-content';

export default function Learn() {
  return (
    <div className="page">
      <div className="hero hero-minimal">
        <div>
          <div className="eyebrow">The curriculum</div>
          <h1 className="h1">Learn</h1>
          <p className="subtle">
            Senior-level concepts organized into a path for frontend interviews.
          </p>
        </div>
      </div>
      <LearnContent />
    </div>
  );
}
