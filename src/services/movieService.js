/**
 * movieService.js
 * All TMDB API calls are centralised here, keeping components clean.
 */
import tmdbApi from './tmdbApi';

// ─── Movies ───────────────────────────────────────────────────────────────

/** Fetch weekly trending movies + TV */
export const getTrending = (page = 1) =>
    tmdbApi.get('/trending/all/week', { params: { page } }).then((r) => r.data);

/** Fetch popular movies */
export const getPopularMovies = (page = 1) =>
    tmdbApi.get('/movie/popular', { params: { page } }).then((r) => r.data);

/** Fetch top-rated movies */
export const getTopRated = (page = 1) =>
    tmdbApi.get('/movie/top_rated', { params: { page } }).then((r) => r.data);

/** Fetch upcoming movies */
export const getUpcoming = (page = 1) =>
    tmdbApi.get('/movie/upcoming', { params: { page } }).then((r) => r.data);

/** Fetch popular TV shows */
export const getPopularTVShows = (page = 1) =>
    tmdbApi.get('/tv/popular', { params: { page } }).then((r) => r.data);

/** Fetch top-rated TV shows */
export const getTopRatedTV = (page = 1) =>
    tmdbApi.get('/tv/top_rated', { params: { page } }).then((r) => r.data);

// ─── Details ──────────────────────────────────────────────────────────────

/** Fetch full movie details */
export const getMovieDetails = (id) =>
    tmdbApi.get(`/movie/${id}`).then((r) => r.data);

/** Fetch full TV show details */
export const getTVDetails = (id) =>
    tmdbApi.get(`/tv/${id}`).then((r) => r.data);

/** Fetch movie cast */
export const getMovieCredits = (id) =>
    tmdbApi.get(`/movie/${id}/credits`).then((r) => r.data);

/** Fetch TV show cast */
export const getTVCredits = (id) =>
    tmdbApi.get(`/tv/${id}/credits`).then((r) => r.data);

/** Fetch movie trailer videos */
export const getMovieVideos = (id) =>
    tmdbApi.get(`/movie/${id}/videos`).then((r) => r.data);

/** Fetch TV show trailer videos */
export const getTVVideos = (id) =>
    tmdbApi.get(`/tv/${id}/videos`).then((r) => r.data);

// ─── Search ───────────────────────────────────────────────────────────────

/** Search both movies and TV shows */
export const searchMulti = (query, page = 1) =>
    tmdbApi
        .get('/search/multi', { params: { query, page, include_adult: false } })
        .then((r) => r.data);

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Given a list of video objects from TMDB, return the YouTube trailer key.
 * Priority: Official Trailer > Trailer > Teaser
 */
export const getYouTubeTrailerKey = (videos = []) => {
    const ytVideos = videos.filter((v) => v.site === 'YouTube');
    const trailer =
        ytVideos.find((v) => v.type === 'Trailer' && v.official) ||
        ytVideos.find((v) => v.type === 'Trailer') ||
        ytVideos.find((v) => v.type === 'Teaser') ||
        ytVideos[0];
    return trailer?.key || null;
};
