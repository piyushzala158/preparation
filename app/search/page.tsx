import { SearchClient } from '../../components/search-client';

export default function Search() {
  return (
    <div className="page">
      <div className="eyebrow">Find content</div>
      <h1 className="h1">Search</h1>
      <p className="subtle" style={{ maxWidth: 560, marginBottom: 28 }}>
        Search across lessons, questions, rounds, and communication drills.
      </p>
      <SearchClient />
    </div>
  );
}
