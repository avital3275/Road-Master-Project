import { useState, useEffect } from 'react';

// Hook כללי לקריאות API
const useFetch = (url, token) => {
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    useEffect(() => {
        if (!url || !token) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) throw new Error(`שגיאה: ${res.status}`);

                const json = await res.json();
                setData(json);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, token]);

    return { data, loading, error };
};

export default useFetch;