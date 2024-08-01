'use client'

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMediaPlayer } from "@/context/MediaPlayerContext";
import { Volume, Volume2 } from "lucide-react";
import decodeHTMLEntities from "@/helpers/decodeHTMLEntities";
import Queue from "./queue";

type MediaPlayerProps = {
    src: string; // MP4 music file URL
    songTitle: string;
    artist: string;
    image: string;
};

export default function MediaPlayer({ src, songTitle, artist, image }: MediaPlayerProps) {
    const { currentTime, duration, songID, songName, songArtist, songImage, isPlaying, playNextSong, handleSongEnd, handlePlayPause, audioRef, handleTimeUpdate, handleDurationChange } = useMediaPlayer();

    const [isMuted, setIsMuted] = useState(false);
    const [isQueueVisible, setIsQueueVisible] = useState(false);

    const handleMuteToggle = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleSeek = (value: number[]) => {
        const newTime = (value[0] / 100) * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const toggleQueue = () => {
        setIsQueueVisible(!isQueueVisible);
    };

    return (
        <div className={`w-full bg-background p-4 rounded-lg shadow-md sticky left-0 bottom-0 z-[100000] ${songID ? "block" : "hidden"}`}>
            <div className="mx-1 flex items-center justify-between">
                <Slider
                    value={[(currentTime / duration) * 100]} // Calculate progress as a percentage
                    className="absolute top-0 left-0 w-full h-1"
                    onValueChange={handleSeek} // Handle seeking when slider value changes
                />
                <audio
                    ref={audioRef}
                    src={src}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleDurationChange}
                    onEnded={handleSongEnd}
                />
                <div className="flex items-center gap-4">
                    <Button size="icon" variant="ghost">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </Button>
                    <Button size="icon" variant={isPlaying ? "default" : "ghost"} onClick={handlePlayPause}>
                        {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={playNextSong}>
                        <ChevronRightIcon className="w-6 h-6" />
                    </Button>
                    <div>
                        <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                    </div>
                </div>
                {songImage ?
                    <div className="flex text-center">
                        <img src={songImage} alt="Img" className="rounded-xl mr-4" />
                        <div className="flex-1 items-center">
                            <h3 className="text-lg font-semibold">{decodeHTMLEntities(songName)}</h3>
                            <p className="text-muted-foreground">{songArtist}</p>
                        </div>
                    </div>
                    :
                    <div>
                        Play Some Song
                    </div>
                }
                <div className="flex items-center gap-4">
                    <Button size="icon" variant={"ghost"}>
                        <ShuffleIcon className="w-6 h-6" />
                    </Button>
                    <Button size="icon" variant={"ghost"}>
                        <RepeatIcon className="w-6 h-6" />
                    </Button>
                    <Button size="icon" variant={"ghost"} onClick={handleMuteToggle}>
                        {isMuted ? <Volume className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </Button>
                    <Button size="icon" variant={"ghost"} onClick={toggleQueue}>
                        {isQueueVisible ? <XIcon className="w-6 h-6" /> : <QueueIcon className="w-6 h-6" />}
                    </Button>
                </div>
            </div>
            {isQueueVisible && (
                <div className="absolute mb-[5.5rem] bottom-0 right-0 -z-10">
                    <Queue />
                </div>
            )}
        </div>
    );
}

function formatTime(seconds: number): string {
    const format = (val: number) => `0${Math.floor(val)}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${format(minutes)}:${format(secs)}`;
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
        <svg {...props} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
            <path d="M19,6L9,12l10,6V6L19,6z M7,6H5v12h2V6z"></path>
        </svg>
    );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
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
            fill="none"
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
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
    );
}

function RepeatIcon(props: React.SVGProps<SVGSVGElement>) {
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

function ShuffleIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
            <path d="m18 2 4 4-4 4" />
            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
            <path d="m18 14 4 4-4 4" />
        </svg>
    );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}