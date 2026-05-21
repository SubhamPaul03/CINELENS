import UserSelector from '../sidebar/UserSelector';
import AlgorithmPanel from '../sidebar/AlgorithmPanel';
import GenreFilter from '../sidebar/GenreFilter';
import SimilarityPanel from '../sidebar/SimilarityPanel';

export default function Sidebar() {
  return (
    <aside
      className="sidebar-leather"
      style={{
        width: 'var(--sidebar-w)', flexShrink: 0,
        background: 'var(--color-surface)',
        borderRight: '1.5px solid var(--color-border)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto', overflowX: 'hidden',
      }}
      role="complementary"
      aria-label="Sidebar"
    >
      <UserSelector />
      <AlgorithmPanel />
      <GenreFilter />
      <SimilarityPanel />
    </aside>
  );
}
