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

import { Component } from 'react';

// Error Boundary to prevent blank screens
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ backgroundColor: '#141414', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
                    <h1 style={{ color: '#e50914', fontSize: '3rem' }}>Oops!</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Something went wrong while loading the app.</p>
                    <pre style={{ backgroundColor: '#222', padding: '15px', borderRadius: '5px', fontSize: '0.8rem', maxWidth: '100%', overflowX: 'auto' }}>
                        {this.state.error?.toString()}
                    </pre>
                    <button onClick={() => window.location.reload()} style={{ marginTop: '20px', backgroundColor: '#e50914', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                        Refresh Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const App = () => (
    <ErrorBoundary>
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    </ErrorBoundary>
);

export default App;
