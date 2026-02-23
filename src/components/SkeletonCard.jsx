/**
 * SkeletonCard — Animated shimmer placeholder while data is loading.
 * Drop-in replacement for MovieCard during loading state.
 */
const SkeletonCard = () => (
    <div className="flex-shrink-0 w-36 sm:w-40 md:w-44 rounded-lg overflow-hidden">
        {/* Poster area */}
        <div className="skeleton w-full h-52 sm:h-60 rounded-lg" />
        {/* Title line */}
        <div className="mt-2 skeleton h-3 w-3/4 rounded" />
        {/* Year line */}
        <div className="mt-1.5 skeleton h-3 w-1/2 rounded" />
    </div>
);

export default SkeletonCard;
