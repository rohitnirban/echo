import Image from "next/image";
import { cn } from "@/lib/utils";
import decodeHTMLEntities from "@/helpers/decodeHTMLEntities";
import { useMediaPlayer } from "@/context/MediaPlayerContext";
import getSongsSuggestions from "@/helpers/getSongsSuggestions";
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { MoreVertical } from "lucide-react";

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

  const handlePlay = async () => {
    if (audioRef.current) {
      console.log("First", audioRef.current.src);
      if (!songUrl || !image) return null;
      
      if (isPlaying) {
        audioRef.current.pause();
      }

      audioRef.current.src = songUrl;
      console.log("Second", audioRef.current.src);
      setSongDetails(album.songID, decodedAlbumName, album.artist, image);
      const similarSongs = await getSongsSuggestions(album.songID);
      addToQueue(similarSongs)
      handlePlayPause();
    }
    console.log("Song Played: " + decodedAlbumName);
  };




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
          <div className="absolute top-1 right-1 hover:bg-gray-900 hover:bg-opacity-60 p-1 rounded-full">
            <MoreVertical
              className="w-6 h-6 text-white cursor-pointer"
              onClick={handlePlay}
            />
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
