/**
 * SignupPage.jsx — Premium Netflix-style signup page.
 * Consistent aesthetic with the LoginPage.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.status_message || 'Signup failed.');
            }
        } catch (err) {
            setError('Could not connect to the server.');
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
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
            </div>

            {/* ── Form Container ── */}
            <main className="relative z-10 w-full max-w-md bg-black/75 rounded-md p-8 sm:p-16 shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-8">Sign Up</h1>

                {error && (
                    <div className="bg-[#e87c03] text-white text-sm py-2.5 px-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full bg-[#333] text-white rounded px-5 py-4 outline-none focus:bg-[#454545] transition-colors border-b-2 border-transparent focus:border-red-500 placeholder-gray-500"
                        required
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create Password"
                        className="w-full bg-[#333] text-white rounded px-5 py-4 outline-none focus:bg-[#454545] transition-colors border-b-2 border-transparent focus:border-red-500 placeholder-gray-500"
                        required
                    />

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full bg-[#333] text-white rounded px-5 py-4 outline-none focus:bg-[#454545] transition-colors border-b-2 border-transparent focus:border-red-500 placeholder-gray-500"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-netflix hover:bg-red-700 text-white font-bold py-4 rounded transition-colors mt-6 shadow-lg shadow-netflix/20"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-12">
                    <p className="text-gray-500 text-base">
                        Already have an account?{' '}
                        <Link to="/login" className="text-white hover:underline font-semibold">
                            Login here.
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default SignupPage;
