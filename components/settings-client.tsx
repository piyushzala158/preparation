'use client';

import { useRef, useState } from 'react';
import { useStudy } from './study-provider';

export function SettingsClient() {
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const { resetState, updateState } = useStudy();

  function exportData() {
    const data = localStorage.getItem('prepdesk:state') || '{}';
    const blob = new Blob([data], { type: 'application/json' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'prepdesk-progress.json';
    anchor.click();
    setMessage('Export downloaded.');
  }

  function importData(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (data.version !== 1) throw new Error('Invalid version');
        updateState(() => ({
          version: 1,
          completed: data.completed ?? {},
          bookmarked: data.bookmarked ?? [],
          notes: data.notes ?? {},
          editorDrafts: data.editorDrafts ?? {},
          lastVisited: data.lastVisited,
        }));
        setMessage('Imported successfully.');
      } catch {
        setMessage('That file is not a valid Prepdesk export.');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="setting-grid">
      <div className="card setting-card">
        <h3>Export your progress</h3>
        <p className="subtle">
          Download bookmarks, notes, completion, and local drafts as a portable JSON file.
        </p>
        <button className="btn primary" onClick={exportData}>
          Download export
        </button>
      </div>
      <div className="card setting-card">
        <h3>Import a backup</h3>
        <p className="subtle">
          Restore a previous export on this browser. Nothing leaves your device.
        </p>
        <input
          ref={input}
          type="file"
          accept="application/json"
          hidden
          onChange={(event) => event.target.files?.[0] && importData(event.target.files[0])}
        />
        <button className="btn" onClick={() => input.current?.click()}>
          Choose JSON file
        </button>
      </div>
      <div className="card setting-card">
        <h3>Reset local data</h3>
        <p className="subtle">
          Clear all progress and drafts from this browser. This cannot be undone.
        </p>
        <button
          className="btn"
          onClick={() => {
            if (confirm('Reset all local progress?')) {
              resetState();
              setMessage('Local data reset.');
            }
          }}
        >
          Reset everything
        </button>
      </div>
      <div className="card setting-card">
        <h3>Privacy by design</h3>
        <p className="subtle">
          Prepdesk has no backend. Your notes, progress, and code drafts stay in this browser.
        </p>
        <div className="tag-row">
          <span className="tag">Offline-friendly</span>
          <span className="tag">No account</span>
        </div>
      </div>
      {message && (
        <div className="subtle" style={{ gridColumn: '1 / -1', color: 'var(--accent)' }}>
          {message}
        </div>
      )}
    </div>
  );
}
