import { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { GENRE_COLORS } from '../../store/useAppStore';

const accHead = { display: 'flex', alignItems: 'center', padding: '11px 16px', cursor: 'pointer', userSelect: 'none', gap: 8, transition: 'background .14s' };
const accLabel = { fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--color-muted)', flex: 1 };

export default function GenreFilter() {
  const [isOpen, setIsOpen] = useState(true);
  const selectedGenres = useAppStore(s => s.selectedGenres);
  const movies = useAppStore(s => s.movies);
  const toggleGenre = useAppStore(s => s.toggleGenre);
  const clearGenres = useAppStore(s => s.clearGenres);
  const genres = [...new Set(movies.flatMap(m => m.genre || []))].sort();

  return (
    <div style={{ borderBottom: '1.5px solid var(--color-border)' }}>
      <div
        style={{ ...accHead, background: 'transparent' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-beige)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={accLabel}>Genre Filter</span>
        {selectedGenres.size > 0 && (
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: '.46rem', letterSpacing: '.06em', color: 'var(--color-accent)', cursor: 'pointer', flexShrink: 0 }}
            onClick={e => { e.stopPropagation(); clearGenres(); }}
            title="Clear all genre filters"
          >✕ Clear</span>
        )}
        <span style={{ color: 'var(--color-muted)', fontSize: '.58rem', flexShrink: 0, transition: 'transform .22s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
      </div>

      <div className={isOpen ? 'acc-body-open' : 'acc-body-shut'}>
        <div style={{ padding: '4px 16px 14px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {genres.map(g => {
            const active = selectedGenres.has(g);
            const gc = GENRE_COLORS[g] || { bg: 'var(--color-accent)', text: '#fff' };
            return (
              <span
                key={g}
                className="genre-tag"
                style={active ? {
                  background: gc.bg, borderColor: gc.bg, color: gc.text,
                  boxShadow: `0 1px 0 rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.15)`,
                } : {}}
                onClick={() => toggleGenre(g)}
              >{g}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
