// 'use client';

// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent } from "@/components/ui/tabs";
// import { AlbumArtwork } from "@/components/album-artwork";
// import MediaPlayer from "@/components/media-player";
// import { Song, useMediaPlayer } from "@/context/MediaPlayerContext";
// import { useQuery } from 'react-query';
// import axios from 'axios';
// import { Skeleton } from "@/components/ui/skeleton";
// import { useMemo } from "react";
// import getSongsSuggestions from "@/helpers/getSongsSuggestions";

// interface SongData {
//   id: string;
//   name: string;
//   year: string;
//   artists: { primary: Artist[] };
//   image: { url: string }[];
//   downloadUrl: { url: string }[];
// }

// interface SuggestionSong {
//   id: string; // or number, depending on what type the id actually is
//   // Add other properties that might be present in the song object
// }

// interface Artist {
//   name: string;
// }

// const fetchLatestSongsFromSavaan = async () => {
//   const response = await axios.get(
//     'https://saavn-api-sigma.vercel.app/api/search/songs?query=latest'
//   );

//   const data = response.data.data.results;

//   return data
// };

// const fetchTopSongsFromSavaan = async () => {
//   const response = await axios.get(
//     'https://saavn-api-sigma.vercel.app/api/search/songs?query=sumit goswami'
//   );

//   const data = response.data.data.results;

//   return data
// };

// const fetchHistoryOfUser = async () => {
//   const response = await axios.get(`/api/v1/user/get-history`);

//   const data = response.data.songHistory;

//   return data.slice(0, 3);
// };

// const fetchSongSuggestion = async (songId: string) => {
//   const response = await axios.get(`https://saavn-api-sigma.vercel.app/api/songs/${songId}/suggestions`);

//   const data = response.data.data;

//   return data.slice(0, 10);
// };




// const AlbumArtworkSkeleton = () => (
//   <div className="space-y-3 w-[150px]">
//     <Skeleton className="h-[150px] w-[150px] rounded-md bg-gray-700" />
//     <div className="space-y-2">
//       <Skeleton className="h-4 w-[75%] bg-gray-700" />
//       <Skeleton className="h-4 w-[50%] bg-gray-700" />
//     </div>
//   </div>
// );

// export default function MusicPage() {
//   const { songID, isPlaying } = useMediaPlayer();

//   const { data: latestSongResult = [], isLoading: isLatestSongsLoading, error: latestSongsError } = useQuery(
//     'latestSongsFromSavaan',
//     fetchLatestSongsFromSavaan,
//     {
//       cacheTime: 24 * 60 * 60 * 1000,
//       staleTime: 24 * 60 * 60 * 1000,
//     }
//   );

//   const { data: topSongResult = [], isLoading: isTopSongsLoading, error: topSongsError } = useQuery(
//     'topSongsFromSavaan',
//     fetchTopSongsFromSavaan,
//     {
//       cacheTime: 24 * 60 * 60 * 1000,
//       staleTime: 24 * 60 * 60 * 1000,
//     }
//   );

//   const { data: suggestionSongResult = [], isLoading: isSuggestionSongsLoading, error: suggestionSongsError } = useQuery(
//     'suggestionSongsFromUser',
//     fetchHistoryOfUser,
//     {
//       cacheTime: 24 * 60 * 60 * 1000,
//       staleTime: 24 * 60 * 60 * 1000,
//     }
//   );

//   const suggestionQueries = suggestionSongResult.map((song: SuggestionSong) =>
//     useQuery(
//       ['songSuggestions', song.id],
//       () => fetchSongSuggestion(song.id),
//       {
//         enabled: !!song.id,
//         cacheTime: 24 * 60 * 60 * 1000,
//         staleTime: 24 * 60 * 60 * 1000,
//       }
//     )
//   );

//   console.log(suggestionQueries);


//   const skeletons = useMemo(() =>
//     Array.from({ length: 10 }).map((_, index) => (
//       <AlbumArtworkSkeleton key={index} />
//     )),
//     []
//   );

//   if (latestSongsError || topSongsError || suggestionSongsError) {
//     console.error('Error fetching songs:', latestSongsError || topSongsError || suggestionSongsError);
//     return <p>Error loading songs. Please try again later.</p>;
//   }


