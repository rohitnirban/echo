import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SongHistory {
    songId: string;
    playedAt: string;
}

const HistoryModal = () => {
    const [history, setHistory] = useState<SongHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('/api/v1/user/get-history');
                if (response.data.success) {
                    setHistory(response.data.songHistory);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError('Failed to fetch song history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div>
            <h2>Song History</h2>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {history.length > 0 ? (
                <ul>
                    {history.map((entry, index) => (
                        <li key={index}>
                            <p>Song ID: {entry.songId}</p>
                            <p>Played At: {new Date(entry.playedAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No song history available.</p>
            )}
        </div>
    );
};

export default HistoryModal;
