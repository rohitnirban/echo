'use client'

import React, { createContext, useContext, useRef, useState } from "react";
import { addSongsToQueue } from "@/helpers/queueUtils"; // import the utility function
import getSongsSuggestions from "@/helpers/getSongsSuggestions";

interface Song {
  id: string;
  name: string;
  artists: { primary: { name: string }[] };
  image: { url: string }[];
  downloadUrl: { url: string }[];
}

interface MediaPlayerContextType {
  isPlaying: boolean;
  songID: string;
  songName: string;
  songArtist: string;
  songImage: string;
  currentTime: number;
  duration: number;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  handlePlayPause: () => void;
  handleTimeUpdate: () => void;
  handleDurationChange: () => void;
  handleSongEnd: () => void;
  setSongDetails: (id: string, name: string, artist: string, image: string) => void;
  setSongTime: (currentTime: number, duration: number) => void;
  setQueue: (queue: Song[]) => void;
  addToQueue: (songs: Song[]) => void;
  playNextSong: () => void;
  queue: Song[];
}

const MediaPlayerContext = createContext<MediaPlayerContextType | undefined>(undefined);

export const MediaPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songID, setSongID] = useState("");
  const [songName, setSongName] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songImage, setSongImage] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueueState] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
  if (audioRef.current) {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    }
    setIsPlaying(!isPlaying);
  }
};


  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSongEnd = () => {
    playNextSong();
  };

  const setSongDetails = (id: string, name: string, artist: string, image: string) => {
    setSongID(id);
    setSongName(name);
    setSongArtist(artist);
    setSongImage(image);
  };

  const setSongTime = (currentTime: number, duration: number) => {
    setCurrentTime(currentTime);
    setDuration(duration);
  };

  const setQueue = (queue: Song[]) => {
    setQueueState(queue);
  };

  const addToQueue = async (songs: Song[]) => {
    console.log("Songs ",songs);
    const suggestionSongs = await Promise.all(
      songs.map(async (song) => {
        const suggestions = await getSongsSuggestions(song.id);
        return suggestions ? suggestions : [];
      })
    );

    const flattenedSuggestions = suggestionSongs.flat();

    if (flattenedSuggestions.length > 0) {
      setQueueState((prevQueue) => addSongsToQueue(prevQueue, flattenedSuggestions));
    }
  };

  const playNextSong = () => {
    if (queue.length > 0) {
      const nextSong = queue.shift();
      setQueueState([...queue]); // Update the queue after removing the first song
      if (nextSong) {
        setSongDetails(nextSong.id, nextSong.name, nextSong.artists.primary[0].name, nextSong.image[0].url);
        if (audioRef.current) {
          audioRef.current.src = nextSong.downloadUrl[4].url;
          audioRef.current.play();
        }
        setIsPlaying(true);
      }
    }
  };

  return (
    <MediaPlayerContext.Provider
      value={{
        isPlaying,
        songID,
        songName,
        songArtist,
        songImage,
        currentTime,
        duration,
        audioRef,
        handlePlayPause,
        handleTimeUpdate,
        handleDurationChange,
        handleSongEnd,
        setSongDetails,
        setSongTime,
        setQueue,
        addToQueue,
        playNextSong,
        queue, // Ensure queue is included in the context value
      }}
    >
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayer = () => {
  const context = useContext(MediaPlayerContext);
  if (!context) {
    throw new Error("useMediaPlayer must be used within a MediaPlayerProvider");
  }
  return context;
};
