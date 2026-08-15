import { BookmarksContent } from '../../components/bookmarks-content';

export default function Bookmarks() {
  return (
    <div className="page">
      <div className="eyebrow">Saved for later</div>
      <h1 className="h1">Bookmarks</h1>
      <p className="subtle">Lessons you want to revisit.</p>
      <BookmarksContent />
    </div>
  );
}
