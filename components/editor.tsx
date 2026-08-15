'use client';

import { useEffect, useState } from 'react';
import { useStudy } from './study-provider';

const starter = `// Your solution
const root = document.querySelector('#app');
root.innerHTML = '<main><h1>Start building</h1><p>Make the first interaction work.</p></main>';`;

export function Editor({ id }: { id: string }) {
  const { state, updateState } = useStudy();
  const [code, setCode] = useState(starter);

  useEffect(() => {
    setCode(state.editorDrafts[id]?.code ?? starter);
  }, [id, state.editorDrafts]);

  const save = (value: string) => {
    setCode(value);
    updateState((prev) => ({
      ...prev,
      editorDrafts: {
        ...prev.editorDrafts,
        [id]: { code: value },
      },
    }));
  };

  return (
    <div className="editor-wrap">
      <section className="editor-pane">
        <div className="pane-head">
          <span>solution.js</span>
          <div>
            <button
              className="btn small"
              onClick={() => save(starter)}
              style={{ marginRight: 7 }}
            >
              Reset
            </button>
            <button className="btn small" onClick={() => navigator.clipboard?.writeText(code)}>
              Copy
            </button>
          </div>
        </div>
        <textarea
          aria-label="Code editor"
          className="editor-text"
          value={code}
          onChange={(event) => save(event.target.value)}
        />
      </section>
      <section className="preview-pane">
        <div className="pane-head">
          <span>live preview</span>
          <span className="pane-note">local sandbox</span>
        </div>
        <iframe
          title="Code preview"
          className="preview-frame"
          sandbox="allow-scripts"
          srcDoc={`<style>body{font-family:system-ui;padding:30px;color:#202520}main{max-width:500px}h1{font-size:28px}</style><div id="app"></div><script>${code.replaceAll('</script>', '')}</script>`}
        />
      </section>
    </div>
  );
}
