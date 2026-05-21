import { useEffect, useRef, useState } from 'react';
import useAppStore from '../../store/useAppStore';
import ProfileAvatar from '../ui/ProfileAvatar';
import { imageFileToDataUrl } from '../../utils/images';

export default function DetailModal() {
  const activeModal = useAppStore(s => s.activeModal);
  const getMovie = useAppStore(s => s.getMovie);
  const users = useAppStore(s => s.users);
  const comments = useAppStore(s => s.comments);
  const currentUser = useAppStore(s => s.getCurrentUser());
  const addComment = useAppStore(s => s.addComment);
  const deleteComment = useAppStore(s => s.deleteComment);
  const openModal = useAppStore(s => s.openModal);
  const closeModal = useAppStore(s => s.closeModal);
  const setPoster = useAppStore(s => s.setPoster);
  const fileInputRef = useRef(null);
  const [commentText, setCommentText] = useState('');

  const movieId = activeModal?.data?.movieId;
  const movie = getMovie(movieId);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeModal]);

  const handleFile = async (file) => {
    if (!file) return;
    setPoster(movieId, await imageFileToDataUrl(file, { maxWidth: 900, maxHeight: 1350, quality: 0.78 }));
  };

  if (!movie) return null;
  const communityRatings = users.filter(u => u.ratings[movie.id]).map(u => ({ user: u, rating: u.ratings[movie.id] }));
  const movieComments = comments
    .filter(c => c.movieId === movie.id)
    .map(c => ({ ...c, user: users.find(u => u.id === c.userId) }))
    .filter(c => c.user)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const submitComment = () => {
    addComment(movie.id, commentText);
    setCommentText('');
  };
  const formatCommentDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="modal-overlay" style={{ position:'fixed', inset:0, background:'rgba(28,24,20,.58)', backdropFilter:'blur(5px)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
         onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal-content" style={{ background:'var(--color-surface)', border:'2px solid var(--color-ink)', borderRadius:6, width:'100%', maxWidth:580, overflow:'hidden', maxHeight:'88vh', overflowY:'auto', boxShadow:'var(--shadow-modal)' }}>
        {/* Hero */}
        <div style={{ height:190, position:'relative', overflow:'hidden', background:'var(--color-beige-deep)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {movie.posterImg && <img src={movie.posterImg} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(28,24,20,.88) 0%,rgba(28,24,20,.2) 55%,transparent 100%)' }} />
          <span style={{ fontSize:'4rem', position:'relative', zIndex:1, opacity: movie.posterImg ? 0 : 1 }}>{movie.emoji}</span>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'18px 22px', zIndex:2 }}>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'1.65rem', color:'var(--color-surface)', fontStyle:'italic' }}>{movie.title}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'.54rem', color:'rgba(253,250,244,.6)', letterSpacing:'.08em', marginTop:3 }}>{movie.year} · {movie.genre.join(' / ')}</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:'20px 22px' }}>
          {/* Poster upload */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'.52rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--color-muted)', marginBottom:7 }}>Film Poster / Banner Image</div>
            <div
              style={{ border:'2px dashed var(--color-border)', borderRadius:5, padding:14, textAlign:'center', cursor:'pointer', transition:'all .15s', background:'var(--color-beige)', position:'relative', overflow:'hidden' }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
            >
              <input ref={fileInputRef} type="file" accept="image/*" style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer', width:'100%', height:'100%' }}
                     onChange={(e) => handleFile(e.target.files[0])} />
              {movie.posterImg && <img src={movie.posterImg} alt="" style={{ width:'100%', height:120, objectFit:'cover', borderRadius:3, marginBottom:8 }} />}
              <div style={{ fontSize:'.73rem', color:'var(--color-muted)' }}><strong style={{ color:'var(--color-accent2)' }}>Click to upload</strong> or drag & drop a poster image</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'.48rem', color:'var(--color-muted)', letterSpacing:'.06em', marginTop:3 }}>JPG · PNG · WEBP · GIF</div>
            </div>
            {movie.posterImg && (
              <div style={{ marginTop:6 }}>
                <button style={{ fontFamily:'var(--font-mono)', fontSize:'.52rem', letterSpacing:'.06em', textTransform:'uppercase', padding:'6px 10px', borderRadius:3, border:'1px solid var(--color-border)', background:'none', color:'var(--color-muted)', cursor:'pointer' }} onClick={() => setPoster(movieId, null)}>Remove Poster</button>
              </div>
            )}
          </div>

          {/* Synopsis */}
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'.52rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--color-muted)', marginBottom:7 }}>Synopsis</div>
          <div style={{ fontSize:'.8rem', lineHeight:1.7, color:'var(--color-muted)', marginBottom:18 }}>{movie.desc}</div>

          {/* Tags */}
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'.52rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--color-muted)', marginBottom:7 }}>Tags</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:18 }}>
            {movie.tags.map(tag => (
              <span key={tag} style={{ fontFamily:'var(--font-mono)', fontSize:'.52rem', padding:'3px 8px', borderRadius:2, border:'1px solid var(--color-border)', color:'var(--color-muted)', textTransform:'uppercase', letterSpacing:'.05em' }}>{tag}</span>
            ))}
          </div>

          {/* Community ratings */}
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'.52rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--color-muted)', marginBottom:7 }}>Community Ratings</div>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:18 }}>
            {communityRatings.length === 0 ? (
              <div style={{ fontSize:'.7rem', color:'var(--color-muted)', fontStyle:'italic' }}>No ratings yet</div>
            ) : communityRatings.map(({ user, rating }) => (
              <div key={user.id} style={{ display:'flex', alignItems:'center', gap:9, fontSize:'.73rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:5, width:100, flexShrink:0 }}>
                  <ProfileAvatar user={user} size={22} />
                  <span style={{ color:'var(--color-ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</span>
                </div>
                <span style={{ flex:1, fontSize:'.67rem', color:'var(--color-muted)' }}>{rating >= 4 ? 'Loved it' : rating >= 3 ? 'Liked it' : "Didn't enjoy"}</span>
                <span style={{ color:'var(--color-gold)', fontSize:'.7rem', letterSpacing:1 }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
              </div>
            ))}
          </div>

          {/* Comments */}
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'.52rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--color-muted)', marginBottom:7 }}>Comments</div>
          <div style={{ background:'var(--color-beige)', border:'1.5px solid var(--color-border)', borderRadius:6, padding:12, marginBottom:18 }}>
            <div style={{ display:'flex', gap:9, alignItems:'flex-start', marginBottom:12 }}>
              <ProfileAvatar user={currentUser} size={30} />
              <div style={{ flex:1, minWidth:0 }}>
                <textarea
                  className="field-inset"
                  style={{ width:'100%', minHeight:70, resize:'vertical', padding:'9px 10px', borderRadius:5, fontFamily:'var(--font-body)', fontSize:'.78rem', lineHeight:1.5 }}
                  placeholder="Share a thought about this film..."
                  maxLength={280}
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') submitComment();
                  }}
                />
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginTop:7 }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'.48rem', letterSpacing:'.06em', color:'var(--color-muted)' }}>{commentText.length}/280</span>
                  <button
                    className="btn-primary"
                    style={{ padding:'7px 13px', fontFamily:'var(--font-mono)', fontSize:'.54rem', letterSpacing:'.08em', textTransform:'uppercase', borderRadius:4, cursor:'pointer', opacity: commentText.trim() ? 1 : .55 }}
                    onClick={submitComment}
                    disabled={!commentText.trim()}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {movieComments.length === 0 ? (
                <div style={{ fontSize:'.72rem', color:'var(--color-muted)', fontStyle:'italic', padding:'4px 0 2px' }}>No comments yet. Start the conversation.</div>
              ) : movieComments.map(comment => (
                <div key={comment.id} style={{ display:'flex', gap:9, alignItems:'flex-start' }}>
                  <ProfileAvatar user={comment.user} size={30} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:7, marginBottom:2 }}>
                      <span style={{ fontSize:'.76rem', fontWeight:700, color:'var(--color-ink)' }}>{comment.user.name}</span>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:'.47rem', letterSpacing:'.06em', color:'var(--color-muted)', textTransform:'uppercase' }}>{formatCommentDate(comment.createdAt)}</span>
                    </div>
                    <div style={{ fontSize:'.76rem', color:'var(--color-muted)', lineHeight:1.55, overflowWrap:'anywhere' }}>{comment.text}</div>
                    {comment.userId === currentUser?.id && (
                      <button
                        type="button"
                        style={{ marginTop:5, border:'none', background:'transparent', color:'var(--color-accent)', fontFamily:'var(--font-mono)', fontSize:'.48rem', letterSpacing:'.08em', textTransform:'uppercase', cursor:'pointer', padding:0 }}
                        onClick={() => deleteComment(comment.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn-primary" style={{ flex:1, padding:9, fontFamily:'var(--font-mono)', fontSize:'.6rem', letterSpacing:'.1em', textTransform:'uppercase', borderRadius:4, cursor:'pointer' }} onClick={() => openModal('rate', { movieId })}>Rate this Film</button>
            <button className="btn-ghost" style={{ flex:1, padding:9, fontFamily:'var(--font-mono)', fontSize:'.6rem', letterSpacing:'.1em', textTransform:'uppercase', borderRadius:4, cursor:'pointer' }} onClick={closeModal}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
