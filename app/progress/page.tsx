import { ProgressContent } from '../../components/progress-content';

export default function Progress() {
  return (
    <div className="page">
      <div className="eyebrow">Your progress</div>
      <h1 className="h1">Progress</h1>
      <p className="subtle">
        Track what you have completed. Stats update when you mark lessons done.
      </p>
      <ProgressContent />
    </div>
  );
}
