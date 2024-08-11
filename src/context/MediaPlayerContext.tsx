'use client'

import React, { createContext, useCallback, useContext, useRef, useState, useEffect } from "react";
import { addSongsToQueue } from "@/helpers/queueUtils";
import getSongsSuggestions from "@/helpers/getSongsSuggestions";
import addNotification from 'react-push-notification';

export interface Song {
  id: string;
  name: string;
  artists: { primary: { name: string }[] };
  image: { url: string }[];
  downloadUrl: { url: string }[];
  duration?: number;
}

interface MediaPlayerContextType {
  isPlaying: boolean;
  setIsPlayingState: (value: boolean) => void;
  songID: string;
  songName: string;
  songArtist: string;
  songImage: string;
  songImageHigh: string;
  currentTime: number;
  duration: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  handlePlayPause: () => void;
  handleTimeUpdate: () => void;
  handleDurationChange: () => void;
  handleSongEnd: () => void;
  setSongDetails: (id: string, name: string, artist: string, image: string, imageHigh: string) => void;
  setSongTime: (currentTime: number, duration: number) => void;
  setQueue: (queue: Song[]) => void;
  addToQueue: (songs: Song[]) => Promise<void>;
  addToQueueNext: (song: Song) => void;
  playNextSong: () => void;
  playPrevSong: () => void;
  clearQueue: () => void;
  playHistory: Song[];
  queue: Song[];
}

const MediaPlayerContext = createContext<MediaPlayerContextType | undefined>(undefined);


export const MediaPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [isLoading, setIsLoading] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [songID, setSongID] = useState("");
  const [songName, setSongName] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songImage, setSongImage] = useState("");
  const [songImageHigh, setSongImageHigh] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueueState] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playHistory, setPlayHistory] = useState<Song[]>([]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleSongEnd);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleSongEnd);
      };
    }
  }, []);


  const setIsPlayingState = (value: boolean) => {
    setIsPlaying(value);
  }

  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      }
      setIsPlaying(prev => !prev);
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleDurationChange = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleSongEnd = useCallback(() => {
    playNextSong();
  }, []);

  const setSongDetails = useCallback((id: string, name: string, artist: string, image: string, imageHigh: string) => {
    setSongID(id);
    setSongName(name);
    setSongArtist(artist);
    setSongImage(image);
    setSongImageHigh(imageHigh);
  }, []);

  const setSongTime = useCallback((currentTime: number, duration: number) => {
    setCurrentTime(currentTime);
    setDuration(duration);
  }, []);

  const setQueue = useCallback((newQueue: Song[]) => {
    setQueueState(newQueue);
  }, []);

  const addToQueue = useCallback(async (songs: Song[]) => {
    try {
      const suggestionSongs = await Promise.all(
        songs.map(song => getSongsSuggestions(song.id))
      );

      const flattenedSuggestions = suggestionSongs.flat().filter(Boolean);

      if (flattenedSuggestions.length > 0) {
        setQueueState(prevQueue => addSongsToQueue(prevQueue, flattenedSuggestions));
      }
    } catch (error) {
      console.error("Error adding songs to queue:", error);
      addNotification({
        title: 'Error',
        message: 'Failed to add songs to queue',
        theme: 'red',
        duration: 3000,
      });
    }
  }, []);

  const addToQueueNext = useCallback((song: Song) => {
    setQueueState(prevQueue => [song, ...prevQueue]);
  }, []);

  const playNextSong = useCallback(() => {
    if (queue.length > 0) {
      const currentSong: Song = {
        id: songID,
        name: songName,
        artists: { primary: [{ name: songArtist }] },
        image: [{ url: songImage }, { url: songImageHigh }],
        downloadUrl: [{ url: audioRef.current?.src || '' }],
      };
      setPlayHistory(prevHistory => [currentSong, ...prevHistory]);

      const [nextSong, ...remainingQueue] = queue;
      setQueueState(remainingQueue);
      console.log(nextSong);
      if (nextSong) {
        setSongDetails(
          nextSong.id,
          nextSong.name,
          nextSong.artists.primary[0]?.name || 'Unknown Artist',
          nextSong.image[0]?.url,
          nextSong.image[2]?.url || nextSong.image[1]?.url,
        );
        setIsPlaying(true)
        if (audioRef.current) {
          audioRef.current.src = nextSong.downloadUrl[4].url || nextSong.downloadUrl[0].url;
          audioRef.current.play().catch(error => console.error("Error playing next song:", error));
        }
      }

    }
  }, [queue, songID, songName, songArtist, songImage, songImageHigh, setSongDetails]);

  const playPrevSong = useCallback(() => {
    if (playHistory.length > 0) {
      const [prevSong, ...remainingHistory] = playHistory;
      setPlayHistory(remainingHistory);

      if (prevSong) {
        setIsLoading(true);  // Set loading state to true

        const currentSong: Song = {
          id: songID,
          name: songName,
          artists: { primary: [{ name: songArtist }] },
          image: [{ url: songImage }, { url: songImageHigh }],
          downloadUrl: [{ url: audioRef.current?.src || '' }],
          duration: duration
        };
        setQueueState(prevQueue => [currentSong, ...prevQueue]);

        setSongDetails(
          prevSong.id,
          prevSong.name,
          prevSong.artists?.primary?.[0]?.name || 'Unknown Artist',
          prevSong.image?.[0]?.url || '',
          prevSong.image?.[1]?.url || ''
        );

        if (audioRef.current) {
          console.log(prevSong);
          audioRef.current.src = prevSong.downloadUrl[0].url;
          audioRef.current.play()
            .then(() => {
              setDuration(audioRef.current!.duration);
              setIsLoading(false);  // Set loading state to false when song starts playing
            })
            .catch(error => {
              console.error("Error playing previous song:", error);
              setIsLoading(false);  // Set loading state to false if there's an error
            });
        }
        setIsPlaying(true);
      }
    } else if (audioRef.current) {
      setIsLoading(true);  // Set loading state to true
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => setIsLoading(false))  // Set loading state to false when song starts playing
        .catch(error => {
          console.error("Error restarting current song:", error);
          setIsLoading(false);  // Set loading state to false if there's an error
        });
    }
  }, [playHistory, songID, songName, songArtist, songImage, songImageHigh, duration, setSongDetails]);


  const clearQueue = useCallback(() => {
    setQueueState([]);
  }, []);

  const contextValue = {
    isPlaying,
    setIsPlayingState,
    songID,
    songName,
    songArtist,
    songImage,
    songImageHigh,
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
    addToQueueNext,
    playNextSong,
    playPrevSong,
    playHistory,
    clearQueue,
    queue,
    isLoading,
  };

  return (
    <MediaPlayerContext.Provider value={contextValue}>
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
