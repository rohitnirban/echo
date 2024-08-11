"use client"

import { Button } from "@/components/ui/button";
import { useMediaPlayer } from "@/context/MediaPlayerContext";
import decodeHTMLEntities from "@/helpers/decodeHTMLEntities";
import getSongsSuggestions from "@/helpers/getSongsSuggestions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { HeartIcon, Library, MenuIcon, MoveVerticalIcon, PauseIcon, PlayIcon, ShuffleIcon, TrashIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { IconHeart, IconHeartFilled, IconPlayerPauseFilled, IconPlayerPlayFilled, IconLibraryPlus, IconLibraryMinus } from "@tabler/icons-react";
import { formatTimeDuration } from "@/helpers/formatTimeDuration";
import { useToast } from "./ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useEffect, useState } from "react";

interface Song {
    id: string;
    name: string;
    artists: { primary: { name: string }[] };
    image: { url: string }[];
    downloadUrl: { url: string }[];
    duration?: number;
}

export default function Queue() {
    const { songID, songName, songArtist, songImageHigh, duration, queue, isPlaying, handlePlayPause, audioRef, setSongDetails, addToQueue, clearQueue } = useMediaPlayer();

    const { toast } = useToast();

    const handlePlay = async (song: Song) => {
        if (audioRef.current) {
            if (!song.downloadUrl || !song.image) return null;

            await audioRef.current.pause(); // Pause any currently playing song
            audioRef.current.src = song.downloadUrl[4].url; // Set the new song URL

            const decodedAlbumName = decodeHTMLEntities(song.name);
            setSongDetails(song.id, decodedAlbumName, song.artists.primary[0].name, song.image[0].url, song.image[2].url);
            const similarSongs = await getSongsSuggestions(song.id);
            addToQueue(similarSongs);

            // Play the new song immediately
            try {
                await audioRef.current.play();
                console.log("Song Played: " + decodedAlbumName);
            } catch (error) {
                console.error("Error playing song:", error);
            }
        }
    };

    const handleToggleLibrary = async (songID: string) => {
        try {
            const endpoint = isInLibrary ? `/api/v1/library/remove-song/${songID}` : `/api/v1/library/add-song/${songID}`;
            const response = await axios.post(endpoint);
            toast({
                title: 'Success',
                description: response.data.message
            });
            setIsInLibrary(!isInLibrary);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            console.log(axiosError);
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to toggle song library status",
                variant: "destructive"
            })
        }
    }

    const handleToggleFavourite = async (songID: string) => {
        try {
            const endpoint = isFavourite ? `/api/v1/favourite/remove-song/${songID}` : `/api/v1/favourite/add-song/${songID}`;
            const response = await axios.post(endpoint);
            toast({
                title: 'Success',
                description: response.data.message
            });
            setIsFavourite(!isFavourite);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            console.log(axiosError);
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to toggle song favourite status",
                variant: "destructive"
            })
        }
    }

    const checkSongIsInLibrary = async () => {
        try {
            const response = await axios.get(`/api/v1/library/check-library/${songID}`);
            setIsInLibrary(response.data.message); // Adjust based on your API response
        } catch (error) {
            console.error("Error checking if song is in library:", error);
        }
    }

    const checkSongIsFavourite = async () => {
        try {
            const response = await axios.get(`/api/v1/favourite/check-favourite/${songID}`);
            setIsFavourite(response.data.message); // Adjust based on your API response
        } catch (error) {
            console.error("Error checking if song is favourite:", error);
        }
    }

    useEffect(() => {
        // Reset states when a new song is loaded
        setIsInLibrary(false);
        setIsFavourite(false);

        // Check if the current song is in the library and if it is favorited
        checkSongIsInLibrary();
        checkSongIsFavourite();
    }, [songID, audioRef]);

    const [isInLibrary, setIsInLibrary] = useState(false);
    const [isFavourite, setIsFavourite] = useState(false);

    const handleClearQueue = () => {
        clearQueue();
    };

    return (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-center max-w-7xl px-4 mx-auto py-6 bg-[#020202] h-[80vh]">
            <div className="grid gap-4 md:gap-6 items-start">
                <div className="grid gap-4 mx-auto">
                    <img
                        src={songImageHigh}
                        alt="Album Cover"
                        width={400}
                        height={400}
                        className="aspect-square object-cover border rounded-lg overflow-hidden"
                    />
                </div>
                <div className="flex justify-center items-center gap-7">
                    {isInLibrary
                        ? <IconLibraryMinus className="cursor-pointer text-white" onClick={() => handleToggleLibrary(songID)} />
                        : <IconLibraryPlus className="cursor-pointer text-white" onClick={() => handleToggleLibrary(songID)} />}
                    <div className="bg-white p-2 rounded-full cursor-pointer" onClick={handlePlayPause}>
                        {isPlaying ? <IconPlayerPauseFilled className="h-14 w-14 text-black" /> : <IconPlayerPlayFilled className="h-14 w-14 text-black" />}
                    </div>
                    {isFavourite
                        ? <IconHeartFilled className="cursor-pointer text-white" onClick={() => handleToggleFavourite(songID)} />
                        : <IconHeart className="cursor-pointer text-white" onClick={() => handleToggleFavourite(songID)} />}
                </div>
            </div>
            <div className="queue section grid gap-4 md:gap-10 items-start ">
                <Card className="h-[70vh] flex flex-col bg-[#020202] text-white border-none">
                    <CardHeader className="text-2xl font-bold px-7">
                        Up Next
                    </CardHeader>
                    <CardContent className="overflow-y-auto flex-grow">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-white">Song</TableHead>
                                    <TableHead className="hidden sm:table-cell text-white">Artist</TableHead>
                                    <TableHead className="text-right text-white">Duration</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {queue.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4}>No songs in queue</TableCell>
                                    </TableRow>
                                ) : (
                                    queue.map((song) => (
                                        <TableRow key={song.id}>
                                            <TableCell>
                                                <div className="font-medium cursor-pointer" onClick={() => handlePlay(song)}>{decodeHTMLEntities(song.name)}</div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="text-gray-300">{song.artists.primary[0]?.name}</div>
                                            </TableCell>
                                            <TableCell className="text-right">{formatTimeDuration(song.duration || 0)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between mt-2">
                        <Button size="sm" variant="outline" className="text-black" onClick={handleClearQueue}>
                            <TrashIcon className="w-4 h-4 mr-2 text-black" />
                            Clear Queue
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
