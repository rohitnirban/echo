"use client"

import { Button } from "@/components/ui/button";
import { useMediaPlayer } from "@/context/MediaPlayerContext";
import decodeHTMLEntities from "@/helpers/decodeHTMLEntities";
import getSongsSuggestions from "@/helpers/getSongsSuggestions";

interface Song {
    id: string;
    name: string;
    artists: { primary: { name: string }[] };
    image: { url: string }[];
    downloadUrl: { url: string }[];
}

export default function Queue() {
    const { queue, isPlaying, handlePlayPause, audioRef, setSongDetails, addToQueue } = useMediaPlayer();

    const handlePlay = async (song: Song) => {
        console.log(song);
        if (audioRef.current) {
            if (!song.downloadUrl || !song.image) return null;
            
            await audioRef.current.pause(); // Pause any currently playing song
            
            audioRef.current.src = song.downloadUrl[4].url; // Set the new song URL
            
            const decodedAlbumName = decodeHTMLEntities(song.name);
            setSongDetails(song.id, decodedAlbumName, song.artists.primary[0].name, song.image[0].url);
            const similarSongs = await getSongsSuggestions(song.id);
            addToQueue(similarSongs);
            
            handlePlayPause(); // Update the play/pause state
            // audioRef.current.play(); // Play the new song immediately
            console.log("Song Played: " + decodedAlbumName);
        }
    };


    return (
        <div className="bg-gray-100 text-foreground p-6 overflow-auto max-h-[80vh] w-[78vw]">
            <h2 className="text-2xl font-bold mb-4">Songs Queue</h2>
            <div className="space-y-2">
                {queue.length === 0 ? (
                    <div>No songs in queue</div>
                ) : (
                    queue.map((song) => (
                        <div key={song.id} className="bg-muted p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="mr-4 cursor-move" />
                                <div>
                                    <div className="font-medium">{decodeHTMLEntities(song.name)}</div>
                                    {/* <div className="text-sm text-muted-foreground">{song.artists.primary[0].name}</div> */}
                                </div>
                            </div>
                            <Button onClick={() => handlePlay(song)}>Play</Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
