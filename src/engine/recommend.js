/**
 * CINE·LENS Recommendation Engine
 *
 * Pure functions implementing three recommendation algorithms:
 * 1. Collaborative Filtering (Pearson correlation)
 * 2. Content-Based Filtering (tag/genre profile matching)
 * 3. Hybrid Blend (55% collab + 45% content, normalised)
 */

/**
 * Compute Pearson correlation coefficient between two users' ratings.
 * @param {Object} ratingsA - { movieId: rating } for user A
 * @param {Object} ratingsB - { movieId: rating } for user B
 * @returns {number} Correlation in range [-1, 1]
 */
export function pearsonCorrelation(ratingsA, ratingsB) {
  const shared = Object.keys(ratingsA)
    .filter(k => ratingsB[k] !== undefined)
    .map(Number);

  if (shared.length < 2) return 0;

  const meanA = shared.reduce((s, k) => s + ratingsA[k], 0) / shared.length;
  const meanB = shared.reduce((s, k) => s + ratingsB[k], 0) / shared.length;

  let numerator = 0;
  let denomA = 0;
  let denomB = 0;

  shared.forEach(k => {
    const diffA = ratingsA[k] - meanA;
    const diffB = ratingsB[k] - meanB;
    numerator += diffA * diffB;
    denomA += diffA * diffA;
    denomB += diffB * diffB;
  });

  if (!denomA || !denomB) return 0;
  return numerator / (Math.sqrt(denomA) * Math.sqrt(denomB));
}

/**
 * Collaborative filtering: predict scores based on similar users.
 * @param {Object} currentUser - Current user object with .ratings
 * @param {Array} allUsers - All users array
 * @param {Array} movies - All movies array
 * @returns {{ scores: Object, similarities: Array }}
 */
export function collaborativeScores(currentUser, allUsers, movies) {
  const others = allUsers.filter(u => u.id !== currentUser.id);
  const similarities = others
    .map(other => ({
      user: other,
      sim: pearsonCorrelation(currentUser.ratings, other.ratings),
    }))
    .filter(x => x.sim > 0);

  const scores = {};

  movies.forEach(movie => {
    if (currentUser.ratings[movie.id]) return;

    let numerator = 0;
    let denominator = 0;

    similarities.forEach(({ user: other, sim }) => {
      if (other.ratings[movie.id]) {
        numerator += sim * other.ratings[movie.id];
        denominator += Math.abs(sim);
      }
    });

    if (denominator > 0) {
      scores[movie.id] = numerator / denominator;
    }
  });

  return { scores, similarities };
}

/**
 * Content-based filtering: match films to user's tag/genre preference profile.
 * @param {Object} currentUser - Current user object with .ratings
 * @param {Array} movies - All movies array
 * @returns {{ scores: Object }}
 */
export function contentBasedScores(currentUser, movies) {
  const tagWeights = {};
  const genreWeights = {};

  Object.entries(currentUser.ratings).forEach(([id, rating]) => {
    const movie = movies.find(m => m.id === +id);
    if (!movie) return;

    movie.tags.forEach(tag => {
      tagWeights[tag] = (tagWeights[tag] || 0) + rating;
    });
    movie.genre.forEach(genre => {
      genreWeights[genre] = (genreWeights[genre] || 0) + rating;
    });
  });

  const scores = {};

  movies.forEach(movie => {
    if (currentUser.ratings[movie.id]) return;

    let score = 0;
    movie.tags.forEach(tag => {
      if (tagWeights[tag]) score += tagWeights[tag];
    });
    movie.genre.forEach(genre => {
      if (genreWeights[genre]) score += genreWeights[genre] * 1.5;
    });

    scores[movie.id] = score;
  });

  return { scores };
}

/**
 * Normalise scores to [0, 1] range.
 */
function normalise(scoresObj) {
  const values = Object.values(scoresObj);
  const max = Math.max(...values) || 1;
  const result = {};
  Object.entries(scoresObj).forEach(([key, val]) => {
    result[key] = val / max;
  });
  return result;
}

function normaliseText(value) {
  return String(value || '').toLowerCase().trim();
}

function movieMatchesSearch(movie, query) {
  const q = normaliseText(query);
  if (!q) return true;

  const haystack = [
    movie.title,
    movie.year,
    movie.desc,
    ...(movie.genre || []),
    ...(movie.tags || []),
  ].map(normaliseText);

  return q
    .split(/\s+/)
    .filter(Boolean)
    .every(token => haystack.some(value => value.includes(token)));
}

/**
 * Hybrid blend: 55% collaborative + 45% content-based, normalised.
 * @param {Object} currentUser
 * @param {Array} allUsers
 * @param {Array} movies
 * @returns {{ scores: Object, similarities: Array }}
 */
export function hybridScores(currentUser, allUsers, movies) {
  const { scores: collabRaw, similarities } = collaborativeScores(currentUser, allUsers, movies);
  const { scores: contentRaw } = contentBasedScores(currentUser, movies);

  const normCollab = normalise(collabRaw);
  const normContent = normalise(contentRaw);

  const scores = {};
  movies.forEach(movie => {
    if (currentUser.ratings[movie.id]) return;
    scores[movie.id] = (normCollab[movie.id] || 0) * 0.55 + (normContent[movie.id] || 0) * 0.45;
  });

  return { scores, similarities };
}

/**
 * Get sorted, filtered recommendations.
 * @param {Object} params
 * @param {Object} params.currentUser
 * @param {Array} params.allUsers
 * @param {Array} params.movies
 * @param {string} params.algorithm - 'collab' | 'content' | 'hybrid'
 * @param {Set} params.selectedGenres - Genre filter set
 * @param {string} params.searchQuery - Search text
 * @param {string} params.sortMode - 'score' | 'year_desc' | 'year_asc' | 'alpha'
 * @returns {{ recommendations: Array, similarities: Array }}
 */
export function getRecommendations({
  currentUser,
  allUsers,
  movies,
  algorithm,
  selectedGenres = new Set(),
  searchQuery = '',
  sortMode = 'score',
}) {
  let result;

  switch (algorithm) {
    case 'collab':
      result = collaborativeScores(currentUser, allUsers, movies);
      break;
    case 'content':
      result = contentBasedScores(currentUser, movies);
      break;
    case 'hybrid':
    default:
      result = hybridScores(currentUser, allUsers, movies);
      break;
  }

  const { scores, similarities = [] } = result;

  const hasGenreFilter = selectedGenres.size > 0;
  const hasSearch = Boolean(searchQuery.trim());
  const shouldShowRated = hasGenreFilter || hasSearch;

  // Build list with scores. In the normal recommendation view, rated films are
  // hidden; while searching/filtering, the page behaves like a full catalog.
  let recs = movies
    .filter(m => shouldShowRated || !currentUser.ratings[m.id])
    .map(m => ({ ...m, score: scores[m.id] || 0 }));

  // Apply genre filter
  if (selectedGenres.size > 0) {
    recs = recs.filter(m => m.genre.some(g => selectedGenres.has(g)));
  }

  // Apply search filter
  if (hasSearch) {
    recs = recs.filter(m => movieMatchesSearch(m, searchQuery));
  }

  // Sort
  switch (sortMode) {
    case 'year':
    case 'year_desc':
      recs.sort((a, b) => b.year - a.year);
      break;
    case 'year_asc':
      recs.sort((a, b) => a.year - b.year);
      break;
    case 'title':
    case 'alpha':
      recs.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'score':
    default:
      recs.sort((a, b) => b.score - a.score);
      break;
  }

  return { recommendations: recs, similarities };
}
