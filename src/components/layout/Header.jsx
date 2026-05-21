import useAppStore from '../../store/useAppStore';
import { ALGO_DATA } from '../../data/presets';
import { NavLink } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

/* All colours reference CSS variables so both themes always resolve correctly */
const css = {
  header: {
    height: 'var(--header-h)', background: 'var(--color-surface)',
    borderBottom: '1.5px solid var(--color-border)',
    display: 'flex', alignItems: 'center', padding: '0 20px 0 0',
    position: 'relative', zIndex: 200, flexShrink: 0,
    boxShadow: '0 1px 0 rgba(28,24,20,.06), 0 2px 8px rgba(28,24,20,.04)',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 12,
    width: 'var(--sidebar-w)', padding: '0 20px',
    borderRight: '1.5px solid var(--color-border)',
    height: '100%', flexShrink: 0,
  },
  logoBox: {
    width: 32, height: 32, background: 'var(--color-ink)',
    borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, boxShadow: '2px 2px 0 rgba(28,24,20,.2), inset 0 1px 0 rgba(255,255,255,.08)',
  },
  brandName: { fontFamily: 'var(--font-serif)', fontSize: '1.2rem', lineHeight: 1, letterSpacing: '-.01em', color: 'var(--color-ink)' },
  brandTag:  { fontFamily: 'var(--font-mono)', fontSize: '.42rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--color-muted)', marginTop: 3 },
  nav:  { display: 'flex', alignItems: 'center', height: '100%', padding: '0 20px', gap: 2, borderRight: '1.5px solid var(--color-border)' },
  search: { flex: 1, padding: '0 18px', display: 'flex', alignItems: 'center', position: 'relative' },
  meta:  { display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16 },
  livePill: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontFamily: 'var(--font-mono)', fontSize: '.48rem', letterSpacing: '.12em', textTransform: 'uppercase',
    color: 'var(--color-muted)', padding: '4px 10px',
    border: '1px solid var(--color-border)', borderRadius: 3,
    background: 'var(--color-beige-mid)',
    boxShadow: 'inset 0 1px 2px rgba(28,24,20,.06)',
  },
  algoChip: {
    fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.12em', textTransform: 'uppercase',
    background: 'var(--color-ink)', color: 'var(--color-surface)',
    padding: '5px 10px', borderRadius: 3,
    boxShadow: '2px 2px 0 rgba(28,24,20,.2)',
  },
};

function NavBtn({ to, icon, label }) {
  return (
    <NavLink to={to} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 4,
          fontSize: '.8rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
          background: isActive ? 'var(--color-ink)' : 'transparent',
          color: isActive ? 'var(--color-surface)' : 'var(--color-muted)',
          boxShadow: isActive ? '2px 2px 0 rgba(28,24,20,.15), inset 0 1px 0 rgba(255,255,255,.06)' : 'none',
          transition: 'all .18s',
        }}>
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'currentColor', flexShrink: 0 }}>
            <path d={icon} />
          </svg>
          {label}
        </div>
      )}
    </NavLink>
  );
}

export default function Header() {
  const searchQuery = useAppStore(s => s.searchQuery);
  const setSearchQuery = useAppStore(s => s.setSearchQuery);
  const openModal = useAppStore(s => s.openModal);
  const algorithm = useAppStore(s => s.algorithm);
  const algoData = ALGO_DATA.find(a => a.id === algorithm);

  return (
    <header style={css.header}>
      {/* Brand */}
      <div style={css.brand}>
        <div style={css.logoBox}>
          <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: 'var(--color-beige)' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
        </div>
        <div>
          <div style={css.brandName}>CINE<span style={{ color: 'var(--color-accent)' }}>·</span>LENS</div>
          <div style={css.brandTag}>Film Recommendation Engine</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={css.nav}>
        <NavBtn to="/home" icon="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" label="Recommendations" />
        <NavBtn to="/ratings" icon="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" label="Your Ratings" />
      </nav>

      {/* Search */}
      <div style={css.search}>
        <div style={{ width: '100%', maxWidth: 380, position: 'relative' }}>
          <svg viewBox="0 0 24 24" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, fill: 'var(--color-muted)', pointerEvents: 'none' }}>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            className="field-inset"
            style={{ width: '100%', padding: '7px 12px 7px 32px', borderRadius: 5, fontFamily: 'var(--font-body)', fontSize: '.8rem' }}
            placeholder="Search films, genres, tags…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Meta */}
      <div style={css.meta}>
        {/* Add movie button */}
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: 'var(--font-mono)', fontSize: '.48rem', letterSpacing: '.1em', textTransform: 'uppercase',
            color: 'var(--color-muted)', padding: '4px 9px',
            border: '1px solid var(--color-border)', borderRadius: 3,
            background: 'var(--color-beige-mid)', cursor: 'pointer',
            boxShadow: 'inset 0 1px 2px rgba(28,24,20,.06)',
            transition: 'all .15s',
          }}
          onClick={() => openModal('addMovie')}
          title="Add a film to the catalog"
        >
          🎬 + Film
        </button>

        {/* Live pill */}
        <div style={css.livePill}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-accent2)', animation: 'blink 2s infinite', display: 'inline-block' }} />
          Live
        </div>

        {/* Algo chip */}
        <div style={css.algoChip}>{algoData?.chipLabel || 'COLLAB'}</div>

        <ThemeToggle />
      </div>
    </header>
  );
}
