import axios from "axios";

export async function addSongToHistory(songId: string) {
    try {
        const response = await axios.post(`/api/v1/user/add-song-to-history/${songId}`);
        console.log(response.data.message);
    } catch (error) {
        console.error('Error adding song to history:', error);
        throw error;
    }
}
