/**
 * LoginPage.jsx — Premium Netflix-style login page.
 * Features a cinematic background overlay, semi-transparent form container,
 * and high-contrast inputs.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTrending } from '../services/movieService';
import { IMG_BASE_URL } from '../services/tmdbApi';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [backdrops, setBackdrops] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    // ─── Backdrop Slideshow Logic ──────────────────────────────────────────
    useEffect(() => {
        const fetchBackdrops = async () => {
            try {
                const data = await getTrending();
                const images = data.results
                    .filter(item => item.backdrop_path)
                    .map(item => `${IMG_BASE_URL}/original${item.backdrop_path}`);
                setBackdrops(images.slice(0, 10)); // Take top 10 trending images
            } catch (err) {
                console.error('Failed to fetch backdrops:', err);
            }
        };
        fetchBackdrops();
    }, []);

    useEffect(() => {
        if (backdrops.length === 0) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % backdrops.length);
        }, 6000); // 6 second transition
        return () => clearInterval(interval);
    }, [backdrops]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/home');
            } else {
                setError(data.status_message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Could not connect to the server. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden font-sans bg-black">
            {/* ── Cinematic Background System ── */}
            <div className="absolute inset-0 z-0">
                {backdrops.length > 0 ? (
                    backdrops.map((url, index) => (
                        <div
                            key={url}
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{ backgroundImage: `url("${url}")` }}
                        />
                    ))
                ) : (
                    // Initial fallback image
                    <div className="absolute inset-0 bg-cover bg-center bg-[#141414]"
                        style={{ backgroundImage: 'url("https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bca1-0758418ff351/be438202-b364-4e1a-8e2b-426b6530a6c0/IN-en-20220228-popsignuptwoweeks-perspective_alpha_website_large.jpg")' }} />
                )}
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black" />
            </div>

            {/* ── Premium Glassmorphism Card ── */}
            <main className="relative z-10 w-full max-w-[450px] animate-in fade-in zoom-in duration-700">
                <div className="backdrop-blur-[24px] bg-white/[0.12] border border-white/20 rounded-[22px] p-10 sm:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    {/* Brand */}
                    <div className="flex flex-col items-center mb-10">
                        <span className="text-netflix text-4xl font-black tracking-tighter mb-4">FILMFLIX</span>
                        <h1 className="text-2xl font-bold text-white text-center">Sign in to your account</h1>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm py-3 px-4 rounded-lg mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email or Username</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-5 py-4 outline-none focus:bg-white/10 focus:border-white/30 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 placeholder-white/20"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end mb-1 px-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                                <button type="button" className="text-xs text-gray-500 hover:text-white transition-colors">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-5 py-4 outline-none focus:bg-white/10 focus:border-white/30 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 placeholder-white/20"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-netflix hover:bg-red-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all duration-300 mt-4 shadow-[0_5px_15px_rgba(229,9,20,0.3)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 group"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-gray-500 text-sm">
                            New here?{' '}
                            <Link to="/signup" className="text-white hover:underline transition-all font-medium ml-1">
                                Create an account.
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
