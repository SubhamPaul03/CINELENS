import useAppStore, { GENRE_COLORS } from '../../store/useAppStore';
import { imageFileToDataUrl } from '../../utils/images';

export default function MovieCard({ movie, maxScore, index, isListView }) {
  const openModal    = useAppStore(s => s.openModal);
  const setPoster    = useAppStore(s => s.setPoster);
  const toggleWatchlist = useAppStore(s => s.toggleWatchlist);
  const watchlist    = useAppStore(s => s.watchlist);
  const isWatchlisted = watchlist.has(movie.id);

  const pct = maxScore > 0 ? ((movie.score / maxScore) * 100).toFixed(0) : 0;
  const hue = (movie.id * 47) % 360;
  const gc  = GENRE_COLORS[movie.genre?.[0]] || { bg: '#7c3aed', text: '#fff' };

  const handleUpload = (e) => {
    e.stopPropagation();
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = async ev => {
      const f = ev.target.files[0]; if (!f) return;
      setPoster(movie.id, await imageFileToDataUrl(f, { maxWidth: 900, maxHeight: 1350, quality: 0.78 }));
    };
    inp.click();
  };

  // ── LIST ROW ──────────────────────────────────────────────────────────
  if (isListView) {
    return (
      <div
        className="movie-card paper-card"
        style={{ borderRadius: 6, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'row', animation: `rise .35s both`, animationDelay: `${Math.min(index * .034, .55)}s` }}
        onClick={() => openModal('detail', { movieId: movie.id })}
      >
        <div style={{ width: 74, height: 104, flexShrink: 0, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5, background: movie.posterImg ? '#888' : `hsl(${hue},14%,78%)` }}>
          {movie.posterImg && <img src={movie.posterImg} alt={movie.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
          {!movie.posterImg && <><span style={{ fontSize: '2rem', position: 'relative', zIndex: 1 }}>{movie.emoji}</span><span style={{ fontFamily: 'var(--font-mono)', fontSize: '.46rem', color: 'rgba(28,24,20,.5)', letterSpacing: '.1em', position: 'relative', zIndex: 1 }}>{movie.year}</span></>}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '.9rem', lineHeight: 1.25, flex: 1, color: 'var(--color-ink)' }}>{movie.title}</span>
            <span className="badge-stamp" style={{ fontSize: '.5rem', background: 'var(--color-ink)', color: 'var(--color-surface)', padding: '2px 6px' }}>{pct}%</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.5rem', color: 'var(--color-muted)', letterSpacing: '.05em', marginBottom: 5, marginTop: 2 }}>{movie.year} · {movie.genre?.join(' / ')}</div>
          <div className="line-clamp-1" style={{ fontSize: '.67rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>{movie.desc}</div>
        </div>
      </div>
    );
  }

  // ── GRID CARD ─────────────────────────────────────────────────────────
  return (
    <div
      className="movie-card paper-card"
      style={{ borderRadius: 7, overflow: 'hidden', cursor: 'pointer', animation: `rise .35s both`, animationDelay: `${Math.min(index * .034, .55)}s` }}
      onClick={() => openModal('detail', { movieId: movie.id })}
    >
      {/* Poster area */}
      <div style={{ width: '100%', aspectRatio: '2/3', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, background: movie.posterImg ? '#888' : `hsl(${hue},14%,78%)` }}>
        {movie.posterImg && <img src={movie.posterImg} alt={movie.title} className="poster-zoom" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }} />}
        {!movie.posterImg && <>
          <span style={{ fontSize: '2.6rem', lineHeight: 1, position: 'relative', zIndex: 1 }}>{movie.emoji}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.5rem', color: 'rgba(28,24,20,.5)', letterSpacing: '.1em', position: 'relative', zIndex: 1 }}>{movie.year}</span>
        </>}

        {/* Match badge (top-right) */}
        <span className="badge-stamp" style={{ position: 'absolute', top: 7, right: 7, background: 'var(--color-ink)', color: 'var(--color-surface)', fontSize: '.5rem', padding: '2px 6px', zIndex: 3 }}>
          {pct}%
        </span>

        {/* Watchlist heart (top-left) */}
        <span
          style={{ position: 'absolute', top: 6, left: 7, fontSize: '.95rem', zIndex: 5, cursor: 'pointer', filter: isWatchlisted ? 'none' : 'grayscale(1) opacity(.35)', transition: 'all .2s', userSelect: 'none' }}
          onClick={e => { e.stopPropagation(); toggleWatchlist(movie.id); }}
          title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {isWatchlisted ? '❤️' : '🤍'}
        </span>

        {/* Genre badge (bottom-left) */}
        <span className="badge-stamp" style={{ position: 'absolute', bottom: 7, left: 7, background: gc.bg, color: gc.text, fontSize: '.44rem', padding: '2px 5px', zIndex: 3, textTransform: 'uppercase', letterSpacing: '.06em' }}>
          {movie.genre?.[0]}
        </span>

        {/* Hover overlay */}
        <div className="card-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(16,12,8,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, zIndex: 4 }}>
          <button style={{ padding: '6px 11px', fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.08em', textTransform: 'uppercase', borderRadius: 3, cursor: 'pointer', border: '1.5px solid var(--color-accent)', color: '#fff', background: 'var(--color-accent)', backdropFilter: 'blur(4px)', boxShadow: '1px 1px 0 rgba(0,0,0,.3)' }} onClick={e => { e.stopPropagation(); openModal('rate', { movieId: movie.id }); }}>Rate</button>
          <button style={{ padding: '6px 11px', fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.08em', textTransform: 'uppercase', borderRadius: 3, cursor: 'pointer', border: '1.5px solid rgba(253,250,244,.5)', color: '#fff', background: 'rgba(28,24,20,.5)', backdropFilter: 'blur(4px)', boxShadow: '1px 1px 0 rgba(0,0,0,.3)' }} onClick={e => { e.stopPropagation(); openModal('detail', { movieId: movie.id }); }}>Details</button>
          <button style={{ padding: '6px 11px', fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.08em', textTransform: 'uppercase', borderRadius: 3, cursor: 'pointer', border: '1.5px solid rgba(26,77,140,.8)', color: '#fff', background: 'rgba(26,77,140,.5)', backdropFilter: 'blur(4px)', boxShadow: '1px 1px 0 rgba(0,0,0,.3)' }} onClick={handleUpload}>📷</button>
        </div>
      </div>

      {/* Card info */}
      <div style={{ padding: '10px 12px 12px', background: 'var(--color-card)' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '.88rem', lineHeight: 1.25, marginBottom: 3, color: 'var(--color-ink)' }}>{movie.title}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.48rem', color: 'var(--color-muted)', letterSpacing: '.05em', marginBottom: 6 }}>{movie.year} · {movie.genre?.join(' / ')}</div>
        <div className="line-clamp-2" style={{ fontSize: '.65rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>{movie.desc}</div>
        {/* FIT bar */}
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ flex: 1, height: 3, background: 'var(--color-beige-deep)', borderRadius: 2, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(28,24,20,.1)' }}>
            <div className="score-fill" style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, var(--color-accent2), var(--color-accent))`, width: `${pct}%` }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.46rem', color: 'var(--color-muted)', flexShrink: 0 }}>FIT</span>
        </div>
      </div>
    </div>
  );
}
