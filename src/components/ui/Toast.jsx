import useAppStore from '../../store/useAppStore';

export default function Toast() {
  const toast = useAppStore(s => s.toast);

  if (!toast) return null;

  return (
    <div style={{
      position:'fixed', bottom:22, right:22,
      background:'var(--color-ink)', color:'var(--color-surface)',
      fontFamily:'var(--font-mono)', fontSize:'.6rem', letterSpacing:'.08em',
      padding:'11px 18px', borderRadius:4,
      boxShadow:'4px 4px 0 rgba(28,24,20,.25)',
      zIndex:9000, display:'flex', alignItems:'center', gap:9, maxWidth:340,
      animation: 'slideUp .28s cubic-bezier(.34,1.56,.64,1)',
    }}>
      <span style={{ fontSize:'.85rem', flexShrink:0 }}>{toast.icon}</span>
      <span>{toast.message}</span>
    </div>
  );
}
