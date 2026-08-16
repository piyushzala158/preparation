'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildSandboxHtml,
  ConsoleEntry,
  DEFAULT_ACTIVE_FILE,
  DEFAULT_WORKSPACE_FILES,
  ensureSrcPath,
  languageForFile,
  normalizeDraft,
  normalizePath,
  REACT_SANDBOX_HINTS,
  serializeDraft,
  templateForFile,
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
  onDelete,
}: {
  name: string;
  node: unknown;
  activeFile: string;
  depth: number;
  onSelect: (path: string) => void;
  onDelete: (path: string) => void;
}) {
  if (typeof node === 'string') {
    if (name === '.gitkeep') return null;
    const isActive = node === activeFile;
    const icon = node.endsWith('.css')
      ? '◆'
      : node.endsWith('.jsx') || node.endsWith('.js')
        ? '◇'
        : '·';

    return (
      <div className="workspace-file-row" style={{ paddingLeft: 12 + depth * 14 }}>
        <button
          type="button"
          className={`workspace-file ${isActive ? 'active' : ''}`}
          onClick={() => onSelect(node)}
        >
          <span className="workspace-file-icon">{icon}</span>
          {name}
        </button>
        <button
          type="button"
          className="workspace-file-delete"
          aria-label={`Delete ${name}`}
          onClick={() => onDelete(node)}
        >
          ×
        </button>
      </div>
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
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export function Workspace({ id }: WorkspaceProps) {
  const { state, updateState } = useStudy();
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

  const applyFiles = (nextFiles: Record<string, string>, nextActiveFile = activeFile) => {
    setFiles(nextFiles);
    setActiveFile(nextActiveFile);
    persist(nextFiles, nextActiveFile);
  };

  const updateFile = (path: string, value: string) => {
    const nextFiles = { ...files, [path]: value };
    applyFiles(nextFiles, activeFile);
  };

  const selectFile = (path: string) => {
    applyFiles(files, path);
  };

  const resetWorkspace = () => {
    setConsoleLogs([]);
    setPreviewKey((value) => value + 1);
    applyFiles({ ...DEFAULT_WORKSPACE_FILES }, DEFAULT_ACTIVE_FILE);
  };

  const runPreview = () => {
    setConsoleLogs([]);
    setPreviewKey((value) => value + 1);
  };

  const createFile = () => {
    const input = window.prompt('New file path (e.g. src/SearchBar.jsx)', 'src/Component.jsx');
    if (!input) return;

    const path = ensureSrcPath(input);
    if (!path) return;
    if (files[path]) {
      window.alert('That file already exists.');
      return;
    }

    const nextFiles = { ...files, [path]: templateForFile(path) };
    applyFiles(nextFiles, path);
  };

  const createFolder = () => {
    const input = window.prompt('New folder (e.g. src/components)', 'src/components');
    if (!input) return;

    const folder = normalizePath(input);
    if (!folder) return;

    const placeholder = `${folder}/.gitkeep`;
    if (files[placeholder]) {
      window.alert('That folder already exists.');
      return;
    }

    const nextFiles = { ...files, [placeholder]: '' };
    applyFiles(nextFiles, activeFile);
  };

  const deleteFile = (path: string) => {
    if (path === 'src/App.jsx' || path === 'src/main.jsx') {
      window.alert('App.jsx and main.jsx are required for the React sandbox.');
      return;
    }

    if (!window.confirm(`Delete ${path}?`)) return;

    const nextFiles = { ...files };
    delete nextFiles[path];

    const nextActive = activeFile === path ? DEFAULT_ACTIVE_FILE : activeFile;
    applyFiles(nextFiles, nextActive);
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
          <div className="workspace-actions">
            <button type="button" className="btn small" onClick={createFile} title="New file">
              + File
            </button>
            <button type="button" className="btn small" onClick={createFolder} title="New folder">
              + Folder
            </button>
          </div>
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
              onDelete={deleteFile}
            />
          ))}
        </div>
        <div className="workspace-hints">
          <div className="workspace-hints-title">React sandbox</div>
          <ul>
            {REACT_SANDBOX_HINTS.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
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
