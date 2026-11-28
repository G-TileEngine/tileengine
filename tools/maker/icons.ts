const PATHS = {
  play: `<path d="M8 5l11 7-11 7z" fill="currentColor"/>`,
  undo: `<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>`,
  more: `<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>`,
  back: `<path d="M15 6l-6 6 6 6"/>`,
  save: `<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>`,
  build: `<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>`,
  rules: `<path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/>`,
  image: `<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>`,
  grid: `<path d="M4 4h16v16H4zM4 10h16M4 15h16M10 4v16M15 4v16"/>`,
  units: `<circle cx="12" cy="7" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>`,
  stages: `<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>`,
  effects: `<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>`,
  levels: `<path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.8z"/>`,
  edit: `<path d="M4 20h4L19 9l-4-4L4 16z"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  resize: `<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>`,
  budgets: `<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>`,
  menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
  down: `<path d="M7 10l5 5 5-5"/>`,
  close: `<path d="M6 6l12 12M18 6L6 18"/>`,
  chevron: `<path d="M9 6l6 6-6 6"/>`,
  check: `<path d="M5 12l5 5 9-10"/>`,
  games: `<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
} as const;
export type IconName = keyof typeof PATHS;
export const ICON_NAMES = Object.keys(PATHS) as readonly IconName[];
export const icon = (name: IconName): string => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name]}</svg>`;
export const thumb = (name: IconName): string => `<span class="thumb">${icon(name)}</span>`;
