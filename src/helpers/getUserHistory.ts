import { SongHistory } from "@/models/User";
import axios from "axios";

const getHistory = async () => {
    try {
        const response = await axios.get("/api/v1/user/get-history");
        const songHistory = response.data.songHistory;
        const last10Songs = songHistory.slice(-10); // Get the last 10 songs
        return last10Songs.reverse();
    } catch (error) {
        console.error('Error getting user history:', error);
        throw error;
    }
}

export const getUserHistory = async () => {
    try {
        const history = await getHistory();
        const songDetails = await Promise.all(history.map(async (song: SongHistory) => {
            try {
                const response = await axios.get(`https://saavn-api-sigma.vercel.app/api/songs/${song.songId}`);
                return {
                    ...response.data.data[0],
                    playedAt: song.playedAt
                };
            } catch (error) {
                console.error(`Error fetching details for song ${song.songId}:`, error);
                return null;
            }
        }));

        return songDetails.filter(song => song !== null);
    } catch (error) {
        console.error('Error getting user history with details:', error);
        throw error;
    }
}
