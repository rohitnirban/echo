// queueUtils.ts
interface Song {
    id: string;
    name: string;
    artists: { primary: { name: string }[] };
    image: { url: string }[];
    downloadUrl: { url: string }[];
  }
  
  export const addSongsToQueue = (currentQueue: Song[], newSongs: Song[]): Song[] => {
    const combinedQueue = [...currentQueue, ...newSongs];
    const uniqueQueue = combinedQueue.filter((song, index, self) => 
      index === self.findIndex((s) => s.id === song.id)
    );
    return uniqueQueue;
  };
  