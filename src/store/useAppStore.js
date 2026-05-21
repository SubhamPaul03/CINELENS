import { create } from 'zustand';
import { MOVIES } from '../data/movies';
import { DEFAULT_USERS } from '../data/defaultUsers';
import { deleteImage, loadImage, loadState, saveImage, saveState } from '../services/storage';

/**
 * Genre color map — each genre gets a unique color for badges/tags
 */
export const GENRE_COLORS = {
  Action:    { bg: '#d4380d', text: '#fff' },
  Animation: { bg: '#08979c', text: '#fff' },
  Comedy:    { bg: '#d48806', text: '#fff' },
  Drama:     { bg: '#531dab', text: '#fff' },
  Fantasy:   { bg: '#1d39c4', text: '#fff' },
  Horror:    { bg: '#000', text: '#fff' },
  Mystery:   { bg: '#5b2c6f', text: '#fff' },
  Romance:   { bg: '#c41d7f', text: '#fff' },
  'Sci-Fi':  { bg: '#0050b3', text: '#fff' },
  Thriller:  { bg: '#7c3aed', text: '#fff' },
  War:       { bg: '#3f6600', text: '#fff' },
  Western:   { bg: '#ad6800', text: '#fff' },
};

const isInlineImage = value => typeof value === 'string' && value.startsWith('data:image/');
const avatarKey = userId => `avatar:${userId}`;
const bannerKey = userId => `banner:${userId}`;
const posterKey = movieId => `poster:${movieId}`;

/**
 * Hydrate state from localStorage on init.
 */
function getInitialState() {
  const saved = loadState();

  let users = DEFAULT_USERS.map(u => ({
    ...u,
    avatarKey: avatarKey(u.id),
    bannerKey: bannerKey(u.id),
    ratings: { ...u.ratings },
  }));
  let movies = MOVIES.map(m => ({ ...m, posterKey: posterKey(m.id) }));
  let currentUserId = 'alice';
  let watchlist = new Set();
  let comments = [];

  if (saved) {
    if (saved.movies?.length) {
      const defaultIds = new Set(MOVIES.map(m => m.id));
      const savedById = new Map(saved.movies.map(m => [m.id, { ...m, posterKey: m.posterKey || posterKey(m.id) }]));
      const mergedDefaults = MOVIES.map(m => ({ ...m, posterKey: posterKey(m.id), ...(savedById.get(m.id) || {}) }));
      const customMovies = saved.movies
        .filter(m => !defaultIds.has(m.id))
        .map(m => ({ ...m, posterKey: m.posterKey || posterKey(m.id) }));
      movies = [...mergedDefaults, ...customMovies];
    }

    // Restore users
    if (saved.users?.length) {
      users = saved.users.map(su => ({
        id: su.id, name: su.name, emoji: su.emoji,
        desc: su.desc, avatarImg: su.avatarImg || null,
        avatarKey: su.avatarKey || avatarKey(su.id),
        bannerImg: su.bannerImg || null,
        bannerKey: su.bannerKey || bannerKey(su.id),
        ratings: su.ratings || {},
      }));
    }

    // Restore posters
    if (saved.posters) {
      Object.entries(saved.posters).forEach(([id, img]) => {
        const movie = movies.find(m => m.id === +id);
        if (movie) movie.posterImg = img;
      });
    }

    // Restore current user
    if (saved.currentUserId && users.find(u => u.id === saved.currentUserId)) {
      currentUserId = saved.currentUserId;
    }

    // Restore watchlist
    if (saved.watchlists?.[currentUserId]) {
      watchlist = new Set(saved.watchlists[currentUserId]);
    }

    if (Array.isArray(saved.comments)) {
      comments = saved.comments;
    }
  }

  return { users, movies, currentUserId, watchlist, comments };
}

const initial = getInitialState();

