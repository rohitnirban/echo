import Link from "next/link"
import { CompassIcon, HomeIcon, LibraryIcon, Music2Icon, XIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-foreground border-r transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
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
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-2">
        <Link
          href="/music"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/trendings"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <CompassIcon className="h-5 w-5" />
          <span>Explore</span>
        </Link>
        <Link
          href="/library"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <LibraryIcon className="h-5 w-5" />
          <span>Library</span>
        </Link>
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground">PLAYLISTS</div>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <Music2Icon className="h-5 w-5" />
          <span>Liked Songs</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <Music2Icon className="h-5 w-5" />
          <span>Favorites</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <Music2Icon className="h-5 w-5" />
          <span>Discover Weekly</span>
        </Link>
      </nav>
    </div>
  )
}

export default Sidebar