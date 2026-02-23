/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                netflix: '#E50914',
                'netflix-dark': '#141414',
                'netflix-gray': '#808080',
                'card-bg': '#1a1a2e',
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
            animation: {
                shimmer: 'shimmer 1.5s infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
        },
    },
    plugins: [],
}
