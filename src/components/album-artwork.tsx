import Image from "next/image";
import { cn } from "@/lib/utils";
import decodeHTMLEntities from "@/helpers/decodeHTMLEntities";
import { Song, useMediaPlayer } from "@/context/MediaPlayerContext";
import getSongsSuggestions from "@/helpers/getSongsSuggestions";
import { IconPlayerPlayFilled, IconPlayerTrackNextFilled, IconPlaylistAdd, IconShare } from '@tabler/icons-react';
import { HeartIcon, Library, MoreVertical } from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dropdown } from "react-day-picker";
import axios, { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { useEffect, useState } from "react";

export interface Album {
  name: string
  artist: string
  cover: string
  songID: string
}

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: Album;
  width?: number;
  height?: number;
  songUrl?: string;
  image?: string;
}

export function AlbumArtwork({
  album,
  width,
  height,
  className,
  songUrl,
  image,
  ...props
}: AlbumArtworkProps) {
  const { isPlaying, handlePlayPause, audioRef, setSongDetails, addToQueue, addToQueueNext, setIsPlayingState } = useMediaPlayer();

  const decodedAlbumName = decodeHTMLEntities(album.name);
  const { toast } = useToast();

  const handlePlay = async () => {
    if (audioRef.current) {
      if (!songUrl || !image) return null;

      await audioRef.current.pause(); // Pause any currently playing song
      setIsPlayingState(false);

      audioRef.current.src = songUrl; // Set the new song URL

      const decodedAlbumName = decodeHTMLEntities(album.name);
      setSongDetails(album.songID, decodedAlbumName, album.artist, image, album.cover);
      const similarSongs = await getSongsSuggestions(album.songID);
      addToQueue(similarSongs);

      // Play the new song immediately
      try {
        await audioRef.current.play();
        setIsPlayingState(true);
        console.log("Song Played: " + decodedAlbumName);
      } catch (error) {
        console.error("Error playing song:", error);
      }
    }
  };

  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  const checkSongIsInLibrary = async () => {
    try {
      const response = await axios.get(`/api/v1/library/check-library/${album.songID}`);
      setIsInLibrary(response.data.message); // Adjust based on your API response
    } catch (error) {
      console.error("Error checking if song is in library:", error);
    }
  }

  const checkSongIsFavourite = async () => {
    try {
      const response = await axios.get(`/api/v1/favourite/check-favourite/${album.songID}`);
      setIsFavourite(response.data.message); // Adjust based on your API response
    } catch (error) {
      console.error("Error checking if song is favourite:", error);
    }
  }

  const handleToggleLibrary = async (songID: string) => {
    try {
        const endpoint = isInLibrary 
            ? `/api/v1/library/remove-song/${songID}` 
            : `/api/v1/library/add-song/${songID}`;
        const response = await axios.post(endpoint);

        if (response.data.success) { // Check if the response indicates a successful operation
            setIsInLibrary(!isInLibrary);
        }

        toast({
            title: 'Success',
            description: response.data.message
        });
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
            title: "Error",
            description: axiosError.response?.data.message || "Failed to toggle song library status",
            variant: "destructive"
        });
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
      console.log(response.data.message);
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

  useEffect(() => {
    // Reset states when a new song is loaded
    setIsInLibrary(false);
    setIsFavourite(false);

    // Check if the current song is in the library and if it is favorited
    checkSongIsInLibrary();
    checkSongIsFavourite();
  }, [album.songID, audioRef]);

  const handlePlayNext = () => {
    if (!songUrl || !image) return null;

    const song: Song = {
      id: album.songID,
      name: decodedAlbumName,
      artists: { primary: [{ name: album.artist }] },
      image: [{ url: image }],
      downloadUrl: [{ url: songUrl }],
    };

    addToQueueNext(song);
    toast({
      title: 'Success',
      description: `${decodedAlbumName} added to play next`
    });
  };



  return (
    <div className={cn("space-y-3 z-20", className)} {...props}>
      <div className="overflow-hidden rounded-md cursor-pointer relative group">
        <Image
          src={album.cover}
          alt={decodedAlbumName}
          width={width}
          height={height}
          className={cn(
            "h-auto object-cover transition-all aspect-square",
          )}
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconPlayerPlayFilled
            className="w-12 h-12 text-white cursor-pointer"
            onClick={handlePlay}
          />
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <MoreVertical
                  className="w-6 h-6 text-white cursor-pointer hover:bg-gray-800 hover:bg-opacity-50 rounded-full p-1"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#020202] text-white border-none">
                {/* <DropdownMenuItem className="hover:bg-[#1d1d1d]" onClick={handlePlayNext}>
                  <IconPlayerTrackNextFilled className="mr-2 h-4 w-4" />
                  <span>Play Next</span>
                </DropdownMenuItem> */}

                {!isInLibrary ? <DropdownMenuItem className="hover:bg-[#1d1d1d]" onClick={() => handleToggleLibrary(album.songID)}>
                  <Library className="mr-2 h-4 w-4" />
                  <span>Add to Saved</span>
                </DropdownMenuItem>
                  :
                  <DropdownMenuItem className="hover:bg-[#1d1d1d]" onClick={() => handleToggleLibrary(album.songID)}>
                    <Library className="mr-2 h-4 w-4" />
                    <span>Remove from Saved</span>
                  </DropdownMenuItem>
                }
                {!isFavourite ? <DropdownMenuItem className="hover:bg-[#1d1d1d]" onClick={() => handleToggleFavourite(album.songID)}>
                  <HeartIcon className="mr-2 h-4 w-4" />
                  <span>Add to Favourite</span>
                </DropdownMenuItem>
                  :
                  <DropdownMenuItem className="hover:bg-[#1d1d1d]" onClick={() => handleToggleFavourite(album.songID)}>
                    <HeartIcon className="mr-2 h-4 w-4" />
                    <span>Remove from Favourite</span>
                  </DropdownMenuItem>
                }
                {/* <DropdownMenuItem className="hover:bg-[#1d1d1d]">
                  <IconShare className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="space-y-1 text-sm cursor-pointer select-none">
        <h3 className="text-base md:text-lg font-semibold leading-none">{decodedAlbumName}</h3>
        <p className="text-xs md:text-base text-muted-foreground">{album.artist.split(',')[0]}</p>
      </div>
    </div>
  );
}