const useAppStore = create((set, get) => ({
  // ── User State ──
  users: initial.users,
  currentUserId: initial.currentUserId,

  // ── Movie State ──
  movies: initial.movies,

  // ── Watchlist State ──
  watchlist: initial.watchlist, // Set of movie IDs

  comments: initial.comments,

  // ── UI State ──
  algorithm: 'collab',
  selectedGenres: new Set(),
  searchQuery: '',
  viewMode: 'grid',
  sortMode: 'score',

  // ── Modal State ──
  activeModal: null,

  // ── Toast State ──
  toast: null,

  // ── Derived Helpers ──
  getCurrentUser: () => {
    const { users, currentUserId } = get();
    return users.find(u => u.id === currentUserId);
  },

  getMovie: (id) => get().movies.find(m => m.id === id),

  hydrateImages: async () => {
    const saved = loadState() || {};

    const users = await Promise.all(get().users.map(async user => {
      let next = { ...user };

      if (isInlineImage(next.avatarImg)) {
        await saveImage(next.avatarKey || avatarKey(next.id), next.avatarImg);
      } else if (next.avatarKey) {
        const img = await loadImage(next.avatarKey);
        if (img) next.avatarImg = img;
      }

      if (isInlineImage(next.bannerImg)) {
        await saveImage(next.bannerKey || bannerKey(next.id), next.bannerImg);
      } else if (next.bannerKey) {
        const img = await loadImage(next.bannerKey);
        if (img) next.bannerImg = img;
      }

      return next;
    }));

    const legacyPosters = saved.posters || {};
    const movies = await Promise.all(get().movies.map(async movie => {
      let next = { ...movie };
      const key = next.posterKey || posterKey(next.id);

      if (!next.posterKey) next.posterKey = key;

      if (isInlineImage(next.posterImg)) {
        await saveImage(key, next.posterImg);
      } else if (legacyPosters[next.id]) {
        next.posterImg = legacyPosters[next.id];
        await saveImage(key, legacyPosters[next.id]);
      } else {
        const img = await loadImage(key);
        if (img) next.posterImg = img;
      }

      return next;
    }));

    set({ users, movies });
    get()._persist();
  },

  // ── User Actions ──
  selectUser: (userId) => {
    // Restore this user's watchlist
    const saved = loadState();
    const wl = saved?.watchlists?.[userId] ? new Set(saved.watchlists[userId]) : new Set();
    set({ currentUserId: userId, selectedGenres: new Set(), watchlist: wl });
    get()._persist();
    get().showToast(`Switched to ${get().getCurrentUser().name}`, '👤');
  },

  addUser: async ({ name, emoji, desc, avatarImg = null }) => {
    const id = 'u' + Date.now();
    const key = avatarKey(id);
    if (isInlineImage(avatarImg)) await saveImage(key, avatarImg);
    const newUser = {
      id, name, emoji,
      desc: desc || 'Film enthusiast',
      avatarImg, avatarKey: key, bannerImg: null, bannerKey: bannerKey(id), ratings: {},
    };
    set(state => ({
      users: [...state.users, newUser],
      currentUserId: id,
      selectedGenres: new Set(),
      watchlist: new Set(),
      activeModal: null,
    }));
    get()._persist();
    get().showToast(`Profile "${name}" created`, '✓');
  },

  updateUser: async (userId, updates) => {
    const key = avatarKey(userId);
    if (Object.hasOwn(updates, 'avatarImg')) {
      if (isInlineImage(updates.avatarImg)) await saveImage(key, updates.avatarImg);
      if (!updates.avatarImg) await deleteImage(key);
    }

    set(state => ({
      users: state.users.map(u =>
        u.id === userId
          ? {
              ...u,
              name: updates.name ?? u.name,
              desc: updates.desc ?? u.desc,
              emoji: updates.emoji ?? u.emoji,
              avatarImg: Object.hasOwn(updates, 'avatarImg') ? updates.avatarImg : u.avatarImg,
              avatarKey: u.avatarKey || key,
            }
          : u
      ),
      activeModal: null,
    }));
    get()._persist();
    get().showToast('Profile updated', '✓');
  },

  deleteUser: async (userId) => {
    const { users, currentUserId } = get();
    if (users.length <= 1) { get().showToast('Cannot delete the last profile', '⚠'); return; }
    const target = users.find(u => u.id === userId);
    const remaining = users.filter(u => u.id !== userId);
    const newCurrentId = currentUserId === userId ? remaining[0].id : currentUserId;
    // Restore watchlist for new current user
    const saved = loadState() || {};
    const wl = saved?.watchlists?.[newCurrentId] ? new Set(saved.watchlists[newCurrentId]) : new Set();
    await deleteImage(avatarKey(userId));
    await deleteImage(bannerKey(userId));
    set({ users: remaining, currentUserId: newCurrentId, watchlist: wl });
    get()._persist();
    get().showToast(`Deleted profile "${target?.name}"`, '🗑');
  },

  setAvatar: async (imageData) => {
    const { currentUserId } = get();
    const key = avatarKey(currentUserId);
    if (isInlineImage(imageData)) await saveImage(key, imageData);
    if (!imageData) await deleteImage(key);
    set(state => ({
      users: state.users.map(u =>
        u.id === state.currentUserId ? { ...u, avatarImg: imageData, avatarKey: key } : u
      ),
    }));
    get()._persist();
    get().showToast(`Profile picture ${imageData ? 'saved' : 'removed'}`, imageData ? '✓' : '×');
  },

  // ── Movie Actions ──
  addMovie: ({ title, year, genre, desc, emoji, tags }) => {
    const { movies } = get();
    const newId = Math.max(...movies.map(m => m.id)) + 1;
    const newMovie = { id: newId, title, year: +year, genre, desc, emoji: emoji || '🎬', tags: tags || [], posterImg: null, posterKey: posterKey(newId) };
    set(state => ({ movies: [...state.movies, newMovie] }));
    get()._persist();
    get().showToast(`"${title}" added to catalog`, '🎬');
  },

  // ── Algorithm Actions ──
  setAlgorithm: (algo) => set({ algorithm: algo }),

  // ── Filter Actions ──
  toggleGenre: (genre) => {
    set(state => {
      const next = new Set(state.selectedGenres);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return { selectedGenres: next };
    });
  },
  clearGenres: () => set({ selectedGenres: new Set() }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortMode: (mode) => set({ sortMode: mode }),
  setViewMode: (mode) => set({ viewMode: mode }),

  // ── Watchlist Actions ──
  toggleWatchlist: (movieId) => {
    set(state => {
      const next = new Set(state.watchlist);
      const movie = state.movies.find(m => m.id === movieId);
      if (next.has(movieId)) {
        next.delete(movieId);
        setTimeout(() => get().showToast(`Removed "${movie?.title}" from watchlist`, '💔'), 0);
      } else {
        next.add(movieId);
        setTimeout(() => get().showToast(`Added "${movie?.title}" to watchlist`, '❤️'), 0);
      }
      return { watchlist: next };
    });
    get()._persist();
  },

  isInWatchlist: (movieId) => get().watchlist.has(movieId),

  // ── Rating Actions ──
  rateMovie: (movieId, rating) => {
    set(state => {
      const users = state.users.map(u =>
        u.id === state.currentUserId
          ? { ...u, ratings: { ...u.ratings, [movieId]: rating } }
          : u
      );
      return { users, activeModal: null };
    });
    get()._persist();
    const movie = get().getMovie(movieId);
    get().showToast(`Rated "${movie.title}" ${'★'.repeat(rating)}`, '🎬');
  },

  deleteRating: (movieId) => {
    set(state => {
      const users = state.users.map(u => {
        if (u.id !== state.currentUserId) return u;
        const rest = { ...u.ratings };
        delete rest[movieId];
        return { ...u, ratings: rest };
      });
      return { users };
    });
    get()._persist();
    get().showToast('Rating removed', '🗑');
  },

  addComment: (movieId, text) => {
    const { currentUserId } = get();
    const trimmed = text.trim();
    if (!trimmed) return;

    const comment = {
      id: `c${Date.now()}`,
      movieId,
      userId: currentUserId,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    set(state => ({ comments: [comment, ...state.comments] }));
    get()._persist();
    get().showToast('Comment posted', '✓');
  },

  deleteComment: (commentId) => {
    const { currentUserId } = get();
    set(state => ({
      comments: state.comments.filter(c => !(c.id === commentId && c.userId === currentUserId)),
    }));
    get()._persist();
    get().showToast('Comment removed', '×');
  },

  // ── Poster Actions ──
  setPoster: async (movieId, imageData) => {
    const key = posterKey(movieId);
    if (isInlineImage(imageData)) await saveImage(key, imageData);
    if (!imageData) await deleteImage(key);
    set(state => ({
      movies: state.movies.map(m =>
        m.id === movieId ? { ...m, posterImg: imageData, posterKey: key } : m
      ),
    }));
    get()._persist();
    const movie = get().getMovie(movieId);
    get().showToast(`Poster ${imageData ? 'saved' : 'removed'} for "${movie.title}"`, '🖼');
  },

  // ── Banner Actions ──
  setBanner: async (imageData) => {
    const { currentUserId } = get();
    const key = bannerKey(currentUserId);
    if (isInlineImage(imageData)) await saveImage(key, imageData);
    if (!imageData) await deleteImage(key);
    set(state => ({
      users: state.users.map(u =>
        u.id === state.currentUserId ? { ...u, bannerImg: imageData, bannerKey: key } : u
      ),
    }));
    get()._persist();
  },

  // ── Modal Actions ──
  openModal: (type, data = null) => set({ activeModal: { type, data } }),
  closeModal: () => set({ activeModal: null }),

  // ── Toast Actions ──
  showToast: (message, icon = '✓') => {
    set({ toast: { message, icon } });
    setTimeout(() => {
      set(state => {
        if (state.toast?.message === message) return { toast: null };
        return {};
      });
    }, 3000);
  },

  // ── Persistence (internal) ──
  _persist: () => {
    const { users, movies, currentUserId, watchlist, comments } = get();
    const usersData = users.map(u => ({
      id: u.id, name: u.name, emoji: u.emoji,
      desc: u.desc,
      avatarImg: isInlineImage(u.avatarImg) ? null : u.avatarImg,
      avatarKey: u.avatarKey || avatarKey(u.id),
      bannerImg: isInlineImage(u.bannerImg) ? null : u.bannerImg,
      bannerKey: u.bannerKey || bannerKey(u.id),
      ratings: { ...u.ratings },
    }));
    const moviesData = movies.map(m => ({
      ...m,
      posterImg: isInlineImage(m.posterImg) ? null : m.posterImg,
      posterKey: m.posterKey || posterKey(m.id),
    }));

    // Save per-user watchlist
    const saved = loadState() || {};
    const watchlists = saved.watchlists || {};
    watchlists[currentUserId] = [...watchlist];

    const result = saveState({ users: usersData, movies: moviesData, currentUserId, watchlists, comments });
    if (!result.success) {
      get().showToast('Save failed: storage is full. Remove a few images, then try again.', '⚠');
    }
    return result.success;
  },
}));

export default useAppStore;
