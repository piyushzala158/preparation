export type ConsoleEntry = {
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  time: string;
};

export const REACT_SANDBOX_HINTS = [
  'Edit App.jsx for your UI — no import/export needed.',
  'main.jsx mounts <App /> using ReactDOM.createRoot.',
  'Add components as src/YourComponent.jsx and use them in App.',
  'styles.css is injected automatically.',
  'Hooks: React.useState, React.useEffect, React.useMemo, etc.',
  'Click Run after changes to refresh the preview.',
];

export const DEFAULT_WORKSPACE_FILES: Record<string, string> = {
  'src/App.jsx': `function App() {
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
  'src/main.jsx': `const root = ReactDOM.createRoot(document.getElementById('root'));
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

export function componentNameFromPath(path: string) {
  const base =
    path
      .split('/')
      .pop()
      ?.replace(/\.(jsx|js|tsx|ts)$/i, '') ?? 'Component';
  return base
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function templateForFile(path: string) {
  if (path.endsWith('.css')) {
    return `/* ${path} */\n`;
  }

  if (path.endsWith('.js')) {
    return `// ${path}\n`;
  }

  const name = componentNameFromPath(path);
  return `function ${name}() {
  return (
    <div>
      <h2>${name}</h2>
    </div>
  );
}
`;
}

export function stripModuleSyntax(code: string) {
  return code
    .replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*import\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*export\s+default\s+/gm, '')
    .replace(/^\s*export\s+(function|const|class)\s+/gm, '$1 ')
    .replace(/^\s*export\s+\{[\s\S]*?\};?\s*$/gm, '')
    .trim();
}

export function bundleReactSource(files: Record<string, string>) {
  const sourcePaths = Object.keys(files)
    .filter((path) => /^src\/.*\.(jsx|js)$/i.test(path))
    .sort((left, right) => {
      if (left.endsWith('main.jsx')) return 1;
      if (right.endsWith('main.jsx')) return -1;
      if (left.endsWith('App.jsx')) return -1;
      if (right.endsWith('App.jsx')) return 1;
      return left.localeCompare(right);
    });

  const chunks = sourcePaths.map((path) => stripModuleSyntax(files[path] ?? '')).filter(Boolean);

  const hasBootstrap = chunks.some((chunk) => /ReactDOM\.createRoot|\.render\s*\(/.test(chunk));

  if (!hasBootstrap) {
    chunks.push(`const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`);
  }

  return `const { useState, useEffect, useRef, useMemo, useCallback, useReducer } = React;

${chunks.join('\n\n')}`;
}

export function buildSandboxHtml(files: Record<string, string>) {
  const css = files['src/styles.css'] ?? '';
  const combined = bundleReactSource(files);
  const escapedCss = css.replace(/<\/style/gi, '<\\/style');
  const serializedSource = JSON.stringify(combined);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style id="user-styles">${escapedCss}</style>
</head>
<body>
  <div id="root"></div>
  <script>
    (function () {
      const send = (entry) => parent.postMessage({ source: 'prepdesk-sandbox', entry }, '*');
      ['log', 'warn', 'error', 'info'].forEach((method) => {
        const original = console[method].bind(console);
        console[method] = (...args) => {
          send({
            type: method,
            message: args.map((value) => String(value)).join(' '),
            time: new Date().toISOString(),
          });
          original(...args);
        };
      });
      window.addEventListener('error', (event) => {
        send({
          type: 'error',
          message: event.message || 'Runtime error',
          time: new Date().toISOString(),
        });
      });
      window.addEventListener('unhandledrejection', (event) => {
        send({
          type: 'error',
          message: String(event.reason),
          time: new Date().toISOString(),
        });
      });

      const source = ${serializedSource};

      try {
        const compiled = Babel.transform(source, { presets: ['react'] }).code;
        const run = new Function('React', 'ReactDOM', compiled);
        run(React, ReactDOM);
      } catch (error) {
        send({
          type: 'error',
          message: error && error.message ? error.message : String(error),
          time: new Date().toISOString(),
        });
      }
    })();
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

export function normalizePath(input: string) {
  const trimmed = input.trim().replace(/^\/+/, '');
  if (!trimmed) return null;
  if (trimmed.includes('..')) return null;
  return trimmed;
}

export function ensureSrcPath(path: string) {
  const normalized = normalizePath(path);
  if (!normalized) return null;
  return normalized.startsWith('src/') ? normalized : `src/${normalized}`;
}
