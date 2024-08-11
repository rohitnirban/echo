import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { MediaPlayerProvider } from '@/context/MediaPlayerContext';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin']
});
export const metadata: Metadata = {
  title: 'Echo Music App',
  description: 'Real Music App.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}


export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <AuthProvider>
        <body className={roboto.className}>
          <MediaPlayerProvider>
            {children}
          </MediaPlayerProvider>
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}

