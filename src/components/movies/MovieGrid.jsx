import MovieCard from './MovieCard';
import EmptyState from '../ui/EmptyState';
import useAppStore from '../../store/useAppStore';

export default function MovieGrid({ recommendations }) {
  const viewMode = useAppStore(s => s.viewMode);
  const maxScore = Math.max(...recommendations.map(movie => movie.score || 0), 1);
  const isListView = viewMode === 'list';

  if (recommendations.length === 0) return <EmptyState />;

  return (
    <div
      style={isListView
        ? { display: 'flex', flexDirection: 'column', gap: 8 }
        : { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(178px, 1fr))', gap: 16 }
      }
    >
      {recommendations.map((movie, i) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          maxScore={maxScore}
          index={i}
          isListView={isListView}
        />
      ))}
    </div>
  );
}
