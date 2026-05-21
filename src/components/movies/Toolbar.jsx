import useAppStore from '../../store/useAppStore';

export default function Toolbar({ count }) {
  const viewMode = useAppStore(s => s.viewMode);
  const sortMode = useAppStore(s => s.sortMode);
  const setViewMode = useAppStore(s => s.setViewMode);
  const setSortMode = useAppStore(s => s.setSortMode);
  const getCurrentUser = useAppStore(s => s.getCurrentUser);
  const user = getCurrentUser();

  const sortOpts = [
    { val: 'score', label: 'Best Match' },
    { val: 'year',  label: 'Newest' },
    { val: 'title', label: 'A–Z' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--color-ink)' }}>
        Picks for {user?.name}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Count */}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.52rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-muted)', background: 'var(--color-beige-mid)', border: '1px solid var(--color-border)', padding: '3px 9px', borderRadius: 3, boxShadow: 'inset 0 1px 2px rgba(28,24,20,.07)' }}>
          {count} film{count !== 1 ? 's' : ''}
        </span>

        {/* Sort */}
        <select
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '.52rem', letterSpacing: '.08em',
            color: 'var(--color-ink)', background: 'var(--color-beige-mid)',
            border: '1.5px solid var(--color-border)', padding: '5px 8px', borderRadius: 4,
            cursor: 'pointer', outline: 'none', appearance: 'none',
            boxShadow: 'inset 0 1px 2px rgba(28,24,20,.08)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%237a6e5a'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', paddingRight: 24,
          }}
          value={sortMode}
          onChange={e => setSortMode(e.target.value)}
        >
          {sortOpts.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
        </select>

        {/* View mode */}
        <div style={{ display: 'flex', border: '1.5px solid var(--color-border)', borderRadius: 4, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(28,24,20,.07)' }}>
          {[
            { mode: 'grid', icon: '▦' },
            { mode: 'list', icon: '☰' },
          ].map(({ mode, icon }) => (
            <button
              key={mode}
              style={{
                width: 30, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.75rem', cursor: 'pointer', border: 'none', transition: 'all .14s',
                background: viewMode === mode ? 'var(--color-ink)' : 'var(--color-beige-mid)',
                color: viewMode === mode ? 'var(--color-surface)' : 'var(--color-muted)',
              }}
              onClick={() => setViewMode(mode)}
              title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
            >{icon}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
