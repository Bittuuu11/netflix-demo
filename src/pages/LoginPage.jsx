/**
 * LoginPage.jsx — Premium Netflix-style login page.
 * Features a cinematic background overlay, semi-transparent form container,
 * and high-contrast inputs.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                navigate('/');
            } else {
                setError(data.status_message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Could not connect to the server. Please check if the backend is running.');
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4">
            {/* ── Background Image Layer ── */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bca1-0758418ff351/be438202-b364-4e1a-8e2b-426b6530a6c0/IN-en-20220228-popsignuptwoweeks-perspective_alpha_website_large.jpg")',
                }}
            >
                {/* Gradient overlays to darken the background */}
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
            </div>

            {/* ── Form Container ── */}
            <main className="relative z-10 w-full max-w-md bg-black/75 rounded-md p-8 sm:p-16 shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-8">Sign In</h1>

                {error && (
                    <div className="bg-[#e87c03] text-white text-sm py-2.5 px-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative group">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email or phone number"
                            className="w-full bg-[#333] text-white rounded px-5 py-4 outline-none focus:bg-[#454545] transition-colors border-b-2 border-transparent focus:border-red-500 placeholder-gray-500"
                            required
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-[#333] text-white rounded px-5 py-4 outline-none focus:bg-[#454545] transition-colors border-b-2 border-transparent focus:border-red-500 placeholder-gray-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-netflix hover:bg-red-700 text-white font-bold py-4 rounded transition-colors mt-6 shadow-lg shadow-netflix/20"
                    >
                        Sign In
                    </button>

                    <div className="flex items-center justify-between text-gray-400 text-xs mt-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input type="checkbox" className="accent-gray-500" defaultChecked />
                            Remember me
                        </label>
                        <a href="#" className="hover:underline">Need help?</a>
                    </div>
                </form>

                <div className="mt-12">
                    <p className="text-gray-500">
                        New to FilmFlix?{' '}
                        <Link to="/signup" className="text-white hover:underline font-semibold">
                            Sign up now.
                        </Link>
                    </p>
                    <p className="text-gray-500 text-xs mt-4 leading-relaxed">
                        This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
                        <span className="text-blue-500 hover:underline cursor-pointer">Learn more.</span>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
