/**
 * SearchPage — Live search using TMDB's multi-search API.
 * Reads query from URL params (?q=...) and navigates on new searches.
 * Uses useDebounce to reduce API calls while typing.
 */
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchResultsGrid from '../components/SearchResultsGrid';
import MovieModal from '../components/MovieModal';
import useDebounce from '../hooks/useDebounce';
import { searchMulti } from '../services/movieService';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialQuery = searchParams.get('q') || '';

    const [inputValue, setInputValue] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const debouncedQuery = useDebounce(inputValue, 400);

    // Sync URL with debounced query
    useEffect(() => {
        if (debouncedQuery) {
            navigate(`/search?q=${encodeURIComponent(debouncedQuery)}`, { replace: true });
        } else {
            navigate('/search', { replace: true });
        }
    }, [debouncedQuery, navigate]);

    // Run search when debounced query changes
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        setError(null);
        searchMulti(debouncedQuery)
            .then((data) => setResults(data.results || []))
            .catch((err) => setError(err?.response?.data?.status_message || 'Search failed. Please try again.'))
            .finally(() => setLoading(false));
    }, [debouncedQuery]);

    return (
        <main className="min-h-screen bg-netflix-dark pt-24 pb-16 page-enter">
            {/* Search header */}
            <div className="px-4 sm:px-6 lg:px-8 mb-8">
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-6">Search</h1>

                {/* Search Input */}
                <div className="relative max-w-2xl">
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                    >
                        <circle cx={11} cy={11} r={8} />
                        <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                    </svg>
                    <input
                        id="search-input"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search movies, TV shows..."
                        autoFocus
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl py-3.5 pl-12 pr-10 text-base outline-none focus:border-netflix/60 focus:bg-white/15 transition-all"
                    />
                    {inputValue && (
                        <button
                            onClick={() => setInputValue('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            aria-label="Clear search"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                            </svg>
                        </button>
                    )}
                </div>

                {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
            </div>

            {/* Results */}
            <SearchResultsGrid
                results={results}
                query={debouncedQuery}
                loading={loading}
                onSelect={setSelectedItem}
            />

            {/* Modal */}
            {selectedItem && (
                <MovieModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </main>
    );
};

export default SearchPage;
