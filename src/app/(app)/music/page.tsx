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

const fetchLatestSongsFromSavaan = async () => {
  const response = await axios.get(
    'https://saavn-api-sigma.vercel.app/api/search/songs?query=latest'
  );

  const data = response.data.data.results;

  return data
};

const fetchTopSongsFromSavaan = async () => {
  const response = await axios.get(
    'https://saavn-api-sigma.vercel.app/api/search/songs?query=sumit goswami'
  );

  const data = response.data.data.results;

  return data
};

export default function MusicPage() {
  const { songID, isPlaying } = useMediaPlayer();

  const { data: latestSongResult = [], isLoading: isLatestSongsLoading, error: latestSongsError } = useQuery(
    'latestSongsFromSavaan',
    fetchLatestSongsFromSavaan,
    {
      cacheTime: 24 * 60 * 60 * 1000,
      staleTime: 24 * 60 * 60 * 1000,
    }
  );

  const { data: topSongResult = [], isLoading: isTopSongsLoading, error: topSongsError } = useQuery(
    'topSongsFromSavaan',
    fetchTopSongsFromSavaan,
    {
      cacheTime: 24 * 60 * 60 * 1000,
      staleTime: 24 * 60 * 60 * 1000,
    }
  );

  console.log('Song Result:', latestSongResult);

  if (latestSongsError) {
    console.error('Error fetching songs:', latestSongsError);
    return <p>Error loading songs. Please try again later.</p>;
  }

  if (isLatestSongsLoading) {
    return <p>Loading...</p>;
  }

  if (!latestSongResult || latestSongResult.length === 0) {
    return <p>No songs found</p>;
  }


  return (
    <>
      <div className="col-span-3 lg:col-span-4">
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
                    {latestSongResult.map((song: SongData) => (
                      <div key={song.id} className="flex flex-col space-y-2">
                        <AlbumArtwork
                          album={{
                            songID: song.id,
                            cover: song.image[1]?.url,
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
            <TabsContent
              value="music"
              className="border-none p-0 outline-none"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Sumit Goswami
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Sumit Goswami songs
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="relative">
                <ScrollArea>
                  <div className="flex space-x-4 pb-4">
                    {topSongResult.map((song: SongData) => (
                      <div key={song.id} className="flex flex-col space-y-2">
                        <AlbumArtwork
                          album={{
                            songID: song.id,
                            cover: song.image[1]?.url,
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
      </div >
    </>
  );
}
