import Link from "next/link"
import { CompassIcon, FlameIcon, HeartIcon, HomeIcon, LibraryIcon, Music2Icon, XIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getUserHistory } from "@/helpers/getUserHistory";
import { useMediaPlayer } from "@/context/MediaPlayerContext";
import decodeHTMLEntities from "@/helpers/decodeHTMLEntities";
import getSongsSuggestions from "@/helpers/getSongsSuggestions";
import { useQuery } from "react-query";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SongWithHistory {
  id: string;
  name: string;
  artists: { primary: { name: string }[] };
  image: { url: string }[];
  downloadUrl: { url: string }[];
  playedAt: Date
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {

  const { data: session } = useSession();

  const { audioRef, setSongDetails, addToQueue, handlePlayPause } = useMediaPlayer();


  const { data: history, error, isLoading } = useQuery('userHistorySidebar', getUserHistory, {
    staleTime: 60000, // Data is considered fresh for 1 minute
    cacheTime: 300000, // Data is cached for 5 minutes
    refetchInterval: 60000, // Refetch data every minute
    refetchOnWindowFocus: true
  });


  const handlePlay = async (song: SongWithHistory) => {
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
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#020202] text-white text-foreground border-r border-gray-700 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 overflow-y-auto`}>
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
          <Image src="/logo-without-bg.svg" alt="Logo" height={45} width={45} className="rounded-full h-18 w-18" />
          <span className="text-2xl font-bold">Echo</span>
        </Link>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
          <XIcon className="h-6 w-6" />
        </Button>
      </div>
      <Separator />
      <nav className="flex-1 space-y-2 overflow-y-auto px-2 py-2">
        <Link
          href="/music"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[#1d1d1d] hover:text-white font-semibold"
          prefetch={false}
        >
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/trendings"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[#1d1d1d] hover:text-white font-semibold"
          prefetch={false}
        >
          <FlameIcon className="h-5 w-5" />
          <span>Trending</span>
        </Link>
        <Link
          href="/library"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[#1d1d1d] hover:text-white font-semibold"
          prefetch={false}
        >
          <LibraryIcon className="h-5 w-5" />
          <span>Saved</span>
        </Link>
        <Link
          href="/favourite"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[#1d1d1d] hover:text-white font-semibold"
          prefetch={false}
        >
          <HeartIcon className="h-5 w-5" />
          <span>Favourite</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[#1d1d1d] hover:text-white font-semibold"
          prefetch={false}
        >
          <Music2Icon className="h-5 w-5" />
          <span>For You</span>
        </Link>
      </nav>
      <div className="my-4">
        {session && history !== undefined ?
          <div className="space-y-2">
            <div className="px-3 text-xs font-medium text-muted-foreground">Recently Played</div>
            <div className="space-y-2 p-2">
              {history.slice(0, 3)?.map((song, index) => {
                return (
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1d1d1d] hover:text-white transition-colors"
                    prefetch={false}
                    key={index}
                    onClick={() => handlePlay(song)}
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
                  </Link>
                )
              })
              }
            </div>
          </div>
          :
          <p className="sr-only">No History Found</p>
        }
      </div>
    </div >
  )
}

export default Sidebar