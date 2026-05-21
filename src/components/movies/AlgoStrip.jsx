import useAppStore from '../../store/useAppStore';
import { ALGO_DATA } from '../../data/presets';

export default function AlgoStrip() {
  const algorithm   = useAppStore(s => s.algorithm);
  const currentUser = useAppStore(s => s.getCurrentUser());
  const algoData    = ALGO_DATA.find(a => a.id === algorithm);
  const ratedCount  = currentUser ? Object.keys(currentUser.ratings).length : 0;

  if (!algoData) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 14px', borderRadius: 5, marginBottom: 18,
      border: '1.5px solid var(--color-border)',
      background: 'var(--color-surface)',
      fontSize: '.72rem', lineHeight: 1.5,
      boxShadow: 'inset 0 1px 3px rgba(28,24,20,.06)',
      color: 'var(--color-muted)',
    }}>
      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{algoData.icon}</span>
      <span dangerouslySetInnerHTML={{ __html: algoData.explain }} style={{ flex: 1 }} />
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '.48rem', letterSpacing: '.06em',
        background: 'var(--color-beige-mid)', color: 'var(--color-muted)',
        padding: '3px 7px', borderRadius: 3, whiteSpace: 'nowrap', flexShrink: 0,
        border: '1px solid var(--color-border)',
        boxShadow: 'inset 0 1px 2px rgba(28,24,20,.07)',
      }}>
        {ratedCount} rated
      </span>
    </div>
  );
}
