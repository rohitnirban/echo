import axios from "axios";

export default async function getSongsSuggestions(songID: string) {
    try {
        const url = `https://saavn-api-sigma.vercel.app/api/songs/${songID}/suggestions`;
        const response = await axios.get(url);

        if (response.data.success === true) {
            const data = response.data.data;
            return data.slice(0, 15)
        } else {
            return null
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return null
        } else {
            return null
        }
    }
}