import { useRecommendations } from '../hooks/useRecommendations';
import HeroBanner from '../components/movies/HeroBanner';
import AlgoStrip from '../components/movies/AlgoStrip';
import Toolbar from '../components/movies/Toolbar';
import MovieGrid from '../components/movies/MovieGrid';

export default function HomePage() {
  const { recommendations } = useRecommendations();

  return (
    <div style={{ padding:'24px 28px' }}>
      <HeroBanner recommendations={recommendations} />
      <AlgoStrip />
      <Toolbar count={recommendations.length} />
      <MovieGrid recommendations={recommendations} />
    </div>
  );
}
