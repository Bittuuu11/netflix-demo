/**
 * MovieCard — Displays a single movie/TV show as a poster card.
 * Hover reveals overlay with extra info. Click opens MovieModal.
 */
import { useState } from 'react';
import { IMG_BASE_URL, POSTER_SIZE } from '../services/tmdbApi';

// Star icon for ratings
const StarIcon = () => (
    <svg className="w-3.5 h-3.5 text-yellow-400 inline-block" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const MovieCard = ({ item, onSelect }) => {
    const [imgError, setImgError] = useState(false);

    if (!item) return null;

    const title = item.title || item.name || 'Unknown';
    const year = (item.release_date || item.first_air_date || '').slice(0, 4);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
    const posterUrl = item.poster_path && !imgError
        ? `${IMG_BASE_URL}/${POSTER_SIZE}${item.poster_path}`
        : null;

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label={`View details for ${title}`}
            className="movie-card relative flex-shrink-0 w-36 sm:w-40 md:w-44 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => onSelect && onSelect(item)}
            onKeyDown={(e) => e.key === 'Enter' && onSelect && onSelect(item)}
        >
            {/* Poster */}
            {posterUrl ? (
                <img
                    src={posterUrl}
                    alt={title}
                    loading="lazy"
                    className="w-full h-52 sm:h-60 object-cover rounded-lg"
                    onError={() => setImgError(true)}
                />
            ) : (
                // Fallback when no poster
                <div className="w-full h-52 sm:h-60 rounded-lg bg-gray-800 flex flex-col items-center justify-center gap-2 text-gray-500">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                    <span className="text-xs text-center px-2 line-clamp-2">{title}</span>
                </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5">
                <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">{title}</p>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-400 text-xs">{year}</span>
                    <span className="flex items-center gap-0.5 text-xs font-medium text-yellow-400">
                        <StarIcon /> {rating}
                    </span>
                </div>
                {/* Media type badge */}
                <span className="mt-1.5 inline-block text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-netflix/30 text-netflix-light border border-netflix/30 w-fit text-red-400">
                    {mediaType === 'tv' ? 'TV' : 'Movie'}
                </span>
            </div>
        </div>
    );
};

export default MovieCard;
