import { CreditCardIcon, MenuIcon, SearchIcon, Settings, UserIcon } from 'lucide-react'
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
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

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

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-700 bg-[#020202] px-4 shadow-sm md:px-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
                    <MenuIcon className="h-6 w-6" />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-2.5 top-[12px] h-4 w-4 text-muted-foreground text-white" />
                    <Input
                        type="search"
                        placeholder="Search"
                        className="w-64 sm:w-96 lg:w-[30rem] rounded-lg pl-10 pr-4 bg-[#292929] text-white border border-gray-700 placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-gray-600 focus:bg-[#020202]"
                        style={{
                            outline: 'none !important',
                            boxShadow: 'none !important',
                        }}
                        value={songQuery}
                        onChange={(e) => setSongQuery(e.target.value)}
                    />

                    {isDropdownOpen && (
                        <div ref={dropdownRef} className="absolute top-full mt-2 w-full bg-[#020202] text-white shadow-lg z-50 overflow-auto max-h-96">
                            {songResult.map((songData, index) => (
                                <p key={index} onClick={() => handlePlay(songData)} className="text-left flex items-center p-2 hover:bg-black hover:text-white hover:cursor-pointer">
                                    <img src={songData.image[0].url} alt="" />
                                    <p className="flex flex-col justify-center text-left ml-4">
                                        <span>{songData.name}</span>
                                        <span>{songData.artists.primary.map(artist => artist.name).join(', ')}</span>
                                    </p>
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="overflow-hidden rounded-full">
                        <Avatar>
                            <AvatarImage src={session?.user.image} alt={session?.user.username} />
                            <AvatarFallback>{session?.user.name}</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className='w-64 bg-[#020202] text-white border-none'>
                    <DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='p-2 hover:bg-[#1d1d1d]'>
                        <Link href="/#" className='flex items-center'>
                            <UserIcon />
                            <span className='ml-2'>Account</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='p-2 hover:bg-[#1d1d1d]'>
                        <Link href="/subscription" className='flex items-center'>
                            <CreditCardIcon />
                            <span className='ml-2'>Subscription</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='p-2 hover:bg-[#1d1d1d]'>
                        <Link href="/#" className='flex items-center'>
                            <Settings />
                            <span className='ml-2'>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}

export default Navbar