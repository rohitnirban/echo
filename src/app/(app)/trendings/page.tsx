'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { AlbumArtwork } from "@/components/album-artwork";
import { useMediaPlayer } from "@/context/MediaPlayerContext";
import { useQuery } from 'react-query';
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from 'react';
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";

interface SongData {
  id: string;
  name: string;
  year: string;
  artists: { primary: Artist[] };
  image: { url: string }[];
  downloadUrl: { url: string }[];
}

interface Artist {
  name: string;
}

const fetchTrendingSongs = async () => {
  const response = await axios.get('/api/v1/trending/get-today/30');
  return response.data.titles;
};

const fetchSongsFromSavaan = async (trendingSongs: string[]) => {
  const currentYear = new Date().getFullYear().toString();
  const promises = trendingSongs.map(songQuery =>
    axios.get(`https://saavn-api-sigma.vercel.app/api/search/songs?query=${encodeURIComponent(songQuery)}&page=1&limit=1`)
  );

  const responses = await Promise.all(promises);

  const allSongs = responses.flatMap(response => {
    if (response.data.success === true) {
      return response.data.data.results.filter((song: SongData) => song.year === currentYear);
    }
    return [];
  });

  return allSongs.slice(0, 30)
};


const AlbumArtworkSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-[200px] w-[200px] rounded-md" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-[100px]" />
    </div>
  </div>
);

export default function Page() {
  const { songID, isPlaying } = useMediaPlayer();

  const { data: trendingSongs = [], isLoading: isTrendingLoading } = useQuery(
    'trendingSongs',
    fetchTrendingSongs,
    {
      cacheTime: 24 * 60 * 60 * 1000,
      staleTime: 24 * 60 * 60 * 1000,
    }
  );

  const { data: songResult = [], isLoading: isSongsLoading } = useQuery(
    ['songsFromSavaan', trendingSongs],
    () => fetchSongsFromSavaan(trendingSongs),
    {
      enabled: !!trendingSongs.length,
      cacheTime: 24 * 60 * 60 * 1000,
      staleTime: 24 * 60 * 60 * 1000,
    }
  );

  const isLoading = isTrendingLoading || isSongsLoading;

  const skeletons = useMemo(() =>
    Array.from({ length: 10 }).map((_, index) => (
      <div key={index} className="flex justify-center">
        <AlbumArtworkSkeleton />
      </div>
    )),
    []
  );

  const songItems = useMemo(() =>
    songResult.map((song, index) => {
      return (
        <div key={`${song.id}-${index}`} className="flex justify-center">
          <AlbumArtwork
            album={{
              songID: song.id,
              cover: song.image[2]?.url,
              name: song.name,
              artist: song.artists.primary.map((artist: any) => artist.name).join(", ")
            }}
            image={song.image[0]?.url}
            songUrl={song.downloadUrl[4]?.url}
            className="w-[200px]"
            width={200}
            height={200}
          />
        </div>
      );
    }),
    [songResult]
  );

  return (
    <ScrollArea className="h-full flex flex-col flex-1">
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Trending Right Now</h1>
            <p className='text-muted-foreground'>
             Top 30 Songs which are currently pouplar, may change daily
            </p>
          </div>
          <div className="bg-black p-2 rounded-full">
            <IconPlayerPlayFilled className="text-white" />
          </div>
        </div>
        <Separator className='my-4 shadow' />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isLoading ? skeletons : songItems}
        </div>
      </main >
    </ScrollArea >
  )
}
