import { Library, MenuIcon, MoreVertical, SearchIcon } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { useMediaPlayer } from "@/context/MediaPlayerContext";
import decodeHTMLEntities from "@/helpers/decodeHTMLEntities";
import getSongsSuggestions from "@/helpers/getSongsSuggestions";
import { signOut, useSession } from 'next-auth/react'
import { IconPlayerTrackNextFilled, IconPlaylistAdd, IconShare } from '@tabler/icons-react'

interface Song {
    id: string;
    name: string;
    artists: { primary: { name: string }[] };
    image: { url: string }[];
    downloadUrl: { url: string }[];
}

interface NavbarProps {
    onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {

    const { data: session } = useSession();

    const { audioRef, setSongDetails, addToQueue, handlePlayPause } = useMediaPlayer();

    const [songQuery, setSongQuery] = useState('');
    const [songResult, setSongResult] = useState<Song[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getSong = async () => {
        if (songQuery.length >= 3) {
            try {
                const response = await axios.get(`https://saavn-api-sigma.vercel.app/api/search/songs?query=${songQuery}&page=1&limit=10`);
                if (response.data.success === true) {
                    setSongResult(response.data.data.results);
                    setIsDropdownOpen(true);
                } else {
                    setSongResult([]);
                    setIsDropdownOpen(false);
                }
            } catch (error) {
                console.error("Error fetching songs:", error);
                setSongResult([]);
                setIsDropdownOpen(false);
            }
        } else {
            setSongResult([]);
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        getSong();
    }, [songQuery]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handlePlay = async (song: Song) => {
        if (audioRef.current) {
            if (!song.downloadUrl || !song.image) return null;

            await audioRef.current.pause(); // Pause any currently playing song

            audioRef.current.src = song.downloadUrl[4].url; // Set the new song URL

            const decodedAlbumName = decodeHTMLEntities(song.name);
            setSongDetails(song.id, decodedAlbumName, song.artists.primary[0].name, song.image[0].url, song.image[2].url);
            const similarSongs = await getSongsSuggestions(song.id);
            addToQueue(similarSongs);

            handlePlayPause(); // Update the play/pause state
            // audioRef.current.play(); // Play the new song immediately
            console.log("Song Played: " + decodedAlbumName);
        }
    };

    if (session) {
        return (
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm md:px-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                        <MenuIcon className="h-6 w-6" />
                        <span className="sr-only">Toggle Sidebar</span>
                    </Button>
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search"
                            className="w-64 sm:w-96 lg:w-[30rem] rounded-lg border-none outline-none bg-muted pl-8 pr-4 focus:bg-muted"
                            value={songQuery}
                            onChange={(e) => setSongQuery(e.target.value)}
                        />
                        {isDropdownOpen && (
                            <div ref={dropdownRef} className="absolute top-full mt-2 w-full bg-white shadow-lg z-50 overflow-auto max-h-96">
                                {songResult.map((songData, index) => (
                                    <p key={index} onClick={() => handlePlay(songData)} className="text-left flex items-center p-2 hover:bg-black hover:text-white hover:cursor-pointer">
                                        <img src={songData.image[0].url} alt="" />
                                        <p className="flex flex-col justify-center text-left ml-4">
                                            <span>{songData.name}</span>
                                            <span>{songData.artists.primary.map(artist => artist.name).join(', ')}</span>
                                        </p>
                                        {/* <div className="absolute top-2 right-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="focus:outline-none">
                                                    <MoreVertical
                                                        className="w-6 h-6 text-white cursor-pointer hover:bg-gray-800 hover:bg-opacity-50 rounded-full p-1"
                                                    />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        <IconPlayerTrackNextFilled className="mr-2 h-4 w-4" />
                                                        <span>Play Next</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Library className="mr-2 h-4 w-4" />
                                                        <span>Add to Library</span>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem>
                                                        <IconPlaylistAdd className="mr-2 h-4 w-4" />
                                                        <span>Add to Playlist</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <IconShare className="mr-2 h-4 w-4" />
                                                        <span>Share</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div> */}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="overflow-hidden rounded-full">
                            <img src={session.user.image} width={36} height={36} alt="Avatar" className="rounded-full" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{session.user.username}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
        )
    }
}

export default Navbar