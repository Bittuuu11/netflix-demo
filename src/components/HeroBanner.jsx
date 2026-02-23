/**
 * HeroBanner — Full-width hero section featuring a highlighted movie/show.
 * Shows backdrop image, gradient overlay, title, overview, rating.
 * "More Info" button opens the MovieModal.
 */
import { useState, useEffect } from 'react';
import { IMG_BASE_URL, BACKDROP_SIZE } from '../services/tmdbApi';

const StarIcon = () => (
    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

// Heroic skeleton while items are loading
const HeroBannerSkeleton = () => (
    <div className="relative w-full h-[70vh] md:h-[85vh] skeleton">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute bottom-16 left-6 sm:left-10 lg:left-16 w-full">
            <div className="skeleton h-10 w-64 mb-4 rounded" />
            <div className="skeleton h-4 w-96 mb-2 rounded" />
            <div className="skeleton h-4 w-80 mb-6 rounded" />
            <div className="skeleton h-10 w-32 rounded-md" />
        </div>
    </div>
);

const HeroBanner = ({ items = [], loading = false, onSelect }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-rotate hero item every 8 seconds
    useEffect(() => {
        if (!items.length) return;
        const id = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % Math.min(items.length, 5));
        }, 8000);
        return () => clearInterval(id);
    }, [items.length]);

    if (loading) return <HeroBannerSkeleton />;
    if (!items.length) return null;

    const featured = items[activeIndex];
    const title = featured.title || featured.name || 'Unknown';
    const overview = featured.overview || 'No description available.';
    const rating = featured.vote_average?.toFixed(1) || 'N/A';
    const backdrop = featured.backdrop_path
        ? `${IMG_BASE_URL}/${BACKDROP_SIZE}${featured.backdrop_path}`
        : null;

    return (
        <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
            {/* Backdrop Image */}
            {backdrop ? (
                <img
                    src={backdrop}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
                    key={featured.id}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 hero-gradient" />

            {/* Content */}
            <div className="absolute bottom-12 sm:bottom-16 left-4 sm:left-10 lg:left-16 right-4 sm:right-auto max-w-xl">
                {/* Media type badge */}
                <span className="genre-badge mb-3 inline-block">
                    {featured.media_type === 'tv' ? '📺 TV SERIES' : '🎬 MOVIE'}
                </span>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight"
                    style={{ textShadow: '2px 2px 20px rgba(0,0,0,0.8)' }}>
                    {title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <StarIcon />
                    <span className="text-yellow-400 font-bold text-lg">{rating}</span>
                    <span className="text-gray-400 text-sm">/ 10</span>
                    <span className="text-gray-500 text-xs">·</span>
                    <span className="text-gray-400 text-sm">
                        {(featured.release_date || featured.first_air_date || '').slice(0, 4)}
                    </span>
                </div>

                {/* Overview */}
                <p className="text-gray-300 text-sm sm:text-base line-clamp-3 mb-6 leading-relaxed max-w-md">
                    {overview}
                </p>

                {/* CTA Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={() => onSelect && onSelect(featured)}
                        className="flex items-center gap-2 bg-netflix hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-netflix/40"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <circle cx={12} cy={12} r={10} />
                            <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                        </svg>
                        More Info
                    </button>
                </div>
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {items.slice(0, 5).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        aria-label={`Hero item ${i + 1}`}
                        className={`rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 h-2 bg-netflix' : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroBanner;
