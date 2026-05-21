import { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import { ALL_GENRES } from '../../data/movies';
import { GENRE_COLORS } from '../../store/useAppStore';

const MOVIE_EMOJIS = ['🎬','🎭','🎥','🌟','🏆','💥','🌙','🌊','🔥','⚡','❄️','🌿','🎪','🎨','🚀','💊','🌀','🦋','🐉','🤠','🌆','🎼','🥁','👻','⛪','🎾','🏜️','☢️','🐺','📺','💉','🍝','🌺','🔔','🦢'];

export default function AddMovieModal() {
  const closeModal = useAppStore(s => s.closeModal);
  const addMovie = useAppStore(s => s.addMovie);

  const [title, setTitle]         = useState('');
  const [year, setYear]           = useState(new Date().getFullYear());
  const [desc, setDesc]           = useState('');
  const [selectedEmoji, setEmoji] = useState('🎬');
  const [selectedGenres, setGenres] = useState([]);
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError]         = useState('');

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeModal]);

  const toggleGenre = (g) => {
    setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const handleSubmit = () => {
    if (!title.trim()) { setError('Title is required.'); return; }
    if (selectedGenres.length === 0) { setError('Pick at least one genre.'); return; }
    const tags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    addMovie({ title: title.trim(), year, genre: selectedGenres, desc: desc.trim() || `A ${selectedGenres[0]} film.`, emoji: selectedEmoji, tags });
    closeModal();
  };

  const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: '.52rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 5, display: 'block' };
  const inputStyle = { width: '100%', padding: '8px 11px', borderRadius: 4, fontFamily: 'var(--font-body)', fontSize: '.82rem', outline: 'none', transition: 'all .15s', color: 'var(--color-ink)', background: 'var(--color-beige-mid)', border: '1.5px solid var(--color-border)', boxShadow: 'inset 0 2px 4px rgba(28,24,20,.1)' };

  return (
    <div
      className="modal-overlay"
      style={{ position: 'fixed', inset: 0, background: 'rgba(28,24,20,.62)', backdropFilter: 'blur(6px)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => e.target === e.currentTarget && closeModal()}
    >
      <div
        className="modal-content"
        style={{ background: 'var(--color-surface)', border: '2px solid var(--color-ink)', borderRadius: 8, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-modal)' }}
      >
        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: '1.5px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 3 }}>Expand the catalog</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-ink)' }}>Add a Film</div>
          </div>
          <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-muted)', padding: 4 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 22px' }}>
          {/* Emoji picker */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Poster Icon</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {MOVIE_EMOJIS.map(e => (
                <button
                  key={e} type="button"
                  style={{
                    width: 32, height: 32, borderRadius: 4, fontSize: '1rem', cursor: 'pointer', border: '1.5px solid',
                    borderColor: selectedEmoji === e ? 'var(--color-ink)' : 'var(--color-border)',
                    background: selectedEmoji === e ? 'var(--color-beige-deep)' : 'var(--color-beige)',
                    transition: 'all .12s',
                    boxShadow: selectedEmoji === e ? 'inset 0 1px 3px rgba(28,24,20,.15)' : 'none',
                  }}
                  onClick={() => setEmoji(e)}
                >{e}</button>
              ))}
            </div>
          </div>

          {/* Title + Year row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: 10, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input style={inputStyle} placeholder="e.g. The Seventh Seal" value={title} onChange={e => { setTitle(e.target.value); setError(''); }} autoFocus />
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <input style={inputStyle} type="number" min={1895} max={2030} value={year} onChange={e => setYear(e.target.value)} />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Synopsis</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 72, lineHeight: 1.55 }}
              placeholder="A brief description of the film…"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>

          {/* Genre picker */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Genres * (pick all that apply)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {ALL_GENRES.map(g => {
                const gc = GENRE_COLORS[g] || { bg: 'var(--color-accent)', text: '#fff' };
                const active = selectedGenres.includes(g);
                return (
                  <span
                    key={g}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: '.52rem', letterSpacing: '.06em', textTransform: 'uppercase',
                      padding: '4px 8px', borderRadius: 3, cursor: 'pointer', userSelect: 'none',
                      border: `1px solid ${active ? gc.bg : 'var(--color-border)'}`,
                      background: active ? gc.bg : 'var(--color-beige-mid)',
                      color: active ? gc.text : 'var(--color-muted)',
                      transition: 'all .13s',
                    }}
                    onClick={() => { toggleGenre(g); setError(''); }}
                  >{g}</span>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Tags <span style={{ opacity: .5 }}>(comma-separated)</span></label>
            <input style={inputStyle} placeholder="e.g. surreal, classic, arthouse" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
          </div>

          {error && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', color: 'var(--color-accent)', marginBottom: 12, padding: '8px 10px', background: 'rgba(181,48,14,.06)', borderRadius: 4, border: '1px solid rgba(181,48,14,.2)' }}>
              ⚠ {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn-primary"
              style={{ flex: 1, padding: '9px 0', fontFamily: 'var(--font-mono)', fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase', borderRadius: 4, cursor: 'pointer' }}
              onClick={handleSubmit}
            >Add to Catalog</button>
            <button
              className="btn-ghost"
              style={{ flex: 1, padding: '9px 0', fontFamily: 'var(--font-mono)', fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase', borderRadius: 4, cursor: 'pointer' }}
              onClick={closeModal}
            >Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
