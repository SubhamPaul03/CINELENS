import { useState } from 'react';
import useAppStore, { GENRE_COLORS } from '../store/useAppStore';

export default function RatingsPage() {
  const getCurrentUser = useAppStore(s => s.getCurrentUser);
  const getMovie       = useAppStore(s => s.getMovie);
  const deleteRating   = useAppStore(s => s.deleteRating);
  const watchlist      = useAppStore(s => s.watchlist);
  const toggleWatchlist = useAppStore(s => s.toggleWatchlist);
  const movies         = useAppStore(s => s.movies);
  const openModal      = useAppStore(s => s.openModal);
  const [tab, setTab]  = useState('ratings');

  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const rated = Object.entries(currentUser.ratings)
    .map(([id, rating]) => ({ movie: getMovie(+id), rating }))
    .filter(x => x.movie);
  const avg     = rated.length ? (rated.reduce((s, x) => s + x.rating, 0) / rated.length) : 0;
  const best    = rated.length ? [...rated].sort((a, b) => b.rating - a.rating)[0] : null;
  const topGenres = {};
  rated.forEach(({ movie, rating }) => movie.genre.forEach(g => { topGenres[g] = (topGenres[g] || 0) + rating; }));
  const topGenre = Object.entries(topGenres).sort((a, b) => b[1] - a[1])[0];
  const dist     = [1,2,3,4,5].map(s => rated.filter(x => x.rating === s).length);
  const maxDist  = Math.max(...dist, 1);
  const sorted   = [...rated].sort((a, b) => b.rating - a.rating);
  const watchlistMovies = movies.filter(m => watchlist.has(m.id));
  const insightText = rated.length
    ? `This is your personal viewing ledger: every score shapes the recommendation engine, reveals your strongest genre leanings, and keeps a clean record of what you loved, skipped, or might revisit.`
    : `Start rating films to build a taste profile. As you score more titles, CINE·LENS learns your patterns and turns this page into a snapshot of your movie personality.`;

  const tabBtn = (active) => ({
    padding: '6px 14px', borderRadius: 4, fontSize: '.8rem', fontWeight: 500,
    cursor: 'pointer', border: 'none', transition: 'all .18s', whiteSpace: 'nowrap',
    background: active ? 'var(--color-ink)' : 'transparent',
    color: active ? 'var(--color-surface)' : 'var(--color-muted)',
    boxShadow: active ? '2px 2px 0 rgba(28,24,20,.18), inset 0 1px 0 rgba(255,255,255,.06)' : 'none',
  });

  const statCard = (icon, label, val, small) => (
    <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 7, padding: '14px 16px', boxShadow: 'var(--shadow-card)', transition: 'all .2s', cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: small ? '1rem' : '1.8rem', fontWeight: 900, lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-ink)' }}>{val}</div>
    </div>
  );

  return (
    <div style={{ padding: '24px 28px', color: 'var(--color-ink)', background: 'var(--color-beige)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1.5px solid var(--color-border)', paddingBottom: 12, marginBottom: 22, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', fontStyle: 'italic', color: 'var(--color-ink)' }}>{currentUser.name}'s Ratings</div>
          <div style={{ fontSize: '.72rem', color: 'var(--color-muted)' }}>{rated.length} film{rated.length !== 1 ? 's' : ''} rated · {watchlistMovies.length} in watchlist</div>
          <div style={{ maxWidth: 660, fontSize: '.78rem', color: 'var(--color-muted)', lineHeight: 1.6, marginTop: 8 }}>
            {insightText}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <div style={tabBtn(tab === 'ratings')} onClick={() => setTab('ratings')}>⭐ Ratings ({rated.length})</div>
          <div style={tabBtn(tab === 'watchlist')} onClick={() => setTab('watchlist')}>❤️ Watchlist ({watchlistMovies.length})</div>
        </div>
      </div>

      {tab === 'ratings' && <>
        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 22 }}>
          {statCard('🎬', 'Films Rated',     rated.length,              false)}
          {statCard('📊', 'Avg Rating',      avg ? avg.toFixed(1) : '—', false)}
          {statCard('🏆', 'Top Rated',       best ? best.movie.title : '—', true)}
          {statCard('🎭', 'Fav Genre',       topGenre ? topGenre[0] : '—', true)}
        </div>

        {/* Distribution */}
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 7, padding: 18, marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.52rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 14 }}>Rating Distribution</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 72 }}>
            {[1,2,3,4,5].map((star, i) => (
              <div key={star} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.52rem', color: 'var(--color-muted)' }}>{dist[i]}</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                  <div className="dist-bar" style={{ width: '100%', height: `${(dist[i] / maxDist * 100).toFixed(0)}%` }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.52rem', color: 'var(--color-muted)' }}>{'★'.repeat(star)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 7, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.2fr 1fr 1.2fr', padding: '9px 16px', background: 'var(--color-beige-mid)', borderBottom: '1.5px solid var(--color-border)', fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--color-muted)', boxShadow: 'inset 0 -1px 0 rgba(28,24,20,.06)' }}>
            <span>Film</span><span>Year</span><span>Genre</span><span>Rating</span><span></span>
          </div>
          {sorted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10, opacity: .25 }}>⭐</div>
              <div style={{ fontSize: '.85rem', color: 'var(--color-muted)' }}>No ratings yet. Go to Recommendations and start rating!</div>
            </div>
          ) : sorted.map(({ movie, rating }) => {
            const gc = GENRE_COLORS[movie.genre?.[0]] || { bg: '#7c3aed', text: '#fff' };
            return (
              <div key={movie.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.2fr 1fr 1.2fr', padding: '10px 16px', borderBottom: '1px solid var(--color-beige-mid)', alignItems: 'center', transition: 'background .13s' }}
                   onMouseEnter={e => e.currentTarget.style.background = 'var(--color-beige)'}
                   onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.82rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                  <span style={{ fontSize: '1.1rem' }}>{movie.emoji}</span>{movie.title}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--color-muted)' }}>{movie.year}</div>
                <div>
                  <span className="badge-stamp" style={{ fontSize: '.46rem', textTransform: 'uppercase', letterSpacing: '.06em', padding: '2px 5px', background: gc.bg, color: gc.text }}>{movie.genre?.[0]}</span>
                </div>
                <div style={{ color: 'var(--color-gold)', fontSize: '.7rem', letterSpacing: 1 }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div>
                <div>
                  <button style={{ fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-muted)', cursor: 'pointer', padding: '3px 7px', borderRadius: 3, border: '1px solid var(--color-border)', background: 'none', transition: 'all .13s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                    onClick={() => deleteRating(movie.id)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      </>}

      {tab === 'watchlist' && (
        watchlistMovies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12, opacity: .2 }}>❤️</div>
            <div style={{ fontSize: '.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>Your watchlist is empty.<br/>Click the heart on any film card to save it.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(178px,1fr))', gap: 16 }}>
            {watchlistMovies.map((movie, i) => (
              <div key={movie.id} className="movie-card paper-card" style={{ borderRadius: 7, overflow: 'hidden', cursor: 'pointer', animation: `rise .35s both`, animationDelay: `${i*.05}s` }}
                   onClick={() => openModal('detail', { movieId: movie.id })}>
                <div style={{ width: '100%', aspectRatio: '2/3', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: movie.posterImg ? '#888' : `hsl(${(movie.id*47)%360},14%,78%)` }}>
                  {movie.posterImg && <img src={movie.posterImg} alt={movie.title} className="poster-zoom" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }} />}
                  {!movie.posterImg && <span style={{ fontSize: '2.4rem' }}>{movie.emoji}</span>}
                  <span style={{ position: 'absolute', top: 7, right: 7, fontSize: '.9rem', cursor: 'pointer', zIndex: 5 }}
                        onClick={e => { e.stopPropagation(); toggleWatchlist(movie.id); }} title="Remove from watchlist">❤️</span>
                </div>
                <div style={{ padding: '10px 12px 12px', background: 'var(--color-card)' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '.9rem', lineHeight: 1.25, marginBottom: 3, color: 'var(--color-ink)' }}>{movie.title}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.5rem', color: 'var(--color-muted)', letterSpacing: '.05em' }}>{movie.year} · {movie.genre?.join(' / ')}</div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
