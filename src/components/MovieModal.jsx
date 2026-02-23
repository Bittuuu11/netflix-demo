/**
 * MovieModal — Full-screen modal with comprehensive movie/TV details.
 * Shows: backdrop, title, genres, overview, cast (top 5), trailer button.
 * Clicking outside or pressing Escape closes the modal.
 */
import { useEffect, useCallback, useState } from 'react';
import { IMG_BASE_URL, BACKDROP_SIZE, PROFILE_SIZE } from '../services/tmdbApi';
import {
    getMovieDetails, getTVDetails,
    getMovieCredits, getTVCredits,
    getMovieVideos, getTVVideos,
    getYouTubeTrailerKey,
} from '../services/movieService';

// ── Helpers ──────────────────────────────────────────────────────────────────

const StarIcon = () => (
    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const LANGUAGE_MAP = {
    en: 'English', hi: 'Hindi', ja: 'Japanese', ko: 'Korean',
    fr: 'French', es: 'Spanish', de: 'German', zh: 'Chinese',
    it: 'Italian', pt: 'Portuguese', ru: 'Russian', ar: 'Arabic',
};

const formatRuntime = (mins) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// ── Internal: modal skeleton ──────────────────────────────────────────────────

const ModalSkeleton = () => (
    <div className="animate-pulse p-6 md:p-8">
        <div className="skeleton w-full h-48 sm:h-64 md:h-80 rounded-xl mb-6" />
        <div className="skeleton h-8 w-2/3 rounded mb-3" />
        <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-6 w-20 rounded-full" />)}
        </div>
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-5/6 rounded mb-2" />
        <div className="skeleton h-4 w-4/6 rounded mb-6" />
        <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex flex-col items-center gap-1">
                    <div className="skeleton w-14 h-14 rounded-full" />
                    <div className="skeleton h-3 w-14 rounded" />
                </div>
            ))}
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const MovieModal = ({ item, onClose }) => {
    const [details, setDetails] = useState(null);
    const [credits, setCredits] = useState(null);
    const [trailerKey, setTrailerKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [castImgErrors, setCastImgErrors] = useState({});

    const mediaType = item?.media_type || (item?.title ? 'movie' : 'tv');
    const isMovie = mediaType !== 'tv';

    // Close on Escape key
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden'; // prevent background scroll
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    // Fetch all required data in parallel
    useEffect(() => {
        if (!item?.id) return;
        setLoading(true);

        const detailsFn = isMovie ? getMovieDetails : getTVDetails;
        const creditsFn = isMovie ? getMovieCredits : getTVCredits;
        const videosFn = isMovie ? getMovieVideos : getTVVideos;

        Promise.all([detailsFn(item.id), creditsFn(item.id), videosFn(item.id)])
            .then(([det, cred, vids]) => {
                setDetails(det);
                setCredits(cred);
                setTrailerKey(getYouTubeTrailerKey(vids.results || []));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [item?.id, isMovie]);

    if (!item) return null;

    const title = details?.title || details?.name || item.title || item.name || 'Unknown';
    const overview = details?.overview || item.overview || 'No description available.';
    const rating = details?.vote_average?.toFixed(1) || item.vote_average?.toFixed(1) || 'N/A';
    const releaseDate = details?.release_date || details?.first_air_date || '';
    const runtime = isMovie ? formatRuntime(details?.runtime) : null;
    const seasons = !isMovie && details?.number_of_seasons;
    const language = LANGUAGE_MAP[details?.original_language] || details?.original_language?.toUpperCase();
    const genres = details?.genres || [];
    const backdrop = (details?.backdrop_path || item.backdrop_path)
        ? `${IMG_BASE_URL}/${BACKDROP_SIZE}${details?.backdrop_path || item.backdrop_path}`
        : null;
    const cast = credits?.cast?.slice(0, 5) || [];

    return (
        <div
            className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${title}`}
        >
            <div
                className="relative bg-[#181818] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
            >
                {/* ── Close Button ── */}
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-netflix/80 border border-white/10 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                </button>

                {/* ── Loading ── */}
                {loading ? (
                    <ModalSkeleton />
                ) : (
                    <>
                        {/* ── Backdrop Image ── */}
                        <div className="relative w-full h-48 sm:h-64 md:h-72 rounded-t-2xl overflow-hidden">
                            {backdrop ? (
                                <img src={backdrop} alt={title} className="w-full h-full object-cover object-top" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/30 to-transparent" />

                            {/* Title overlaid on image */}
                            <div className="absolute bottom-4 left-5 right-12">
                                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight" style={{ textShadow: '1px 1px 10px rgba(0,0,0,0.9)' }}>
                                    {title}
                                </h2>
                            </div>
                        </div>

                        {/* ── Body ── */}
                        <div className="px-5 sm:px-7 pb-7 pt-3">

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                                {/* Rating */}
                                <div className="flex items-center gap-1.5">
                                    <StarIcon />
                                    <span className="text-yellow-400 font-bold text-base">{rating}</span>
                                    <span className="text-gray-500 text-xs">/ 10</span>
                                </div>

                                {/* Release date */}
                                {releaseDate && (
                                    <span className="text-gray-400">{releaseDate.slice(0, 4)}</span>
                                )}

                                {/* Runtime or seasons */}
                                {runtime && <span className="text-gray-400 border border-gray-700 px-2 py-0.5 rounded">{runtime}</span>}
                                {seasons && <span className="text-gray-400 border border-gray-700 px-2 py-0.5 rounded">{seasons} Season{seasons > 1 ? 's' : ''}</span>}

                                {/* Language */}
                                {language && <span className="text-gray-400">{language}</span>}

                                {/* Media type */}
                                <span className="genre-badge">
                                    {isMovie ? 'Movie' : 'TV Series'}
                                </span>
                            </div>

                            {/* Genres */}
                            {genres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {genres.map((g) => (
                                        <span key={g.id} className="genre-badge">{g.name}</span>
                                    ))}
                                </div>
                            )}

                            {/* Overview */}
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-5">{overview}</p>

                            {/* Trailer Button */}
                            {trailerKey && (
                                <a
                                    href={`https://www.youtube.com/watch?v=${trailerKey}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-netflix hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 text-sm mb-6 shadow-lg hover:shadow-netflix/30"
                                >
                                    {/* Play icon */}
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                    Watch Trailer on YouTube
                                </a>
                            )}

                            {/* Cast */}
                            {cast.length > 0 && (
                                <div>
                                    <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Top Cast</h3>
                                    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
                                        {cast.map((actor) => {
                                            const profileUrl = actor.profile_path && !castImgErrors[actor.id]
                                                ? `${IMG_BASE_URL}/${PROFILE_SIZE}${actor.profile_path}`
                                                : null;
                                            return (
                                                <div key={actor.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16 text-center">
                                                    {profileUrl ? (
                                                        <img
                                                            src={profileUrl}
                                                            alt={actor.name}
                                                            loading="lazy"
                                                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-700"
                                                            onError={() => setCastImgErrors(prev => ({ ...prev, [actor.id]: true }))}
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                                                            <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <p className="text-gray-300 text-[11px] font-medium leading-tight line-clamp-2">{actor.name}</p>
                                                    {actor.character && (
                                                        <p className="text-gray-500 text-[10px] leading-tight line-clamp-1">{actor.character}</p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MovieModal;
