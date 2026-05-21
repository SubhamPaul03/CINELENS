import { Moon, Sun } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';

export default function ThemeToggle() {
  const isDark = useThemeStore(s => s.isDark);
  const toggle = useThemeStore(s => s.toggle);

  return (
    <button
      style={{
        width: 32, height: 32, borderRadius: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1.5px solid var(--color-border)',
        color: 'var(--color-muted)',
        background: 'linear-gradient(180deg, var(--color-card), var(--color-beige-mid))',
        cursor: 'pointer', transition: 'all .18s',
        boxShadow: 'var(--shadow-inset)',
      }}
      onClick={toggle}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-ink)'; e.currentTarget.style.color = 'var(--color-ink)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-muted)'; }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun size={15} strokeWidth={2.2} /> : <Moon size={15} strokeWidth={2.2} />}
    </button>
  );
}
