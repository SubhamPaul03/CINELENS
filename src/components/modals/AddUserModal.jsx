import { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import { EMOJIS } from '../../data/presets';
import ProfileAvatar from '../ui/ProfileAvatar';
import { imageFileToDataUrl } from '../../utils/images';

const ms = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(28,24,20,.65)', backdropFilter: 'blur(6px)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  box: { background: 'var(--color-surface)', border: '2px solid var(--color-ink)', borderRadius: 8, width: '100%', maxWidth: 380, padding: 26, boxShadow: 'var(--shadow-modal)' },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 5 },
  title: { fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: 18, color: 'var(--color-ink)' },
  label: { fontFamily: 'var(--font-mono)', fontSize: '.52rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 5, display: 'block' },
};

export default function AddUserModal() {
  const closeModal = useAppStore(s => s.closeModal);
  const addUser    = useAppStore(s => s.addUser);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [avatarImg, setAvatarImg] = useState(null);

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [closeModal]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    addUser({ name: name.trim(), emoji, desc: desc.trim(), avatarImg });
  };

  const handleAvatarFile = async (file) => {
    if (!file?.type?.startsWith('image/')) return;
    setAvatarImg(await imageFileToDataUrl(file, { maxWidth: 360, maxHeight: 360, quality: 0.82 }));
  };

  return (
    <div className="modal-overlay" style={ms.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
      <div className="modal-content" style={ms.box}>
        <div style={ms.eyebrow}>New Profile</div>
        <h2 style={ms.title}>Add a Viewer</h2>

        <div style={{ marginBottom: 14 }}>
          <label style={ms.label}>Display Name</label>
          <input className="field-inset" style={{ width: '100%', padding: '8px 11px', borderRadius: 4, fontFamily: 'var(--font-body)', fontSize: '.82rem' }}
            placeholder="e.g. Jordan" maxLength={20} value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={ms.label}>Short Description</label>
          <input className="field-inset" style={{ width: '100%', padding: '8px 11px', borderRadius: 4, fontFamily: 'var(--font-body)', fontSize: '.82rem' }}
            placeholder="e.g. Horror & docs fan" maxLength={40} value={desc}
            onChange={e => setDesc(e.target.value)} />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={ms.label}>Choose Avatar</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <ProfileAvatar user={{ emoji, avatarImg }} size={46} />
            <div style={{ flex: 1, display: 'flex', gap: 7 }}>
              <label
                className="btn-ghost"
                style={{ flex: 1, textAlign: 'center', padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: '.52rem', letterSpacing: '.08em', textTransform: 'uppercase', borderRadius: 4, cursor: 'pointer' }}
              >
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    handleAvatarFile(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
              </label>
              {avatarImg && (
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: '.52rem', letterSpacing: '.08em', textTransform: 'uppercase', borderRadius: 4, cursor: 'pointer' }}
                  onClick={() => setAvatarImg(null)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {EMOJIS.map(e => (
              <button key={e} type="button"
                style={{
                  width: 32, height: 32, borderRadius: 5, fontSize: '.95rem', cursor: 'pointer',
                  border: `1.5px solid ${emoji === e ? 'var(--color-ink)' : 'var(--color-border)'}`,
                  background: emoji === e ? 'var(--color-beige-deep)' : 'var(--color-beige)',
                  boxShadow: emoji === e ? 'inset 0 1px 3px rgba(28,24,20,.15)' : 'none',
                  transition: 'all .12s',
                }}
                onClick={() => setEmoji(e)}>{e}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-primary" style={{ flex: 1, padding: '9px 0', fontFamily: 'var(--font-mono)', fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase', borderRadius: 4, cursor: 'pointer' }} onClick={handleSubmit}>Create</button>
          <button className="btn-ghost" style={{ flex: 1, padding: '9px 0', fontFamily: 'var(--font-mono)', fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase', borderRadius: 4, cursor: 'pointer' }} onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
