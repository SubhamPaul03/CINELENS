import { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { ALGO_DATA } from '../../data/presets';

const accHead = { display: 'flex', alignItems: 'center', padding: '11px 16px', cursor: 'pointer', userSelect: 'none', gap: 8, transition: 'background .14s' };
const accLabel = { fontFamily: 'var(--font-mono)', fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--color-muted)', flex: 1 };

export default function AlgorithmPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const algorithm = useAppStore(s => s.algorithm);
  const setAlgorithm = useAppStore(s => s.setAlgorithm);

  return (
    <div style={{ borderBottom: '1.5px solid var(--color-border)' }}>
      <div
        style={{ ...accHead, background: 'transparent' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-beige)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={accLabel}>Algorithm</span>
        <span style={{ color: 'var(--color-muted)', fontSize: '.58rem', flexShrink: 0, transition: 'transform .22s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
      </div>

      <div className={isOpen ? 'acc-body-open' : 'acc-body-shut'}>
        <div style={{ padding: '4px 16px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {ALGO_DATA.map(algo => {
            const active = algorithm === algo.id;
            return (
              <div
                key={algo.id}
                className={`algo-opt${active ? ' active' : ''}`}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '9px 10px', borderRadius: 5, cursor: 'pointer' }}
                onClick={() => setAlgorithm(algo.id)}
              >
                {/* Radio dot */}
                <div style={{
                  width: 13, height: 13, borderRadius: '50%', flexShrink: 0, marginTop: 3, position: 'relative',
                  border: `2px solid ${active ? 'var(--color-accent2)' : 'var(--color-border)'}`,
                  background: 'transparent',
                }}>
                  {active && <div style={{ position: 'absolute', inset: 2, borderRadius: '50%', background: 'var(--color-accent2)' }} />}
                </div>
                <div>
                  <div style={{ fontSize: '.77rem', fontWeight: 600, lineHeight: 1.3, color: 'var(--color-ink)' }}>{algo.name}</div>
                  <div style={{ fontSize: '.6rem', color: 'var(--color-muted)', marginTop: 2, lineHeight: 1.4 }}>{algo.hint}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
