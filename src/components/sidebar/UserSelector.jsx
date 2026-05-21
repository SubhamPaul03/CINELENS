import { Pencil } from 'lucide-react';
import { useRef, useState } from 'react';
import useAppStore from '../../store/useAppStore';
import ProfileAvatar from '../ui/ProfileAvatar';
import { imageFileToDataUrl } from '../../utils/images';

const S = {
  // Shared inline styles using CSS variables so dark mode always works
  section: {
    borderBottom: '1.5px solid var(--color-border)',
  },
  row: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px', cursor: 'pointer',
    borderBottom: '1px solid var(--color-beige-mid)',
    background: active ? 'var(--color-ink)' : 'transparent',
    transition: 'background .14s',
    position: 'relative',
  }),
  name: (active) => ({
    fontWeight: 700, fontSize: '.84rem', lineHeight: 1.2,
    color: active ? 'var(--color-surface)' : 'var(--color-ink)',
  }),
  sub: (active) => ({
    fontSize: '.63rem', marginTop: 1,
    color: active ? 'var(--color-active-subtle)' : 'var(--color-muted)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  }),
};

export default function UserSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // userId to confirm
  const fileInputRef = useRef(null);
  const users = useAppStore(s => s.users);
  const currentUserId = useAppStore(s => s.currentUserId);
  const selectUser = useAppStore(s => s.selectUser);
  const deleteUser = useAppStore(s => s.deleteUser);
  const setAvatar = useAppStore(s => s.setAvatar);
  const openModal = useAppStore(s => s.openModal);
  const currentUser = users.find(u => u.id === currentUserId);

  const handleAvatarFile = async (file) => {
    if (!file?.type?.startsWith('image/')) return;
    setAvatar(await imageFileToDataUrl(file, { maxWidth: 360, maxHeight: 360, quality: 0.82 }));
  };

  const handleDelete = (e, userId) => {
    e.stopPropagation();
    if (confirmDelete === userId) {
      deleteUser(userId);
      setConfirmDelete(null);
      if (userId === currentUserId) setIsOpen(false);
    } else {
      setConfirmDelete(userId);
      // Auto-cancel confirm after 3s
      setTimeout(() => setConfirmDelete(c => c === userId ? null : c), 3000);
    }
  };

  return (
    <div style={S.section}>
      {/* ── Current user row (toggle dropdown) ── */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '13px 16px', cursor: 'pointer', userSelect: 'none',
          transition: 'background .15s',
        }}
        className="hover:bg-[var(--color-beige)]"
        onClick={() => { setIsOpen(!isOpen); setConfirmDelete(null); }}
      >
        <ProfileAvatar user={currentUser} size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '.84rem', lineHeight: 1.2, color: 'var(--color-ink)' }}>{currentUser?.name}</div>
          <div style={{ fontSize: '.63rem', color: 'var(--color-muted)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser?.desc}</div>
        </div>
        <button
          type="button"
          className="btn-ghost"
          style={{ width: 26, height: 26, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          onClick={e => {
            e.stopPropagation();
            openModal('editUser', { userId: currentUserId });
          }}
          title="Edit profile"
          aria-label="Edit profile"
        >
          <Pencil size={13} strokeWidth={2.1} />
        </button>
        <span style={{ color: 'var(--color-muted)', fontSize: '.65rem', flexShrink: 0, transition: 'transform .22s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
      </div>

      {/* ── Dropdown ── */}
      <div style={{
        overflow: 'hidden',
        maxHeight: isOpen ? 600 : 0,
        transition: 'max-height .32s cubic-bezier(.4,0,.2,1)',
        borderTop: isOpen ? '1px solid var(--color-border)' : 'none',
        background: 'var(--color-surface)',
      }}>
        {users.map(user => {
          const isActive = user.id === currentUserId;
          const isPendingDelete = confirmDelete === user.id;
          return (
            <div
              key={user.id}
              style={{
                ...S.row(isActive && !isPendingDelete),
                ...(isPendingDelete ? { background: 'rgba(181,48,14,.08)' } : {}),
              }}
              onClick={() => { if (!isPendingDelete) { selectUser(user.id); setIsOpen(false); } }}
            >
              <ProfileAvatar user={user} size={28} active={isActive && !isPendingDelete} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.name(isActive && !isPendingDelete)}>{user.name}</div>
                <div style={S.sub(isActive && !isPendingDelete)}>{user.desc}</div>
              </div>
              {/* Delete button */}
              <button
                style={{
                  flexShrink: 0, padding: '3px 7px',
                  fontFamily: 'var(--font-mono)', fontSize: '.46rem',
                  letterSpacing: '.06em', textTransform: 'uppercase',
                  borderRadius: 3, cursor: 'pointer', border: '1px solid',
                  transition: 'all .13s',
                  background: isPendingDelete ? 'var(--color-accent)' : 'transparent',
                  borderColor: isPendingDelete ? 'var(--color-accent)' : 'rgba(181,48,14,.3)',
                  color: isPendingDelete ? '#fff' : 'var(--color-accent)',
                }}
                onClick={(e) => handleDelete(e, user.id)}
                title={isPendingDelete ? 'Click again to confirm delete' : 'Delete profile'}
              >
                {isPendingDelete ? '✓ Sure?' : '✕'}
              </button>
            </div>
          );
        })}

        {/* Profile picture */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px dashed var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => {
              handleAvatarFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <ProfileAvatar user={currentUser} size={32} />
          <button
            className="btn-primary"
            style={{ flex: 1, padding: '7px 9px', fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.08em', textTransform: 'uppercase', borderRadius: 4, cursor: 'pointer' }}
            onClick={() => {
              setIsOpen(false);
              openModal('editUser', { userId: currentUserId });
            }}
          >
            Edit Profile
          </button>
          <button
            className="btn-ghost"
            style={{ flex: 1, padding: '7px 9px', fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.08em', textTransform: 'uppercase', borderRadius: 4, cursor: 'pointer' }}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload
          </button>
          {currentUser?.avatarImg && (
            <button
              className="btn-ghost"
              style={{ padding: '7px 9px', fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.08em', textTransform: 'uppercase', borderRadius: 4, cursor: 'pointer' }}
              onClick={() => setAvatar(null)}
              title="Remove profile picture"
            >
              Remove
            </button>
          )}
        </div>

        {/* Add profile */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', cursor: 'pointer',
            fontSize: '.75rem', fontWeight: 600, color: 'var(--color-accent2)',
            borderTop: '1px dashed var(--color-border)',
            transition: 'background .14s',
          }}
          className="hover:bg-[var(--color-beige)]"
          onClick={() => { setIsOpen(false); openModal('addUser'); }}
        >
          <span style={{ fontSize: '1rem' }}>＋</span> Add Viewer Profile
        </div>
      </div>
    </div>
  );
}
