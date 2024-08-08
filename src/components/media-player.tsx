'use client'

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMediaPlayer } from "@/context/MediaPlayerContext";
import { Volume, Volume2 } from "lucide-react";
import decodeHTMLEntities from "@/helpers/decodeHTMLEntities";
import Queue from "./queue";
import { IconArrowBadgeDownFilled, IconArrowBadgeUpFilled } from "@tabler/icons-react";
import { addSongToHistory } from "@/helpers/addSongToHistory";
import { formatTimeDuration } from "@/helpers/formatTimeDuration";

type MediaPlayerProps = {
    src: string;
    songTitle: string;
    artist: string;
    image: string;
};

export default function MediaPlayer({ src, songTitle, artist, image }: MediaPlayerProps) {
    const {
        currentTime,
        duration,
        songID,
        songName,
        songArtist,
        songImage,
        isPlaying,
        playNextSong,
        playPrevSong,
        handleSongEnd,
        handlePlayPause,
        audioRef,
        handleTimeUpdate,
        handleDurationChange
    } = useMediaPlayer();

    const [isMuted, setIsMuted] = useState(false);
    const [isQueueVisible, setIsQueueVisible] = useState(false);
    const [repeatMode, setRepeatMode] = useState<'off' | 'one'>('off');

    useEffect(() => {
        if (isPlaying) {
            addSongToHistory(songID)
                .then(() => console.log('Song added to history'))
                .catch((error) => console.error('Failed to add song to history:', error));
        }
    }, [isPlaying, songID]);

    const handleMuteToggle = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }, [isMuted, audioRef]);

    const handleSeek = useCallback((value: number[]) => {
        const newTime = (value[0] / 100) * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    }, [duration, audioRef]);

    const toggleQueue = useCallback(() => {
        setIsQueueVisible(prev => !prev);
    }, []);

    const handleSongEndCustom = useCallback(() => {
        if (repeatMode === 'one') {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(error => console.error("Error replaying song:", error));
            }
        } else {
            playNextSong();
        }
    }, [repeatMode, playNextSong, audioRef]);

    const toggleRepeat = useCallback(() => {
        setRepeatMode(prevMode => prevMode === 'off' ? 'one' : 'off');
    }, []);

    return (
        <div className={`w-full p-4 sticky left-0 bottom-0 z-40 text-white bg-[#020202] ${songID ? "block" : "hidden"}`}>
            <div className="mx-1 flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between z-[200]">
                <Slider
                    value={[(currentTime / duration) * 100]}
                    className="absolute top-0 left-0 w-full h-[1px]"
                    onValueChange={handleSeek}
                />
                <audio
                    ref={audioRef}
                    src={src}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleDurationChange}
                    onEnded={handleSongEndCustom}
                />
                <div className="hidden md:flex flex-col-reverse md:flex-row items-center gap-4">
                    <div className="flex items-center">
                        <ChevronLeftIcon className="cursor-pointer w-8 h-8 mx-2" onClick={playPrevSong} />
                        <div onClick={handlePlayPause}>
                            {isPlaying ? <PauseIcon className="cursor-pointer w-8 h-8 mx-2" /> : <PlayIcon className="cursor-pointer w-8 h-8 mx-2" />}
                        </div>
                        <ChevronRightIcon className="cursor-pointer w-8 h-8 mx-2" onClick={playNextSong} />
                    </div>
                    <div className="flex justify-center items-center">
                        <span className="mx-1">{formatTimeDuration(currentTime)}</span> / <span className="mx-1">{formatTimeDuration(duration)}</span>
                    </div>
                </div>
                {songImage ? (
                    <div className="flex items-center justify-between md:justify-center w-full text-center">
                        <div className="flex items-center">
                            <img src={songImage} alt="Img" className="rounded-xl mr-4 w-12 h-12" />
                            <div className="flex-1 items-center">
                                <h3 className="text-lg font-semibold">{decodeHTMLEntities(songName)}</h3>
                                <p className="text-muted-foreground">{songArtist}</p>
                            </div>
                        </div>
                        <Button className="flex md:hidden" size="icon" variant="ghost" onClick={toggleQueue}>
                            {isQueueVisible ? <IconArrowBadgeDownFilled className="w-6 h-6" /> : <IconArrowBadgeUpFilled className="w-6 h-6" />}
                        </Button>
                    </div>
                ) : (
                    <div>Play Some Song</div>
                )}
                <div className="hidden md:flex items-center gap-4">
                    <div onClick={toggleRepeat} className="cursor-pointer">
                        <RepeatIcon className={`w-6 h-6 ${repeatMode === 'one' ? 'text-[#6cf61d]' : ''}`} repeatOne={repeatMode === 'one'} />
                    </div>
                    <div className="p-2 cursor-pointer" onClick={handleMuteToggle}>
                        {isMuted ? <Volume className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </div>
                    <div className="p-2 cursor-pointer" onClick={toggleQueue}>
                        {isQueueVisible ? <IconArrowBadgeDownFilled className="w-6 h-6" /> : <IconArrowBadgeUpFilled className="w-6 h-6" />}
                    </div>
                </div>
            </div>

            <div className={`absolute mb-[5rem] bottom-0 left-0 -z-10 w-full overflow-auto transition-all duration-300 ease-in-out transform bg-[blue] ${isQueueVisible ? 'translate-y-0' : 'translate-y-[100rem]'}`}>
                <Queue />
            </div>
        </div>
    );
}



function QueueIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M3 12h18" />
            <path d="M3 18h18" />
        </svg>
    );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="white" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
            <path d="M19,6L9,12l10,6V6L19,6z M7,6H5v12h2V6z"></path>
        </svg>
    );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="white" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
            <path d="M5,18l10-6L5,6V18L5,18z M19,6h-2v12h2V6z"></path>
        </svg>
    );
}

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="14" y="4" width="4" height="16" rx="1" />
            <rect x="6" y="4" width="4" height="16" rx="1" />
        </svg>
    );
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
    );
}

function RepeatIcon(props: React.SVGProps<SVGSVGElement> & { repeatOne?: boolean }) {
    if (props.repeatOne) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m17 2 4 4-4 4" />
                <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                <path d="m7 22-4-4 4-4" />
                <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                <path d="M11 10h1v4" />
            </svg>
        );
    }

    // Return the original RepeatIcon if repeatOne is false
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m17 2 4 4-4 4" />
            <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
            <path d="m7 22-4-4 4-4" />
            <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
    );
}

