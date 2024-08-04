'use client'

import { ModeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { useMediaPlayer } from "@/context/MediaPlayerContext";
import decodeHTMLEntities from "@/helpers/decodeHTMLEntities";
import getSongsSuggestions from "@/helpers/getSongsSuggestions";

interface Song {
  id: string;
  name: string;
  artists: { primary: { name: string }[] };
  image: { url: string }[];
  downloadUrl: { url: string }[];
  duration?:number;
}

export function Menu() {

  const { audioRef, setSongDetails, addToQueue, handlePlayPause } = useMediaPlayer();

  const [songQuery, setSongQuery] = useState('');
  const [songResult, setSongResult] = useState<Song[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getSong = async () => {
    if (songQuery.length >= 3) {
      try {
        const response = await axios.get(`https://saavn-api-sigma.vercel.app/api/search/songs?query=${songQuery}&page=1&limit=10`);
        if (response.data.success === true) {
          setSongResult(response.data.data.results);
          setIsDropdownOpen(true);
        } else {
          setSongResult([]);
          setIsDropdownOpen(false);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
        setSongResult([]);
        setIsDropdownOpen(false);
      }
    } else {
      setSongResult([]);
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    getSong();
  }, [songQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handlePlay = async (song: Song) => {
    if (audioRef.current) {
      if (!song.downloadUrl || !song.image) return null;

      await audioRef.current.pause(); // Pause any currently playing song

      audioRef.current.src = song.downloadUrl[4].url; // Set the new song URL

      const decodedAlbumName = decodeHTMLEntities(song.name);
      setSongDetails(song.id, decodedAlbumName, song.artists.primary[0].name, song.image[0].url, song.image[2].url);
      const similarSongs = await getSongsSuggestions(song.id);
      addToQueue(similarSongs);

      handlePlayPause(); // Update the play/pause state
      // audioRef.current.play(); // Play the new song immediately
      console.log("Song Played: " + decodedAlbumName);
    }
  };

  return (
    <nav className="flex justify-between items-center p-3 sticky top-0 bg-white z-50 border-b">
      <div className="logo">
        Echo
      </div>
      <div className="search relative">
        <Input
          type="text"
          placeholder="Search"
          className="w-96"
          value={songQuery}
          onChange={(e) => setSongQuery(e.target.value)}
        />
        {isDropdownOpen && (
          <div ref={dropdownRef} className="absolute top-full mt-2 w-full bg-white shadow-lg z-50 overflow-auto max-h-96">
            {songResult.map((songData, index) => (
              <p key={index} onClick={() => handlePlay(songData)} className="text-left flex items-center p-2 hover:bg-black hover:text-white hover:cursor-pointer">
                <img src={songData.image[0].url} alt="" />
                <p className="flex flex-col justify-center text-left ml-4">
                  <span>{songData.name}</span>
                  <span>{songData.artists.primary.map(artist => artist.name).join(', ')}</span>
                </p>
              </p>
            ))}
          </div>
        )}
      </div>
      <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
        <MenubarMenu>
          <MenubarTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </MenubarTrigger>
          <MenubarContent>
            <ModeToggle />
            <MenubarCheckboxItem>Show Playing Next</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>Show Lyrics</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset disabled>
              Show Status Bar
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Hide Sidebar</MenubarItem>
            <MenubarItem disabled inset>
              Enter Full Screen
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </nav>
  );
}
