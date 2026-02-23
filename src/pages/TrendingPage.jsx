/**
 * TrendingPage — Shows weekly trending movies and TV shows in a grid.
 */
import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import SkeletonCard from '../components/SkeletonCard';
import useFetch from '../hooks/useFetch';
import { getTrending } from '../services/movieService';

const TrendingPage = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all' | 'movie' | 'tv'

    const { data, loading, error } = useFetch(() => getTrending(), []);

    const raw = data?.results || [];
    const items = filter === 'all' ? raw : raw.filter(i => i.media_type === filter);

    return (
        <main className="min-h-screen bg-netflix-dark pt-24 pb-16 page-enter">
            <div className="px-4 sm:px-6 lg:px-8 mb-8">
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">🔥 Trending This Week</h1>
                <p className="text-gray-400 text-sm mb-6">The hottest movies and shows right now</p>

                {/* Filter chips */}
                <div className="flex gap-2 flex-wrap">
                    {[
                        { id: 'all', label: '🌐 All' },
                        { id: 'movie', label: '🎬 Movies' },
                        { id: 'tv', label: '📺 TV Shows' },
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setFilter(id)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${id === filter
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
                    ? Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)
                    : items.map((item) => (
                        <MovieCard key={`${item.id}-${item.media_type}`} item={item} onSelect={setSelectedItem} />
                    ))
                }
            </div>

            {selectedItem && (
                <MovieModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </main>
    );
};

export default TrendingPage;
