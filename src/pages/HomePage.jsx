/**
 * HomePage — Main landing page.
 * Shows HeroBanner + multiple horizontal carousels of movies/TV.
 */
import { useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import useFetch from '../hooks/useFetch';
import {
    getTrending, getPopularMovies, getTopRated, getUpcoming, getPopularTVShows,
} from '../services/movieService';

const HomePage = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch all sections in parallel (each useFetch is independent)
    const trending = useFetch(() => getTrending(), []);
    const popular = useFetch(() => getPopularMovies(), []);
    const topRated = useFetch(() => getTopRated(), []);
    const upcoming = useFetch(() => getUpcoming(), []);
    const tvShows = useFetch(() => getPopularTVShows(), []);

    return (
        <main className="min-h-screen bg-netflix-dark page-enter">
            {/* Hero Banner (uses trending results) */}
            <HeroBanner
                items={trending.data?.results || []}
                loading={trending.loading}
                onSelect={setSelectedItem}
            />

            {/* Carousels — sit on top of the hero gradient fade */}
            <div className="relative z-10 -mt-16 pb-16">
                <MovieRow
                    title="🔥 Trending Now"
                    items={trending.data?.results || []}
                    loading={trending.loading}
                    error={trending.error}
                    onSelect={setSelectedItem}
                />
                <MovieRow
                    title="🎬 Popular Movies"
                    items={popular.data?.results || []}
                    loading={popular.loading}
                    error={popular.error}
                    onSelect={setSelectedItem}
                />
                <MovieRow
                    title="⭐ Top Rated"
                    items={topRated.data?.results || []}
                    loading={topRated.loading}
                    error={topRated.error}
                    onSelect={setSelectedItem}
                />
                <MovieRow
                    title="🆕 Upcoming Movies"
                    items={upcoming.data?.results || []}
                    loading={upcoming.loading}
                    error={upcoming.error}
                    onSelect={setSelectedItem}
                />
                <MovieRow
                    title="📺 Popular TV Shows"
                    items={tvShows.data?.results || []}
                    loading={tvShows.loading}
                    error={tvShows.error}
                    onSelect={setSelectedItem}
                />
            </div>

            {/* Movie Detail Modal */}
            {selectedItem && (
                <MovieModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </main>
    );
};

export default HomePage;
