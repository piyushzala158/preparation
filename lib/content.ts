import { ContentMeta, StudyItem } from './types';
const lessons: StudyItem[] = [
  {
    id: 'js-event-loop',
    slug: 'javascript/event-loop',
    title: 'The event loop, deeply understood',
    kind: 'lesson',
    track: 'JavaScript',
    difficulty: 'senior',
    tags: ['runtime', 'async'],
    estimatedMinutes: 24,
    icon: '↻',
    summary:
      'Build a reliable mental model for tasks, microtasks, rendering, and the moments where UI responsiveness breaks.',
    sections: [
      {
        heading: 'Mental model',
        body: 'JavaScript runs one piece of work at a time on the main thread. The event loop decides when queued work can run, but the browser also has rendering and input priorities that shape what a user feels.',
        code: `const run = () => console.log('current stack');\nqueueMicrotask(() => console.log('microtask'));\nsetTimeout(() => console.log('task'), 0);\n\nrun(); // stack → microtask → task`,
      },
      {
        heading: 'The interview answer',
        body: 'A promise callback goes into the microtask queue. After the current stack is empty, the runtime drains microtasks before taking another task such as a timer or click. That is why an unbounded microtask chain can starve rendering.',
      },
      {
        heading: 'Senior tradeoffs',
        body: 'Use scheduling primitives deliberately: split long work, yield between chunks, move CPU-heavy work to a Worker, and measure long tasks instead of assuming async means non-blocking.',
      },
    ],
  },
  {
    id: 'react-rendering',
    slug: 'react/rendering-model',
    title: 'React rendering without the hand-waving',
    kind: 'lesson',
    track: 'React',
    difficulty: 'senior',
    tags: ['react', 'performance'],
    estimatedMinutes: 28,
    icon: '⚛',
    summary:
      'Explain render, commit, reconciliation, and state ownership clearly enough to make performance decisions.',
    sections: [
      {
        heading: 'Mental model',
        body: 'A state update schedules a render. React calculates the next tree, compares it with the previous tree, and commits the minimal DOM mutations. Rendering is calculation; it is not automatically a DOM write.',
      },
      {
        heading: 'What changes the cost',
        body: 'Component boundaries, stable identities, context fan-out, derived work, and effects all influence the user-visible result. Optimize the interaction path first.',
      },
    ],
  },
  {
    id: 'web-performance',
    slug: 'performance/core-web-vitals',
    title: 'Performance as a product constraint',
    kind: 'lesson',
    track: 'Performance',
    difficulty: 'advanced',
    tags: ['vitals', 'ux'],
    estimatedMinutes: 22,
    icon: '◒',
    summary:
      'Connect loading, interaction, and layout metrics to architectural choices and practical debugging.',
    sections: [
      {
        heading: 'Start with the user journey',
        body: 'A fast dashboard is not a number; it is a user completing an important action with confidence. Measure the critical route, not only the landing page.',
      },
      {
        heading: 'Review checklist',
        body: 'Identify the largest content element, input delay, unexpected layout shifts, cache boundaries, and the cost of JavaScript before adding micro-optimizations.',
      },
    ],
  },
  {
    id: 'typescript-design',
    slug: 'typescript/api-design',
    title: 'TypeScript types that make APIs safer',
    kind: 'lesson',
    track: 'TypeScript',
    difficulty: 'advanced',
    tags: ['types', 'api'],
    estimatedMinutes: 25,
    icon: '◇',
    summary:
      'Use narrowing, discriminated unions, and generics to make invalid states harder to represent.',
    sections: [
      {
        heading: 'Practical explanation',
        body: 'Types are a design tool at module boundaries. Model the states a caller can observe, validate untrusted input at runtime, and let narrowing carry the proof through the function.',
      },
    ],
  },
  {
    id: 'accessibility',
    slug: 'accessibility/interaction',
    title: 'Accessible interaction is product quality',
    kind: 'lesson',
    track: 'Accessibility',
    difficulty: 'advanced',
    tags: ['a11y', 'ux'],
    estimatedMinutes: 19,
    icon: '◎',
    summary:
      'Keyboard flow, focus management, names, and semantics for interfaces that work for more people.',
    sections: [
      {
        heading: 'Common mistakes',
        body: 'A visible control without an accessible name, a custom clickable div, focus lost after a dialog closes, and color-only status indicators are all interaction bugs—not polish items.',
      },
    ],
  },
  {
    id: 'http-caching',
    slug: 'browser/http-caching',
    title: 'HTTP caching and the frontend contract',
    kind: 'lesson',
    track: 'Browser',
    difficulty: 'senior',
    tags: ['http', 'cache'],
    estimatedMinutes: 26,
    icon: '⌁',
    summary:
      'Reason about browser cache, CDN cache, invalidation, and freshness without cargo-cult headers.',
    sections: [
      {
        heading: 'Senior-level tradeoffs',
        body: 'Caching is a consistency decision. Public immutable assets can be cached aggressively; personalized responses need explicit boundaries. A frontend cache never replaces an authorization check.',
      },
    ],
  },
];
export const questions = [
  'How does the browser turn HTML, CSS, and JavaScript into pixels?',
  'What is the difference between layout, paint, and compositing?',
  'When would you choose a Worker over splitting work on the main thread?',
  'Explain event delegation and its tradeoffs.',
  'What makes a form accessible beyond adding labels?',
  'How do HTTP caching headers interact with a CDN?',
  'What causes Cumulative Layout Shift and how do you debug it?',
  'How does React decide what to commit?',
  'When is Context the wrong state-management choice?',
  'How do you prevent an effect from becoming a request loop?',
  'What is a discriminated union and when is it useful?',
  'How would you design a type-safe API client?',
  'What makes a component easy to test?',
  'How do you approach a production performance regression?',
  'What would you review first in an unfamiliar frontend codebase?',
  'How do you handle optimistic UI failure?',
  'Explain hydration mismatch and a debugging path.',
  'What does idempotency mean in a UI workflow?',
];
export const rounds = [
  {
    slug: 'frontend-fundamentals',
    title: 'Frontend fundamentals',
    number: '01',
    desc: 'HTML, CSS, browser rendering, HTTP, accessibility, and practical debugging.',
  },
  {
    slug: 'react-javascript',
    title: 'React + JavaScript deep dive',
    number: '02',
    desc: 'Runtime behavior, hooks, rendering, state, effects, and performance.',
  },
  {
    slug: 'machine-coding',
    title: 'Machine coding',
    number: '03',
    desc: 'Build a small product in a timebox while communicating your decisions.',
  },
  {
    slug: 'system-design',
    title: 'Frontend system design',
    number: '04',
    desc: 'Turn ambiguous product requirements into resilient client architecture.',
  },
  {
    slug: 'project-deep-dive',
    title: 'Project deep dive',
    number: '05',
    desc: 'Tell a crisp story about impact, tradeoffs, ownership, and learning.',
  },
  {
    slug: 'behavioral',
    title: 'Behavioral + HR',
    number: '06',
    desc: 'Practice honest, structured answers with evidence and reflection.',
  },
];
export const challenges = [
  {
    slug: 'autocomplete',
    title: 'Search autocomplete',
    level: 'Easy',
    time: '35 min',
    desc: 'Debounced input, keyboard navigation, loading states, and empty results.',
  },
  {
    slug: 'kanban-board',
    title: 'Kanban board',
    level: 'Medium',
    time: '60 min',
    desc: 'Drag-free column movement, editing, filters, and local persistence.',
  },
  {
    slug: 'infinite-feed',
    title: 'Infinite feed',
    level: 'Medium',
    time: '55 min',
    desc: 'Pagination, virtualized thinking, retry states, and scroll behavior.',
  },
  {
    slug: 'date-picker',
    title: 'Date range picker',
    level: 'Hard',
    time: '75 min',
    desc: 'Keyboard support, constraints, time zones, and flexible selection.',
  },
  {
    slug: 'analytics-dashboard',
    title: 'Analytics dashboard',
    level: 'Hard',
    time: '90 min',
    desc: 'Composable cards, responsive charts, loading skeletons, and filters.',
  },
  {
    slug: 'collaborative-editor',
    title: 'Collaborative editor',
    level: 'Extreme',
    time: '120 min',
    desc: 'Presence, conflict strategy, autosave, and failure recovery.',
  },
  {
    slug: 'file-uploader',
    title: 'Resumable file uploader',
    level: 'Hard',
    time: '70 min',
    desc: 'Chunks, progress, pause/resume, validation, and retry.',
  },
  {
    slug: 'modal-manager',
    title: 'Modal manager',
    level: 'Easy',
    time: '30 min',
    desc: 'Stacking, focus trap, escape handling, and portal boundaries.',
  },
  {
    slug: 'toast-system',
    title: 'Toast notification system',
    level: 'Easy',
    time: '25 min',
    desc: 'Queueing, dismissal, auto-expiry, and accessible live regions.',
  },
  {
    slug: 'calendar',
    title: 'Calendar scheduling grid',
    level: 'Hard',
    time: '90 min',
    desc: 'Overlapping events, keyboard navigation, and timezone clarity.',
  },
  {
    slug: 'shopping-cart',
    title: 'Shopping cart',
    level: 'Medium',
    time: '45 min',
    desc: 'Derived totals, quantity changes, optimistic updates, and errors.',
  },
  {
    slug: 'quiz-builder',
    title: 'Quiz builder',
    level: 'Medium',
    time: '50 min',
    desc: 'Question editing, validation, preview mode, and draft recovery.',
  },
];
export const communication = [
  {
    slug: 'self-introduction',
    title: 'Your 60-second introduction',
    desc: 'A simple structure for being specific without reciting your résumé.',
  },
  {
    slug: 'project-story',
    title: 'Tell me about your project',
    desc: 'Context → decision → impact → what you would change now.',
  },
  {
    slug: 'star-behavioral',
    title: 'STAR behavioral answers',
    desc: 'Practice evidence-backed stories about conflict, ownership, and failure.',
  },
  {
    slug: 'clarifying-questions',
    title: 'Clarifying ambiguous requirements',
    desc: 'Turn uncertainty into visible assumptions before you start building.',
  },
  {
    slug: 'technical-decisions',
    title: 'Explain technical decisions',
    desc: 'Name the constraint, options, tradeoff, and resulting outcome.',
  },
  {
    slug: 'english-patterns',
    title: 'Frontend vocabulary & sentence patterns',
    desc: 'Natural language for explaining implementation and tradeoffs.',
  },
];
export const content: StudyItem[] = lessons;
export const allContent: ContentMeta[] = [
  ...lessons,
  ...questions.map((title, i) => ({
    id: `q-${i}`,
    slug: `questions/${i + 1}`,
    title,
    kind: 'question' as const,
    track: ['JavaScript', 'React', 'Browser', 'Accessibility'][i % 4],
    difficulty: (i % 3 === 0 ? 'senior' : 'advanced') as ContentMeta['difficulty'],
    tags: ['interview', 'practice'],
    estimatedMinutes: 5,
  })),
  ...rounds.map((r) => ({
    id: `round-${r.slug}`,
    slug: `rounds/${r.slug}`,
    title: r.title,
    kind: 'round' as const,
    track: 'Interview rounds',
    difficulty: 'senior' as const,
    tags: ['round', 'practice'],
  })),
  ...communication.map((c) => ({
    id: `comm-${c.slug}`,
    slug: `communication/${c.slug}`,
    title: c.title,
    kind: 'communication' as const,
    track: 'Communication',
    difficulty: 'advanced' as const,
    tags: ['speaking', 'behavioral'],
  })),
];
export function getLesson(slug: string) {
  return lessons.find((l) => l.slug === slug);
}
