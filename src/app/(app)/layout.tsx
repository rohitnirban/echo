'use client'

import ClientProviders from './client-providers';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/sidebar';
import { useEffect, useState } from 'react';
import MediaPlayer from '@/components/media-player';
import { Notifications } from 'react-push-notification';
import { useMediaPlayer } from '@/context/MediaPlayerContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ClientProviders>
      <Notifications />
      <div className="flex h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-auto bg-[#020202] text-white">
            <div className="absolute top-10 left-40 w-[40vw] h-[50vh] gradient-animation-1 z-10"></div>
            <div className="absolute top-10 right-0 w-[40vw] h-[50vh] gradient-animation-2 z-10"></div>
            {children}
          </main>
          <MediaPlayer src={``} songTitle={``} artist={``} image={``} />
        </div>
      </div>
    </ClientProviders>
  );
}
