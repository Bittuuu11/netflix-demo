/**
 * useFetch — Generic data-fetching hook.
 * @param {Function} fetchFn - async function that returns data
 * @param {Array}    deps    - dependency array (like useEffect)
 * Returns { data, loading, error, refetch }
 */
import { useState, useEffect, useCallback, useRef } from 'react';

const useFetch = (fetchFn, deps = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isMounted = useRef(true);

    const fetch = useCallback(async () => {
        if (!fetchFn) return;
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFn();
            if (isMounted.current) setData(result);
        } catch (err) {
            if (isMounted.current) {
                // Try to get message from API response, then from error object, then fallback
                const errorMessage = err?.response?.data?.status_message ||
                    err?.message ||
                    'Something went wrong. Please try again.';
                setError(errorMessage);
            }
        } finally {
            if (isMounted.current) setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        isMounted.current = true;
        fetch();
        return () => { isMounted.current = false; };
    }, [fetch]);

    return { data, loading, error, refetch: fetch };
};

export default useFetch;
