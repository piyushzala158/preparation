'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildSandboxHtml,
  ConsoleEntry,
  DEFAULT_ACTIVE_FILE,
  DEFAULT_WORKSPACE_FILES,
  languageForFile,
  normalizeDraft,
  serializeDraft,
} from '../lib/sandbox';
import { useStudy } from './study-provider';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="workspace-loading">Loading editor…</div>,
});

type WorkspaceProps = {
  id: string;
};

function buildTree(files: Record<string, string>) {
  const root: Record<string, unknown> = {};

  Object.keys(files)
    .sort()
    .forEach((path) => {
      const parts = path.split('/');
      let node = root;
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          node[part] = path;
          return;
        }
        if (!node[part]) node[part] = {};
        node = node[part] as Record<string, unknown>;
      });
    });

  return root;
}

function TreeNode({
  name,
  node,
  activeFile,
  depth,
  onSelect,
}: {
  name: string;
  node: unknown;
  activeFile: string;
  depth: number;
  onSelect: (path: string) => void;
}) {
  if (typeof node === 'string') {
    const isActive = node === activeFile;
    return (
      <button
        type="button"
        className={`workspace-file ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: 12 + depth * 14 }}
        onClick={() => onSelect(node)}
      >
        <span className="workspace-file-icon">{node.endsWith('.css') ? '◆' : '◇'}</span>
        {name}
      </button>
    );
  }

  const children = node as Record<string, unknown>;
  return (
    <div className="workspace-folder">
      <div className="workspace-folder-label" style={{ paddingLeft: 12 + depth * 14 }}>
        <span className="workspace-file-icon">▸</span>
        {name}
      </div>
      {Object.entries(children).map(([childName, childNode]) => (
        <TreeNode
          key={childName}
          name={childName}
          node={childNode}
          activeFile={activeFile}
          depth={depth + 1}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export function Workspace({ id }: WorkspaceProps) {
  const { state, updateState } = useStudy();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [files, setFiles] = useState(DEFAULT_WORKSPACE_FILES);
  const [activeFile, setActiveFile] = useState(DEFAULT_ACTIVE_FILE);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    const draft = normalizeDraft(state.editorDrafts[id]);
    setFiles(draft.files);
    setActiveFile(draft.activeFile);
  }, [id, state.editorDrafts]);

  const persist = useCallback(
    (nextFiles: Record<string, string>, nextActiveFile: string) => {
      updateState((prev) => ({
        ...prev,
        editorDrafts: {
          ...prev.editorDrafts,
          [id]: serializeDraft(nextFiles, nextActiveFile),
        },
      }));
    },
    [id, updateState],
  );

  const updateFile = (path: string, value: string) => {
    const nextFiles = { ...files, [path]: value };
    setFiles(nextFiles);
    persist(nextFiles, activeFile);
  };

  const selectFile = (path: string) => {
    setActiveFile(path);
    persist(files, path);
  };

  const resetWorkspace = () => {
    setFiles(DEFAULT_WORKSPACE_FILES);
    setActiveFile(DEFAULT_ACTIVE_FILE);
    setConsoleLogs([]);
    setPreviewKey((value) => value + 1);
    persist(DEFAULT_WORKSPACE_FILES, DEFAULT_ACTIVE_FILE);
  };

  const runPreview = () => {
    setConsoleLogs([]);
    setPreviewKey((value) => value + 1);
  };

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.source !== 'prepdesk-sandbox' || !event.data.entry) return;
      setConsoleLogs((prev) => [...prev, event.data.entry as ConsoleEntry]);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const previewHtml = useMemo(() => buildSandboxHtml(files), [files]);
  const tree = useMemo(() => buildTree(files), [files]);
  const activeCode = files[activeFile] ?? '';

  return (
    <div className="workspace">
      <aside className="workspace-tree card">
        <div className="pane-head">
          <span>Explorer</span>
        </div>
        <div className="workspace-tree-body">
          {Object.entries(tree).map(([name, node]) => (
            <TreeNode
              key={name}
              name={name}
              node={node}
              activeFile={activeFile}
              depth={0}
              onSelect={selectFile}
            />
          ))}
        </div>
      </aside>

      <section className="workspace-editor card">
        <div className="pane-head">
          <span>{activeFile}</span>
          <div className="workspace-actions">
            <button type="button" className="btn small" onClick={resetWorkspace}>
              Reset
            </button>
            <button
              type="button"
              className="btn small"
              onClick={() => navigator.clipboard?.writeText(activeCode)}
            >
              Copy
            </button>
            <button type="button" className="btn small primary" onClick={runPreview}>
              Run
            </button>
          </div>
        </div>
        <div className="workspace-editor-body">
          <MonacoEditor
            height="100%"
            language={languageForFile(activeFile)}
            theme="vs-dark"
            value={activeCode}
            onChange={(value) => updateFile(activeFile, value ?? '')}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        </div>
      </section>

      <section className="workspace-preview card">
        <div className="pane-head">
          <span>Preview</span>
          <span className="pane-note">React 18 sandbox</span>
        </div>
        <iframe
          key={previewKey}
          ref={iframeRef}
          title="React preview"
          className="workspace-preview-frame"
          sandbox="allow-scripts allow-forms allow-modals"
          srcDoc={previewHtml}
        />
      </section>

      <section className="workspace-terminal card">
        <div className="pane-head">
          <span>Terminal</span>
          <button type="button" className="btn small" onClick={() => setConsoleLogs([])}>
            Clear
          </button>
        </div>
        <div className="workspace-terminal-body">
          {consoleLogs.length === 0 ? (
            <div className="workspace-terminal-empty">
              Console output appears here when you run the preview.
            </div>
          ) : (
            consoleLogs.map((entry, index) => (
              <div key={`${entry.time}-${index}`} className={`terminal-line ${entry.type}`}>
                <span className="terminal-time">
                  {new Date(entry.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
                <span className="terminal-message">{entry.message}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
