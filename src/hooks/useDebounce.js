/**
 * useDebounce — Delays updating a value until the user stops typing.
 * Used for the search bar to avoid spamming the TMDB API.
 */
import { useState, useEffect } from 'react';

const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup: clear timer if value changes before delay expires
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
