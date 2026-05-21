import { useState, useEffect, useCallback } from 'react';
import useAppStore from '../../store/useAppStore';
import StarRating from '../ui/StarRating';

export default function RateModal() {
  const activeModal = useAppStore(s => s.activeModal);
  const getMovie = useAppStore(s => s.getMovie);
  const getCurrentUser = useAppStore(s => s.getCurrentUser);
  const rateMovie = useAppStore(s => s.rateMovie);
  const closeModal = useAppStore(s => s.closeModal);

  const movieId = activeModal?.data?.movieId;
  const movie = getMovie(movieId);
  const currentUser = getCurrentUser();
  const existingRating = currentUser?.ratings?.[movieId] || 0;
  const [rating, setRating] = useState(existingRating);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeModal]);

  const handleSubmit = useCallback(() => { if (!rating) { closeModal(); return; } rateMovie(movieId, rating); }, [rating, movieId, rateMovie, closeModal]);

  if (!movie) return null;

  return (
    <div className="modal-overlay" style={{ position:'fixed', inset:0, background:'rgba(28,24,20,.58)', backdropFilter:'blur(5px)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
         onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal-content" style={{ background:'var(--color-surface)', border:'2px solid var(--color-ink)', borderRadius:6, width:'100%', maxWidth:420, overflow:'hidden', boxShadow:'var(--shadow-modal)' }}>
        {/* Poster */}
        <div style={{ height:150, position:'relative', overflow:'hidden', background:'var(--color-beige-deep)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {movie.posterImg && <img src={movie.posterImg} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(28,24,20,.8) 0%,transparent 55%)' }} />
          <span style={{ fontSize:'2.8rem', position:'relative', zIndex:1, opacity: movie.posterImg ? 0 : 1 }}>{movie.emoji}</span>
        </div>
        {/* Body */}
        <div style={{ padding:'22px 24px 26px' }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'.52rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--color-muted)', marginBottom:5 }}>Rate this film</div>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'1.4rem', marginBottom:3, color:'var(--color-ink)' }}>{movie.title}</div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'.55rem', color:'var(--color-muted)', marginBottom:14 }}>{movie.year} · {movie.genre.join(' / ')}</div>
          <div style={{ fontSize:'.76rem', lineHeight:1.65, color:'var(--color-muted)', marginBottom:18, paddingBottom:16, borderBottom:'1px solid var(--color-border)' }}>{movie.desc}</div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'.58rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--color-muted)', marginBottom:9 }}>Your rating</div>
          <div style={{ marginBottom:20 }}><StarRating value={rating} onChange={setRating} /></div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn-primary" style={{ flex:1, padding:9, fontFamily:'var(--font-mono)', fontSize:'.6rem', letterSpacing:'.1em', textTransform:'uppercase', borderRadius:4, cursor:'pointer' }} onClick={handleSubmit}>Save Rating</button>
            <button className="btn-ghost" style={{ flex:1, padding:9, fontFamily:'var(--font-mono)', fontSize:'.6rem', letterSpacing:'.1em', textTransform:'uppercase', borderRadius:4, cursor:'pointer' }} onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
