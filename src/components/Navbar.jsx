/**
 * Navbar — Fixed top navigation bar.
 * Transitions from transparent to solid on scroll.
 * Includes logo, nav links, and search that navigates to /search.
 */
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const searchRef = useRef(null);

    // Detect scroll to switch navbar background
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen && searchRef.current) searchRef.current.focus();
    }, [searchOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            navigate(`/search?q=${encodeURIComponent(trimmed)}`);
            setSearchOpen(false);
            setQuery('');
            setMenuOpen(false);
        }
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/movies', label: 'Movies' },
        { to: '/tv-shows', label: 'TV Shows' },
        { to: '/trending', label: 'Trending' },
    ];

    const isActive = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || menuOpen ? 'navbar-solid shadow-2xl' : 'navbar-transparent'
                }`}
        >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* ── Logo ── */}
                    <Link
                        to="/"
                        className="flex-shrink-0 text-2xl md:text-3xl font-black tracking-widest text-netflix select-none"
                        style={{ letterSpacing: '0.12em', textShadow: '0 0 20px rgba(229,9,20,0.5)' }}
                    >
                        FILMFLIX
                    </Link>

                    {/* ── Desktop Nav Links ── */}
                    <ul className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navLinks.map(({ to, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className={`text-sm font-medium transition-colors duration-200 border-b-2 pb-0.5 ${isActive(to)
                                        ? 'text-white border-netflix'
                                        : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
                                        }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* ── Right Controls ── */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <form
                            onSubmit={handleSearch}
                            className={`flex items-center transition-all duration-300 ${searchOpen ? 'w-48 sm:w-64' : 'w-9'
                                }`}
                        >
                            {searchOpen && (
                                <input
                                    ref={searchRef}
                                    id="navbar-search"
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search movies, shows..."
                                    className="flex-1 bg-black/70 border border-white/30 rounded-l text-sm text-white placeholder-gray-500 px-3 py-1.5 outline-none focus:border-netflix/60"
                                />
                            )}
                            <button
                                type={searchOpen ? 'submit' : 'button'}
                                onClick={() => !searchOpen && setSearchOpen(true)}
                                aria-label="Search"
                                className="bg-black/40 border border-white/20 rounded p-1.5 text-white hover:text-netflix hover:border-netflix/50 transition-colors"
                            >
                                {/* Search icon */}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                                </svg>
                            </button>
                            {searchOpen && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchOpen(false); setQuery(''); }}
                                    className="ml-1 text-gray-400 hover:text-white transition-colors"
                                    aria-label="Close search"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </form>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden text-white p-1.5 rounded"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                {menuOpen
                                    ? <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                                    : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                                }
                            </svg>
                        </button>

                        {/* Sign In Button */}
                        {!['/login', '/signup'].includes(location.pathname) && (
                            <Link
                                to="/login"
                                className="bg-netflix hover:bg-red-700 text-white text-xs md:text-sm font-semibold px-4 py-1.5 md:px-5 md:py-2 rounded transition-colors shadow-lg shadow-netflix/20 whitespace-nowrap"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>

                {/* ── Mobile Menu ── */}
                {menuOpen && (
                    <div className="md:hidden pb-4 border-t border-white/10">
                        <ul className="flex flex-col gap-1 mt-3">
                            {navLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        onClick={() => setMenuOpen(false)}
                                        className={`block px-3 py-2 rounded text-sm font-medium transition-colors ${isActive(to) ? 'text-white bg-netflix/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
