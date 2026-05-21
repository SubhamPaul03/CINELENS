import { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import ProfileAvatar from '../ui/ProfileAvatar';

const accHead = { display: 'flex', alignItems: 'center', padding: '11px 16px', cursor: 'pointer', userSelect: 'none', gap: 8, transition: 'background .14s' };
const accLabel = { fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--color-muted)', flex: 1 };

export default function SimilarityPanel({ similarities = [] }) {
  const [isOpen, setIsOpen] = useState(true);
  const users = useAppStore(s => s.users);
  const currentUserId = useAppStore(s => s.currentUserId);

  // similarities is passed from parent or we use mock
  const otherUsers = users.filter(u => u.id !== currentUserId);
  const fallbackSimilarity = (userId) => {
    const seed = [...userId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return 0.3 + (seed % 60) / 100;
  };

  return (
    <div style={{ borderBottom: '1.5px solid var(--color-border)' }}>
      <div
        style={{ ...accHead, background: 'transparent' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-beige)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={accLabel}>User Similarity</span>
        <span style={{ color: 'var(--color-muted)', fontSize: '.58rem', flexShrink: 0, transition: 'transform .22s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
      </div>

      <div className={isOpen ? 'acc-body-open' : 'acc-body-shut'}>
        <div style={{ padding: '4px 16px 14px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {otherUsers.length === 0 && (
            <div style={{ fontSize: '.7rem', color: 'var(--color-muted)', padding: '8px 0' }}>No other profiles yet.</div>
          )}
          {otherUsers.map((u, i) => {
            const sim = similarities[i] ?? fallbackSimilarity(u.id);
            const pct = Math.round(sim * 100);
            return (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ProfileAvatar user={u} size={22} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                    <span style={{ fontSize: '.68rem', fontWeight: 600, color: 'var(--color-ink)' }}>{u.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.48rem', color: 'var(--color-muted)' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--color-beige-deep)', borderRadius: 2, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(28,24,20,.1)' }}>
                    <div className="sim-fill" style={{ height: '100%', background: `linear-gradient(90deg, var(--color-accent2), #5b9bd5)`, borderRadius: 2, width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
