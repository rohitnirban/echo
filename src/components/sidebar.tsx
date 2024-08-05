import Link from "next/link"
import { CompassIcon, FlameIcon, HomeIcon, LibraryIcon, Music2Icon, XIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { useSession } from "next-auth/react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {

  const { data: session } = useSession();

  console.log(session?.user);

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#020202] text-white text-foreground border-r border-gray-700 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 overflow-y-auto`}>
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
          <Image src="/logo-without-bg.svg" alt="Logo" height={45} width={45} className="rounded-full h-18 w-18" />
          <span className="text-2xl font-bold">Echo</span>
        </Link>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
          <XIcon className="h-6 w-6" />
        </Button>
      </div>
      <Separator />
      <nav className="flex-1 space-y-2 overflow-y-auto px-2 py-2">
        <Link
          href="/music"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[#1d1d1d] hover:text-white font-semibold"
          prefetch={false}
        >
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/trendings"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[#1d1d1d] hover:text-white font-semibold"
          prefetch={false}
        >
          <FlameIcon className="h-5 w-5" />
          <span>Trending</span>
        </Link>
        <Link
          href="/library"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[#1d1d1d] hover:text-white font-semibold"
          prefetch={false}
        >
          <LibraryIcon className="h-5 w-5" />
          <span>Library</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[#1d1d1d] hover:text-white font-semibold"
          prefetch={false}
        >
          <Music2Icon className="h-5 w-5" />
          <span>Favorites</span>
        </Link>
      </nav>
      <div className="my-4">
        <div className="space-y-2">
          <div className="px-3 text-xs font-medium text-muted-foreground">Recently Played</div>
          <div className="space-y-2 p-2">
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1d1d1d] hover:text-white transition-colors"
              prefetch={false}
            >
              <img
                src="https://c.saavncdn.com/715/Punya-Paap-Hindi-2020-20201201190529-50x50.jpg"
                alt="Album Cover"
                width={40}
                height={40}
                className="rounded-md"
                style={{ aspectRatio: "40/40", objectFit: "cover" }}
              />
              <div className="flex-1">
                <div className="font-medium line-clamp-1">Starlight - Muse</div>
                <div className="text-xs text-muted-foreground line-clamp-1">Simulation Theory</div>
              </div>
              <div className="text-xs text-muted-foreground">3:45</div>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1d1d1d] hover:text-white transition-colors"
              prefetch={false}
            >
              <img
                src="https://c.saavncdn.com/138/Ek-Din-Pyaar-Tadipaar--Hindi-2020-20201013112825-50x50.jpg"
                alt="Album Cover"
                width={40}
                height={40}
                className="rounded-md"
                style={{ aspectRatio: "40/40", objectFit: "cover" }}
              />
              <div className="flex-1">
                <div className="font-medium line-clamp-1">Believer - Imagine Dragons</div>
                <div className="text-xs text-muted-foreground line-clamp-1">Evolve</div>
              </div>
              <div className="text-xs text-muted-foreground">4:12</div>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1d1d1d] hover:text-white transition-colors"
              prefetch={false}
            >
              <img
                src="https://c.saavncdn.com/256/Aayi-Nai-From-Stree-2-Hindi-2024-20240802153845-50x50.jpg"
                alt="Album Cover"
                width={40}
                height={40}
                className="rounded-md"
                style={{ aspectRatio: "40/40", objectFit: "cover" }}
              />
              <div className="flex-1">
                <div className="font-medium line-clamp-1">Shape of You - Ed Sheeran</div>
                <div className="text-xs text-muted-foreground line-clamp-1">÷</div>
              </div>
              <div className="text-xs text-muted-foreground">3:53</div>
            </Link>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Sidebar