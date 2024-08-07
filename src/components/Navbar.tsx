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
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Label } from './ui/label'
import SubscriptionModal from './modals/SubscriptionModal'
import { Table, TableHead, TableHeader, TableRow } from './ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { getUserHistory } from '@/helpers/getUserHistory'
import Image from 'next/image'
import dayjs from 'dayjs'
import { useQuery } from 'react-query'

interface Song {
    id: string;
    name: string;
    artists: { primary: { name: string }[] };
    image: { url: string }[];
    downloadUrl: { url: string }[];
}

interface SongWithHistory {
    id: string;
    name: string;
    artists: { primary: { name: string }[] };
    image: { url: string }[];
    downloadUrl: { url: string }[];
    playedAt: Date
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

    const { data: history, error, isLoading } = useQuery('userHistory', getUserHistory, {
        staleTime: 60000, // Data is considered fresh for 1 minute
        cacheTime: 300000, // Data is cached for 5 minutes
        refetchInterval: 60000, // Refetch data every minute
        refetchOnWindowFocus: true
    });


    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-700 bg-[#020202] px-4 shadow-sm md:px-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden bg-white" onClick={onMenuClick}>
                    <MenuIcon className="h-6 w-6" />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-2.5 top-[12px] h-4 w-4 text-muted-foreground text-white" />
                    <Input
                        type="search"
                        placeholder="Search"
                        className="w-full sm:w-64 md:w-96 lg:w-[30rem] rounded-lg pl-10 pr-4 bg-[#292929] text-white border border-gray-700 placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-gray-600 focus:bg-[#020202]"
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
                                    <img src={songData.image[0].url} alt="" className="w-12 h-12 object-cover" />
                                    <p className="flex flex-col justify-center text-left ml-4">
                                        <span className="truncate">{songData.name}</span>
                                        <span className="text-sm text-gray-400 truncate">{songData.artists.primary.map(artist => artist.name).join(', ')}</span>
                                    </p>
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {session ?
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
                    <DropdownMenuContent align="end" className='w-64 bg-[#1d1d1d] text-white border-none'>
                        <DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='p-2 hover:bg-[#1d1d1d]'>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Link href="/#" className='flex items-center'>
                                        <UserIcon />
                                        <span className='ml-2'>Profile</span>
                                    </Link>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[725px] w-[90vw] max-h-[90vh] overflow-y-auto bg-[#1d1d1d] text-white border-none" onClick={(e) => e.stopPropagation()}>
                                    <DialogHeader>
                                        <DialogTitle className="text-white">Account Settings</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            Manage your account settings and set e-mail preferences.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <Tabs defaultValue="profile" className="w-full h-full text-white">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-grow overflow-hidden">
                                            <div className="md:col-span-1 overflow-y-auto">
                                                <TabsList className="flex flex-row gap-2 md:flex-col w-full h-auto bg-[#1d1d1d]">
                                                    <TabsTrigger value="profile" className="text-white hover:bg-[#4e4e4e] w-full justify-start">Profile</TabsTrigger>
                                                    <TabsTrigger value="music" className="text-white hover:bg-[#4e4e4e] w-full justify-start">Music</TabsTrigger>
                                                    <TabsTrigger value="history" className="text-white hover:bg-[#4e4e4e] w-full justify-start">History</TabsTrigger>
                                                    <TabsTrigger value="notifications" className="text-white hover:bg-[#4e4e4e] w-full justify-start">Notifications</TabsTrigger>
                                                </TabsList>
                                            </div>
                                            <div className="md:col-span-3 overflow-y-auto">
                                                <TabsContent value="profile" className="mt-0 h-96">
                                                    <Card className='bg-[#1d1d1d] text-white border-none h-full flex flex-col'>
                                                        <CardHeader>
                                                            <CardTitle className='text-white'>Profile Information</CardTitle>
                                                            <CardDescription className='text-gray-400'>Update your general account information.</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="space-y-2 flex-grow overflow-y-auto">
                                                            <div className="space-y-1">
                                                                <Label htmlFor="name">Name</Label>
                                                                <Input id="name" defaultValue={session?.user.name || ''} />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label htmlFor="username">Username</Label>
                                                                <Input id="username" defaultValue={session?.user.username || ''} />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Subscription Status</Label>
                                                                <div className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-md">
                                                                    <span>Subscription</span>
                                                                    <div className="flex items-center">
                                                                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                                                        <span className="text-green-500 font-semibold">Active</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </CardContent>
                                                        <CardFooter>
                                                            <Button className='bg-[#6cf61d] text-black hover:bg-[#6cf61d]/70'>Save changes</Button>
                                                        </CardFooter>
                                                    </Card>
                                                </TabsContent>
                                                <TabsContent value="music" className="mt-0 h-96">
                                                    <Card className='bg-[#1d1d1d] text-white border-none h-full flex flex-col'>
                                                        <CardHeader>
                                                            <CardTitle className='text-white'>Music</CardTitle>
                                                            <CardDescription className='text-gray-400'>Change your music settings.</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="space-y-2 flex-grow overflow-y-auto">
                                                            <div className="space-y-1">
                                                                <Select>
                                                                    <SelectTrigger className="w-[180px] bg-[#020202] border-none">
                                                                        <SelectValue defaultValue="high" placeholder="Quality" />
                                                                    </SelectTrigger>
                                                                    <SelectContent defaultValue="high" className='bg-[#020202] text-white border-none'>
                                                                        <SelectItem value="low">Low</SelectItem>
                                                                        <SelectItem value="medium">Medium</SelectItem>
                                                                        <SelectItem value="high">High</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2 flex justify-between items-center">
                                                                <div className='my-6'>
                                                                    <p className='text-lg font-semibold'>Music Recommendation</p>
                                                                    <p className='text-gray-400 text-sm'>Recommend music based on your choice and history</p>
                                                                </div>
                                                                <Switch defaultChecked={true} />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </TabsContent>
                                                <TabsContent value="history" className="mt-0 h-96">
                                                    <Card className='bg-[#1d1d1d] text-white border-none h-full flex flex-col'>
                                                        <CardHeader>
                                                            <CardTitle className='text-white'>History</CardTitle>
                                                            <CardDescription className='text-gray-400'>See what your last 10 songs you listend.</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="space-y-2 flex-grow overflow-y-auto">
                                                            {history?.map((song, index) => {
                                                                return (
                                                                    <div className="space-y-2 p-2" key={index}>
                                                                        <Link
                                                                            href="#"
                                                                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1d1d1d] hover:text-white transition-colors"
                                                                            prefetch={false}
                                                                        >
                                                                            <Image
                                                                                src={song.image[0].url}
                                                                                alt="Album Cover"
                                                                                width={40}
                                                                                height={40}
                                                                                className="rounded-md"
                                                                                style={{ aspectRatio: "40/40", objectFit: "cover" }}
                                                                            />
                                                                            <div className="flex-1">
                                                                                <div className="font-medium line-clamp-1">{song.name}</div>
                                                                                <div className="text-xs text-muted-foreground line-clamp-1">
                                                                                    {song?.artists?.primary?.[0]?.name || 'Unknown Artist'}
                                                                                </div>
                                                                            </div>
                                                                            <div className='text-gray-200 text-sm flex flex-col justify-center items-center'>
                                                                                <p>{dayjs(song.playedAt).format('MMM D, YYYY')}</p>
                                                                                <p>{dayjs(song.playedAt).format('hh:mm A')}</p>
                                                                            </div>
                                                                        </Link>
                                                                    </div>
                                                                )
                                                            })
                                                            }
                                                        </CardContent>
                                                    </Card>
                                                </TabsContent>
                                                <TabsContent value="notifications" className="mt-0 h-96">
                                                    <Card className='bg-[#1d1d1d] text-white border-none h-full flex flex-col'>
                                                        <CardHeader>
                                                            <CardTitle className='text-white'>Notifications</CardTitle>
                                                            <CardDescription className='text-gray-400'>Manage your notification preferences.</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="space-y-2 flex-grow overflow-y-auto">
                                                            {/* Add notification settings here */}
                                                        </CardContent>
                                                        <CardFooter>
                                                            <Button className='bg-[#6cf61d] text-black hover:bg-[#6cf61d]/70'>Save preferences</Button>
                                                        </CardFooter>
                                                    </Card>
                                                </TabsContent>
                                            </div>
                                        </div>
                                    </Tabs>
                                </DialogContent>
                            </Dialog>
                        </DropdownMenuItem>

                        <DropdownMenuItem className='p-2 hover:bg-[#1d1d1d]'>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Link href="/#" className='flex items-center'>
                                        <CreditCardIcon />
                                        <span className='ml-2'>Subscription</span>
                                    </Link>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[725px] w-[90vw] max-h-[90vh] overflow-y-auto bg-[#1d1d1d] text-white border-none" onClick={(e) => e.stopPropagation()}>
                                    <DialogHeader>
                                        <DialogTitle className="text-white">Subscription</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            Get your echo subscription for a month
                                        </DialogDescription>
                                    </DialogHeader>
                                    <SubscriptionModal />
                                </DialogContent>
                            </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='cursor-pointer' onClick={() => signOut()}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                :
                <Button className="bg-[#6cf61d] text-black hover:bg-[#6cf61d]/70 " onClick={() => signIn("google")}>Login</Button>
            }
        </header>
    )
}

export default Navbar
