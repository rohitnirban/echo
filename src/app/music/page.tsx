'use client';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AlbumArtwork } from "@/components/album-artwork";
import MediaPlayer from "@/components/media-player";
import { useMediaPlayer } from "@/context/MediaPlayerContext";
import { useQuery } from 'react-query';
import axios from 'axios';

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
  const response = await axios.get('/api/v1/trending/get-today/10');
  return response.data.titles;
};

const fetchSongsFromSavaan = async (trendingSongs: string[]) => {
  const currentYear = new Date().getFullYear().toString();
  const allSongs: SongData[] = [];

  for (const songQuery of trendingSongs) {
    const response = await axios.get(
      `https://saavn-api-sigma.vercel.app/api/search/songs?query=${encodeURIComponent(songQuery)}&page=1&limit=2`
    );

    if (response.data.success === true) {
      const filteredSongs = response.data.data.results.filter(
        (song: SongData) => song.year === currentYear
      );
      allSongs.push(...filteredSongs);
    }
  }
  return allSongs;
};

export default function MusicPage() {
  const { songID, isPlaying } = useMediaPlayer();

  // Fetch trending songs with cache time and stale time set to 24 hours
  const { data: trendingSongs = [], isLoading: isTrendingLoading } = useQuery(
    'trendingSongs',
    fetchTrendingSongs,
    {
      cacheTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      staleTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    }
  );

  // Fetch songs from Savaan if trendingSongs is available
  const { data: songResult = [], isLoading: isSongsLoading } = useQuery(
    ['songsFromSavaan', trendingSongs],
    () => fetchSongsFromSavaan(trendingSongs),
    {
      enabled: !!trendingSongs.length, // Only fetch if there are trending songs
      cacheTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      staleTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    }
  );

  if (isTrendingLoading || isSongsLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="col-span-3 lg:col-span-4 lg:border-l">
        <div className="h-full px-4 py-6 lg:px-8">
          <Tabs defaultValue="music" className="h-full space-y-6">
            <TabsContent
              value="music"
              className="border-none p-0 outline-none"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Listen Now
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Top picks for you. Updated daily.
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="relative">
                <ScrollArea>
                  <div className="flex space-x-4 pb-4">
                    {songResult.map((song) => (
                      <div key={song.id} className="flex flex-col space-y-2">
                        <AlbumArtwork
                          album={{
                            songID: song.id,
                            cover: song.image[1]?.url, // Assuming the first image is the album cover
                            name: song.name,
                            artist: song.artists.primary.map((artist) => artist.name).join(", ")
                          }}
                          image={song.image[0]?.url}
                          songUrl={song.downloadUrl[4]?.url}
                          className="w-[150px]"
                          width={150}
                          height={150}
                        />
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
