/**
 * MovieRow — Horizontal scrollable carousel row.
 * Shows a title, left/right scroll buttons, and a list of MovieCards or skeletons.
 */
import { useRef } from 'react';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

const SKELETON_COUNT = 8;

// Chevron icons
const ChevronLeft = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRight = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MovieRow = ({ title, items = [], loading = false, error = null, onSelect }) => {
    const rowRef = useRef(null);

    const scroll = (direction) => {
        if (!rowRef.current) return;
        const scrollAmount = rowRef.current.clientWidth * 0.75;
        rowRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    return (
        <section className="mb-8 group/row">
            {/* Row Header */}
            <h2 className="text-white text-lg sm:text-xl font-bold mb-3 px-4 sm:px-6 lg:px-8 tracking-wide">
                {title}
                <span className="ml-2 text-netflix text-sm font-normal opacity-0 group-hover/row:opacity-100 transition-opacity">
                    See all →
                </span>
            </h2>

            {/* Error state */}
            {error && (
                <div className="px-4 sm:px-6 text-red-400 text-sm">{error}</div>
            )}

            {/* Carousel */}
            <div className="relative">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                    className="carousel-btn absolute left-1 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 text-white hidden sm:flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
                >
                    <ChevronLeft />
                </button>

                {/* Scrollable list */}
                <div
                    ref={rowRef}
                    className="flex gap-3 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 py-2"
                >
                    {loading
                        ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <SkeletonCard key={i} />)
                        : items.map((item) => (
                            <MovieCard key={`${item.id}-${item.media_type || ''}`} item={item} onSelect={onSelect} />
                        ))
                    }
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                    className="carousel-btn absolute right-1 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 text-white hidden sm:flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
                >
                    <ChevronRight />
                </button>
            </div>
        </section>
    );
};

export default MovieRow;