//   return (
//     <>
//       <div className="col-span-3 lg:col-span-4">
//         <div className="h-full px-4 py-6 lg:px-8">
//           <Tabs defaultValue="music" className="h-full space-y-6">
//             <TabsContent
//               value="music"
//               className="border-none p-0 outline-none"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <h2 className="text-2xl font-semibold tracking-tight">
//                     Listen Now
//                   </h2>
//                   <p className="text-sm text-muted-foreground">
//                     Top picks for you. Updated daily.
//                   </p>
//                 </div>
//               </div>
//               <Separator className="my-4" />
//               <div className="relative">
//                 <ScrollArea>
//                   <div className="flex space-x-4 pb-4">
//                     {isLatestSongsLoading ? skeletons : (
//                       latestSongResult.map((song: SongData) => (
//                         <div key={song.id} className="flex flex-col space-y-2">
//                           <AlbumArtwork
//                             album={{
//                               songID: song.id,
//                               cover: song.image[1]?.url,
//                               name: song.name,
//                               artist: song.artists.primary.map((artist) => artist.name).join(", ")
//                             }}
//                             image={song.image[0]?.url}
//                             songUrl={song.downloadUrl[4]?.url}
//                             className="w-[150px]"
//                             width={150}
//                             height={150}
//                           />
//                         </div>
//                       ))
//                     )}
//                   </div>
//                   <ScrollBar orientation="horizontal" />
//                 </ScrollArea>
//               </div>
//             </TabsContent>
//             <TabsContent
//               value="music"
//               className="border-none p-0 outline-none"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <h2 className="text-2xl font-semibold tracking-tight">
//                     Sumit Goswami
//                   </h2>
//                   <p className="text-sm text-muted-foreground">
//                     Sumit Goswami songs
//                   </p>
//                 </div>
//               </div>
//               <Separator className="my-4" />
//               <div className="relative">
//                 <ScrollArea>
//                   <div className="flex space-x-4 pb-4">
//                     {isTopSongsLoading ? skeletons : (
//                       topSongResult.map((song: SongData) => (
//                         <div key={song.id} className="flex flex-col space-y-2">
//                           <AlbumArtwork
//                             album={{
//                               songID: song.id,
//                               cover: song.image[1]?.url,
//                               name: song.name,
//                               artist: song.artists.primary.map((artist) => artist.name).join(", ")
//                             }}
//                             image={song.image[0]?.url}
//                             songUrl={song.downloadUrl[4]?.url}
//                             className="w-[150px]"
//                             width={150}
//                             height={150}
//                           />
//                         </div>
//                       ))
//                     )}
//                   </div>
//                   <ScrollBar orientation="horizontal" />
//                 </ScrollArea>
//               </div>
//             </TabsContent>
//             <TabsContent
//               value="music"
//               className="border-none p-0 outline-none"
//             >
//               {suggestionQueries.map((query: any, index: number) => (
//                 query.isSuccess && (
//                   <div key={suggestionSongResult[index].id}>
//                     <div className="flex items-center justify-between">
//                       <div className="space-y-1">
//                         <h2 className="text-2xl font-semibold tracking-tight">
//                           Similar to {query.data.songName}
//                         </h2>
//                         <p className="text-sm text-muted-foreground">
//                           Songs you might like based on {query.data.songName}
//                         </p>
//                       </div>
//                     </div>
//                     <Separator className="my-4" />
//                     <div className="relative">
//                       <ScrollArea>
//                         <div className="flex space-x-4 pb-4">
//                           {query.data.suggestions.map((song: Song) => (
//                             <div key={song.id} className="flex flex-col space-y-2">
//                               <AlbumArtwork
//                                 album={{
//                                   songID: song.id,
//                                   cover: song.image[1]?.url,
//                                   name: song.name,
//                                   artist: song.artists.primary.map((artist) => artist.name).join(", ")
//                                 }}
//                                 image={song.image[0]?.url}
//                                 songUrl={song.downloadUrl[4]?.url}
//                                 className="w-[150px]"
//                                 width={150}
//                                 height={150}
//                               />
//                             </div>
//                           ))}
//                         </div>
//                         <ScrollBar orientation="horizontal" />
//                       </ScrollArea>
//                     </div>
//                   </div>
//                 )
//               ))}

//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </>
//   );
// }


'use client';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AlbumArtwork } from "@/components/album-artwork";
import MediaPlayer from "@/components/media-player";
import { Song, useMediaPlayer } from "@/context/MediaPlayerContext";
import { useQuery } from 'react-query';
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import getSongsSuggestions from "@/helpers/getSongsSuggestions";
import { SongHistory } from "@/models/User";

interface SongData {
  id: string;
  name: string;
  year: string;
  artists: { primary: Artist[] };
  image: { url: string }[];
  downloadUrl: { url: string }[];
}

interface SuggestionSong {
  id: string; // or number, depending on what type the id actually is
  // Add other properties that might be present in the song object
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

  const { data: topSongResult = [], isLoading: isTopSongsLoading, error: topSongsError } = useQuery(
    'topSongsFromSavaan',
    fetchTopSongsFromSavaan,
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

  if (latestSongsError || topSongsError) {
    console.error('Error fetching songs:', latestSongsError || topSongsError);
    return <p>Error loading songs. Please try again later.</p>;
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
                    {isLatestSongsLoading ? skeletons : (
                      latestSongResult.map((song: SongData) => (
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
                    {isTopSongsLoading ? skeletons : (
                      topSongResult.map((song: SongData) => (
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
