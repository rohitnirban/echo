'use client';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlbumArtwork } from "@/components/album-artwork";
import { Song, useMediaPlayer } from "@/context/MediaPlayerContext";
import { useQuery } from 'react-query';
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";


const fetchLatestSongsFromSavaan = async () => {
  const response = await axios.get(
    'https://saavn-api-sigma.vercel.app/api/search/songs?query=latest'
  );

  const data = response.data.data.results;

  return data
};

const fetchTopSongsFromSavaan = async (query: string) => {
  const response = await axios.get(
    `https://saavn-api-sigma.vercel.app/api/search/songs?query=${query}`
  );

  const data = response.data.data.results;

  return data
};


const AlbumArtworkSkeleton = () => (
  <div className="space-y-3 w-[150px]">
    <Skeleton className="h-[150px] w-[150px] rounded-md bg-gray-700" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[75%] bg-gray-700" />
      <Skeleton className="h-4 w-[50%] bg-gray-700" />
    </div>
  </div>
);

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

  const { data: relaxSongResult = [], isLoading: isRelaxSongsLoading, error: relaxSongsError } = useQuery(
    'relaxSongsFromSavaan',
    () => fetchTopSongsFromSavaan('relax'),
    {
      cacheTime: 24 * 60 * 60 * 1000,
      staleTime: 24 * 60 * 60 * 1000,
    }
  );

  const { data: focusSongResult = [], isLoading: isFocusSongsLoading, error: focusSongsError } = useQuery(
    'focusSongsFromSavaan',
    () => fetchTopSongsFromSavaan('focus'),
    {
      cacheTime: 24 * 60 * 60 * 1000,
      staleTime: 24 * 60 * 60 * 1000,
    }
  );

  const { data: workoutSongResult = [], isLoading: isWorkoutSongsLoading, error: workoutSongsError } = useQuery(
    'workoutSongsFromSavaan',
    () => fetchTopSongsFromSavaan('workout'),
    {
      cacheTime: 24 * 60 * 60 * 1000,
      staleTime: 24 * 60 * 60 * 1000,
    }
  );

  const { data: energySongResult = [], isLoading: isEnergySongsLoading, error: energySongsError } = useQuery(
    'energySongsFromSavaan',
    () => fetchTopSongsFromSavaan('energy'),
    {
      cacheTime: 24 * 60 * 60 * 1000,
      staleTime: 24 * 60 * 60 * 1000,
    }
  );


  const skeletons = useMemo(() =>
    Array.from({ length: 10 }).map((_, index) => (
      <AlbumArtworkSkeleton key={index} />
    )),
    []
  );

  if (latestSongsError || workoutSongsError || relaxSongsError || focusSongsError || energySongsError) {
    console.error('Error fetching songs:', latestSongsError || workoutSongsError || relaxSongsError || focusSongsError || energySongsError);
    return <p>Error loading songs. Please try again later.</p>;
  }

  return (
    <>
      <div className="col-span-3 lg:col-span-4">
        <div className="h-full px-4 py-6 lg:px-8">
          <Tabs defaultValue="music" className=" h-full space-y-6">
            <TabsList className=" bg-[#020202] flex justify-around items-center">
              <TabsTrigger className="text-white bg-[#020202] z-20" value="music">Music</TabsTrigger>
              <TabsTrigger className="text-white bg-[#020202] z-20" value="workout">Workout</TabsTrigger>
              <TabsTrigger className="text-white bg-[#020202] z-20" value="relax">Relax</TabsTrigger>
              <TabsTrigger className="text-white bg-[#020202] z-20" value="focus">Focus</TabsTrigger>
              <TabsTrigger className="text-white bg-[#020202] z-20" value="energy">Energy</TabsTrigger>
            </TabsList>
            <TabsContent
              value="music"
              className="border-none p-0 outline-none"
            >
              <div>
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
                      {isLatestSongsLoading ? skeletons : (
                        latestSongResult.map((song: Song) => (
                          <div key={song.id} className="flex flex-col space-y-2">
                            <AlbumArtwork
                              album={{
                                songID: song.id,
                                cover: song.image[2]?.url,
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
                        ))
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="workout"
              className="border-none p-0 outline-none"
            >
              <div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Workout Songs
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Songs which helps you get more muscles
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="relative">
                    <ScrollArea>
                      <div className="flex space-x-4 pb-4">
                        {isWorkoutSongsLoading ? skeletons : (
                          workoutSongResult.map((song: Song) => (
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
                          ))
                        )}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="relax"
              className="border-none p-0 outline-none"
            >
              <div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Relaxing Song
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Songs which you need when you are relaxing
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="relative">
                    <ScrollArea>
                      <div className="flex space-x-4 pb-4">
                        {isRelaxSongsLoading ? skeletons : (
                          relaxSongResult.map((song: Song) => (
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
                          ))
                        )}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="focus"
              className="border-none p-0 outline-none"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Focus Songs
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Songs helps you focus
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="relative">
                  <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                      {isFocusSongsLoading ? skeletons : (
                        focusSongResult.map((song: Song) => (
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
                        ))
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="energy"
              className="border-none p-0 outline-none"
            >
              <div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Energy Songs
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Songs in which you feel energized
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="relative">
                    <ScrollArea>
                      <div className="flex space-x-4 pb-4">
                        {isEnergySongsLoading ? skeletons : (
                          energySongResult.map((song: Song) => (
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
                          ))
                        )}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
