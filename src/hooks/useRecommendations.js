import { useMemo } from 'react';
import useAppStore from '../store/useAppStore';
import { getRecommendations } from '../engine/recommend';

/**
 * Hook that derives recommendations from current store state.
 * Memoised to avoid recalculation on unrelated state changes.
 */
export function useRecommendations() {
  const currentUser = useAppStore(s => s.getCurrentUser());
  const users = useAppStore(s => s.users);
  const movies = useAppStore(s => s.movies);
  const algorithm = useAppStore(s => s.algorithm);
  const selectedGenres = useAppStore(s => s.selectedGenres);
  const searchQuery = useAppStore(s => s.searchQuery);
  const sortMode = useAppStore(s => s.sortMode);

  return useMemo(() => {
    if (!currentUser) return { recommendations: [], similarities: [] };

    return getRecommendations({
      currentUser,
      allUsers: users,
      movies,
      algorithm,
      selectedGenres,
      searchQuery,
      sortMode,
    });
  }, [currentUser, users, movies, algorithm, selectedGenres, searchQuery, sortMode]);
}
