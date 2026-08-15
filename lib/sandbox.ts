export type ConsoleEntry = {
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  time: string;
};

export const DEFAULT_WORKSPACE_FILES: Record<string, string> = {
  'src/App.jsx': `export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <main className="app">
      <h1>Start building</h1>
      <p>Make the first interaction work.</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Clicked {count} times
      </button>
    </main>
  );
}`,
  'src/main.jsx': `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`,
  'src/styles.css': `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #f7f8f5;
  color: #1a1f1a;
}

.app {
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
}

p {
  margin: 0 0 1.25rem;
  color: #4a524a;
}

button {
  border: 0;
  border-radius: 8px;
  padding: 0.65rem 1rem;
  background: #2f6b3a;
  color: white;
  font: inherit;
  cursor: pointer;
}

button:hover {
  background: #255830;
}`,
};

export const DEFAULT_ACTIVE_FILE = 'src/App.jsx';

export function stripModuleSyntax(code: string) {
  return code
    .split('\n')
    .filter((line) => !/^\s*import\s/.test(line))
    .join('\n')
    .replace(/export\s+default\s+/g, '')
    .replace(/export\s+(function|const|class)\s+/g, '$1 ');
}

export function buildSandboxHtml(files: Record<string, string>) {
  const css = files['src/styles.css'] ?? '';
  const appCode = stripModuleSyntax(files['src/App.jsx'] ?? '');
  const mainCode = stripModuleSyntax(files['src/main.jsx'] ?? '');

  const bootstrap = (() => {
    const processed = stripModuleSyntax(mainCode)
      .replace(/\bcreateRoot\s*\(/g, 'ReactDOM.createRoot(')
      .trim();
    if (processed) return processed;
    return `const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`;
  })();

  const combined = `const { useState, useEffect, useRef, useMemo, useCallback, useReducer } = React;

${appCode}

${bootstrap}`;

  const escapedCss = css.replace(/<\/style/gi, '<\\/style');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style id="user-styles">${escapedCss}</style>
  <script>
    (function () {
      const send = (entry) => parent.postMessage({ source: 'prepdesk-sandbox', entry }, '*');
      ['log', 'warn', 'error', 'info'].forEach((method) => {
        const original = console[method].bind(console);
        console[method] = (...args) => {
          send({ type: method, message: args.map((value) => String(value)).join(' '), time: new Date().toISOString() });
          original(...args);
        };
      });
      window.addEventListener('error', (event) => {
        send({ type: 'error', message: event.message || 'Runtime error', time: new Date().toISOString() });
      });
      window.addEventListener('unhandledrejection', (event) => {
        send({ type: 'error', message: String(event.reason), time: new Date().toISOString() });
      });
    })();
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
${combined.replace(/<\/script/gi, '<\\/script')}
  </script>
</body>
</html>`;
}

export function languageForFile(path: string) {
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.html')) return 'html';
  return 'javascript';
}

export function normalizeDraft(
  draft: Record<string, string> | undefined,
  fallbackFiles: Record<string, string> = DEFAULT_WORKSPACE_FILES,
) {
  if (!draft) {
    return { files: { ...fallbackFiles }, activeFile: DEFAULT_ACTIVE_FILE };
  }

  if (draft.code && !draft['src/App.jsx']) {
    return {
      files: {
        ...fallbackFiles,
        'src/App.jsx': draft.code,
      },
      activeFile: DEFAULT_ACTIVE_FILE,
    };
  }

  const files = { ...fallbackFiles, ...draft };
  delete files.__active__;
  delete files.code;

  return {
    files,
    activeFile: draft.__active__ || DEFAULT_ACTIVE_FILE,
  };
}

export function serializeDraft(files: Record<string, string>, activeFile: string) {
  return { ...files, __active__: activeFile };
}
