/**
 * Axios instance configured for the TMDB API.
 * All requests automatically include the API key and language.
 */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '1fd32146bdeb72d91d9101b47e7e5034';

// Base image URL constants (used throughout the app)
export const IMG_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZE = 'w342';
export const BACKDROP_SIZE = 'w1280';
export const PROFILE_SIZE = 'w185';

const tmdbApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 second timeout to prevent perpetual "buffering"
    params: {
        api_key: API_KEY,
        language: 'en-US',
    },
});

// Response interceptor for global error logging
tmdbApi.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const message = error?.response?.data?.status_message || error?.message || 'Unknown error';
        const url = error?.config?.url;
        const method = error?.config?.method?.toUpperCase();

        console.error(`[TMDB API Error] ${method} ${url} | Status: ${status} | Message: ${message}`);

        if (status === 500) {
            console.warn('[TMDB API] Internal Server Error (500) detected. This may be an intermittent issue with the network or proxy.');
        }

        return Promise.reject(error);
    }
);

export default tmdbApi;
