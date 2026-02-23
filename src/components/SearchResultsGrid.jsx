/**
 * SearchResultsGrid — Responsive grid of MovieCards for search results.
 * Shows empty state and result count.
 */
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

const SearchResultsGrid = ({ results = [], query = '', loading = false, onSelect }) => {
    // Filter out results without posters (people etc.)
    const filtered = results.filter(
        (r) => r.media_type !== 'person' && (r.poster_path || r.backdrop_path)
    );

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 sm:px-6 lg:px-8">
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        );
    }

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                    <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
                <p className="text-gray-500 text-lg font-medium">Search for a movie or TV show</p>
                <p className="text-gray-600 text-sm mt-1">Type in the search bar above</p>
            </div>
        );
    }

    if (!filtered.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                    <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
                </svg>
                <p className="text-gray-500 text-lg font-medium">No results for "{query}"</p>
                <p className="text-gray-600 text-sm mt-1">Try a different search term</p>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <p className="text-gray-400 text-sm mb-4">
                Found <span className="text-white font-semibold">{filtered.length}</span> results for{' '}
                <span className="text-netflix font-semibold">"{query}"</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filtered.map((item) => (
                    <MovieCard key={`${item.id}-${item.media_type}`} item={item} onSelect={onSelect} />
                ))}
            </div>
        </div>
    );
};

export default SearchResultsGrid;
