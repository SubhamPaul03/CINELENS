import { create } from 'zustand';

const THEME_KEY = 'cinelens_theme';

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark';
  } catch {
    return false;
  }
}

function applyTheme(isDark) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', isDark);
}

const useThemeStore = create((set) => ({
  isDark: readStoredTheme(),

  toggle: () =>
    set(state => {
      const next = !state.isDark;
      try {
        localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      } catch { /* ignore */ }

      applyTheme(next);

      return { isDark: next };
    }),

  // Initialize on mount
  init: () => {
    const isDark = readStoredTheme();
    applyTheme(isDark);
    set({ isDark });
  },
}));

export default useThemeStore;
