import { useState, useEffect, useCallback } from 'react';
import useAppStore, { GENRE_COLORS } from '../../store/useAppStore';

export default function HeroBanner({ recommendations }) {
  const openModal = useAppStore(s => s.openModal);
  const toggleWatchlist = useAppStore(s => s.toggleWatchlist);
  const watchlist = useAppStore(s => s.watchlist);
  const getCurrentUser = useAppStore(s => s.getCurrentUser);
  const user = getCurrentUser();

  const featured = recommendations.slice(0, 3);
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((i) => {
    if (i === activeIdx) return;
    setFading(true);
    setTimeout(() => { setActiveIdx(i); setFading(false); }, 350);
  }, [activeIdx]);

  useEffect(() => {
    if (featured.length <= 1) return;
    const t = setInterval(() => goTo((activeIdx + 1) % featured.length), 6000);
    return () => clearInterval(t);
  }, [goTo, activeIdx, featured.length]);

  if (!featured.length) return null;
  const movie = featured[activeIdx] || featured[0];
  const isWatchlisted = watchlist.has(movie.id);
  const hue = (movie.id * 47) % 360;

  return (
    <div style={{
      position: 'relative', height: 188, borderRadius: 9, overflow: 'hidden',
      marginBottom: 18, border: '1.5px solid var(--color-border)',
      boxShadow: '3px 4px 0 rgba(28,24,20,.12)',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: movie.posterImg ? '#222' : `linear-gradient(135deg, hsl(${hue},22%,14%) 0%, hsl(${hue},18%,26%) 100%)`,
        opacity: fading ? 0 : 1, transition: 'opacity .35s',
      }}>
        {movie.posterImg && <img src={movie.posterImg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(3px) brightness(.45)', transform: 'scale(1.06)' }} />}
      </div>

      {/* Gradient left-to-right */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(16,10,6,.92) 0%, rgba(16,10,6,.55) 55%, rgba(16,10,6,.1) 100%)' }} />

      {/* Film perforations decoration left edge */}
      <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7, zIndex: 2 }}>
        {Array(6).fill(0).map((_, i) => (
          <div key={i} style={{ width: 8, height: 6, borderRadius: 1, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.06)' }} />
        ))}
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 3, height: '100%',
        display: 'flex', alignItems: 'flex-end', padding: '16px 20px 16px 28px', gap: 20,
        opacity: fading ? 0 : 1, transition: 'opacity .3s',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.44rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(253,250,244,.42)', marginBottom: 5 }}>✦ Personalised for {user?.name}</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.3rem,2.5vw,2rem)', fontStyle: 'italic', color: '#fff', lineHeight: 1.1, marginBottom: 6 }}>{movie.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 7 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.46rem', color: 'rgba(253,250,244,.5)' }}>{movie.year}</span>
            {movie.genre?.map(g => {
              const gc = GENRE_COLORS[g] || { bg: '#7c3aed', text: '#fff' };
              return (
                <span key={g} className="badge-stamp" style={{ fontSize: '.43rem', padding: '2px 5px', background: gc.bg, color: gc.text }}>{g}</span>
              );
            })}
          </div>
          <div className="line-clamp-1" style={{ fontSize: '.68rem', color: 'rgba(253,250,244,.45)', maxWidth: 420 }}>{movie.desc}</div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, flexShrink: 0 }}>
          {[
            { label: '⭐ Rate',    onClick: () => openModal('rate', { movieId: movie.id }) },
            {
              label: isWatchlisted ? '❤️ Saved' : '♡ Save',
              onClick: () => toggleWatchlist(movie.id),
              active: isWatchlisted,
            },
          ].map(btn => (
            <button key={btn.label} onClick={btn.onClick} style={{
              padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.1em', textTransform: 'uppercase',
              border: btn.active ? '1.5px solid #c41d7f' : '1.5px solid rgba(253,250,244,.3)',
              color: '#fff',
              background: btn.active ? 'rgba(196,29,127,.55)' : 'rgba(16,10,6,.4)',
              backdropFilter: 'blur(4px)', borderRadius: 4, cursor: 'pointer', transition: 'all .16s',
              boxShadow: '1px 1px 0 rgba(0,0,0,.3)',
            }}>{btn.label}</button>
          ))}
        </div>
      </div>

      {/* Carousel dots */}
      {featured.length > 1 && (
        <div style={{ position: 'absolute', bottom: 12, right: 16, display: 'flex', gap: 5, zIndex: 5 }}>
          {featured.map((_, i) => (
            <div key={i} onClick={() => goTo(i)} style={{ width: i === activeIdx ? 16 : 5, height: 5, borderRadius: 3, background: i === activeIdx ? '#fff' : 'rgba(255,255,255,.3)', transition: 'all .3s', cursor: 'pointer' }} />
          ))}
        </div>
      )}
    </div>
  );
}
