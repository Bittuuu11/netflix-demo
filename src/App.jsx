/**
 * App.jsx — Root component that sets up React Router routes.
 * Navbar is always rendered; pages are rendered inside the outlet.
 */
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import TrendingPage from './pages/TrendingPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Simple 404 component
const NotFound = () => (
    <main className="min-h-screen bg-netflix-dark flex flex-col items-center justify-center text-center p-8 pt-24">
        <p className="text-8xl font-black text-netflix mb-4">404</p>
        <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="bg-netflix hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Go Home
        </a>
    </main>
);

const AppContent = () => {
    const location = useLocation();
    const hideNavbar = ['/', '/login', '/signup'].includes(location.pathname);

    return (
        <>
            {/* Show navbar except on auth pages for a cinematic feel */}
            {!hideNavbar && <Navbar />}

            <Routes>
                {/* Start with login page as requested */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/tv-shows" element={<TVShowsPage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

const App = () => (
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>
);

export default App;
