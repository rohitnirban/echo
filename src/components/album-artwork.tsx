import Image from "next/image";
import { cn } from "@/lib/utils";
import decodeHTMLEntities from "@/helpers/decodeHTMLEntities";
import { useMediaPlayer } from "@/context/MediaPlayerContext";
import getSongsSuggestions from "@/helpers/getSongsSuggestions";
import { IconPlayerPlayFilled, IconPlayerTrackNextFilled, IconPlaylistAdd, IconShare } from '@tabler/icons-react';
import { Library, MoreVertical } from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dropdown } from "react-day-picker";
import axios, { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";

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
  const { isPlaying, handlePlayPause, audioRef, setSongDetails, addToQueue } = useMediaPlayer();

  const decodedAlbumName = decodeHTMLEntities(album.name);
  const { toast } = useToast();

  const handlePlay = async () => {
    if (audioRef.current) {
      console.log("First", audioRef.current.src);
      if (!songUrl || !image) return null;

      if (isPlaying) {
        audioRef.current.pause();
      }

      audioRef.current.src = songUrl;
      console.log("Second", audioRef.current.src);
      setSongDetails(album.songID, decodedAlbumName, album.artist, image, album.cover);
      const similarSongs = await getSongsSuggestions(album.songID);
      addToQueue(similarSongs)
      handlePlayPause();
    }
    console.log("Song Played: " + decodedAlbumName);
  };

  const handleAddToLibrary = async (songID: string) => {
    try {
      const response = await axios.post(`/api/v1/library/add-song/${songID}`);
      toast({
        title: 'Success',
        description: response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to add song to libaray",
        variant: "destructive"
      })
    }

  }




  return (
    <div className={cn("space-y-3", className)} {...props}>
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
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <IconPlayerTrackNextFilled className="mr-2 h-4 w-4" />
                  <span>Play Next</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddToLibrary(album.songID)}>
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
          </div>
        </div>
      </div>
      <div className="space-y-1 text-sm cursor-pointer select-none">
        <h3 className="text-lg font-medium leading-none">{decodedAlbumName}</h3>
        <p className="text-base text-muted-foreground">{album.artist.split(',')[0]}</p>
      </div>
    </div>
  );
}
