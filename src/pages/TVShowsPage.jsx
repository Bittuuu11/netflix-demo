/**
 * TVShowsPage — Browse popular TV shows in a two-tab grid.
 */
import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import SkeletonCard from '../components/SkeletonCard';
import useFetch from '../hooks/useFetch';
import { getPopularTVShows, getTopRatedTV } from '../services/movieService';

const TABS = [
    { id: 'popular', label: 'Popular', fetchFn: getPopularTVShows },
    { id: 'top_rated', label: 'Top Rated', fetchFn: getTopRatedTV },
];

const TVShowsPage = () => {
    const [activeTab, setActiveTab] = useState('popular');
    const [selectedItem, setSelectedItem] = useState(null);

    const currentFetch = TABS.find(t => t.id === activeTab)?.fetchFn;
    const { data, loading, error } = useFetch(() => currentFetch?.(), [activeTab]);
    const shows = data?.results || [];

    return (
        <main className="min-h-screen bg-netflix-dark pt-24 pb-16 page-enter">
            <div className="px-4 sm:px-6 lg:px-8 mb-8">
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-6">TV Shows</h1>
                <div className="flex gap-2 flex-wrap">
                    {TABS.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${id === activeTab
                                    ? 'bg-netflix text-white shadow-lg shadow-netflix/30'
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="text-red-400 px-8 mb-4">{error}</p>}

            <div className="px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {loading
                    ? Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)
                    : shows.map((show) => (
                        <MovieCard
                            key={show.id}
                            item={{ ...show, media_type: 'tv' }}
                            onSelect={setSelectedItem}
                        />
                    ))
                }
            </div>

            {selectedItem && (
                <MovieModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </main>
    );
};

export default TVShowsPage;
