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
import { IconHeart, IconHeartFilled, IconPlayerPlayFilled } from "@tabler/icons-react";


interface Song {
    id: string;
    name: string;
    artists: { primary: { name: string }[] };
    image: { url: string }[];
    downloadUrl: { url: string }[];
    duration?: number;
}


export default function Queue() {

    const { songID, songName, songArtist, songImageHigh, duration, queue, isPlaying, handlePlayPause, audioRef, setSongDetails, addToQueue } = useMediaPlayer();

    const handlePlay = async (song: Song) => {
        console.log(song);
        if (audioRef.current) {
            if (!song.downloadUrl || !song.image) return null;

            await audioRef.current.pause(); // Pause any currently playing song

            audioRef.current.src = song.downloadUrl[4].url; // Set the new song URL

            const decodedAlbumName = decodeHTMLEntities(song.name);
            setSongDetails(song.id, decodedAlbumName, song.artists.primary[0].name, song.image[0].url, song.image[2].url);
            const similarSongs = await getSongsSuggestions(song.id);
            addToQueue(similarSongs);

            handlePlayPause();
            console.log("Song Played: " + decodedAlbumName);
        }
    };

    function formatTime(seconds: number): string {
        const format = (val: number) => `0${Math.floor(val)}`.slice(-2);
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${format(minutes)}:${format(secs)}`;
    }

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
                    <Library className="cursor-pointer text-white" />
                    <div className="bg-white p-2 rounded-full cursor-pointer">
                        <IconPlayerPlayFilled className="h-14 w-14 text-black" />
                    </div>
                    <IconHeart className="cursor-pointer text-white" />
                </div>
            </div>
            <div className="queue section grid gap-4 md:gap-10 items-start ">
                <Card className="h-[70vh] flex flex-col bg-[#020202] text-white border-none"> {/* Set a fixed height and use flex */}
                    <CardHeader className="font-bold px-7">
                        Up Next
                    </CardHeader>
                    <CardContent className="overflow-y-auto flex-grow"> {/* Add overflow-y-auto and flex-grow */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className=" text-white">Song</TableHead>
                                    <TableHead className="hidden sm:table-cell text-white">Artist</TableHead>
                                    <TableHead className="text-right text-white">Duration</TableHead>
                                    <TableHead className="text-right">
                                        <MenuIcon className="w-5 h-5" />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {queue.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4}>No songs in queue</TableCell>
                                    </TableRow>
                                ) : (
                                    queue.map((song) => (
                                        <TableRow key={song.id} >
                                            <TableCell>
                                                <div className="font-medium" onClick={() => handlePlay(song)}>{decodeHTMLEntities(song.name)}</div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="text-muted-foreground">{song.artists.primary[0]?.name}</div>
                                            </TableCell>
                                            <TableCell className="text-right">{formatTime(song.duration || 0)}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="w-6 h-6">
                                                            <MoveVerticalIcon className="w-5 h-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Move Up</DropdownMenuItem>
                                                        <DropdownMenuItem>Move Down</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>Remove</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between mt-2">
                        <Button size="sm" variant="outline" className="text-black">
                            <ShuffleIcon className="w-4 h-4 mr-2 text-black" />
                            Shuffle
                        </Button>
                        <Button size="sm" variant="outline" className="text-black">
                            <TrashIcon className="w-4 h-4 mr-2 text-black" />
                            Clear Queue
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        </div>
    )
}