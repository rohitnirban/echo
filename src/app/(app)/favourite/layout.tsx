'use client'

import { useMediaPlayer } from "@/context/MediaPlayerContext";
import { useEffect } from "react";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    // const { isPlaying, handlePlayPause } = useMediaPlayer();

    // useEffect(() => {
    //   const handleKeyDown = (event: KeyboardEvent) => {
    //     if (event.code === 'Space') {
    //       event.preventDefault(); // Prevent default spacebar behavior
    //       handlePlayPause(); // Call handlePlayPause from context
    //     }
    //   };

    //   window.addEventListener('keydown', handleKeyDown);

    //   return () => {
    //     window.removeEventListener('keydown', handleKeyDown);
    //   };
    // }, [handlePlayPause]);

    return (
        <div>
            {children}
        </div>
    );
}
