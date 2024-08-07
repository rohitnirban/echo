'use client'

import ClientProviders from './client-providers';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/sidebar';
import { useState } from 'react';
import MediaPlayer from '@/components/media-player';
import { Notifications } from 'react-push-notification';

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
            <div className="absolute top-10 left-40 w-[40vw] h-[50vh] gradient-animation-1"></div>
            <div className="absolute top-10 right-0 w-[40vw] h-[50vh] gradient-animation-2"></div>
            {children}
          </main>
          <MediaPlayer src={`https://aac.saavncdn.com/129/b52f3689e9e983720250d68e50259dba_320.mp4`} songTitle={`Joota Japani`} artist={`Kr$na`} image={`https://c.saavncdn.com/129/Joota-Japani-Hindi-2024-20240427083457-50x50.jpg`} />
        </div>
      </div>
    </ClientProviders>
  );
}
