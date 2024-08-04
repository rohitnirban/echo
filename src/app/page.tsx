'use client'

import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { FileMusicIcon } from "lucide-react"
import { IconBrandGoogle } from "@tabler/icons-react"

export default function Component() {
    return (
        <div className="flex min-h-[100dvh] flex-col bg-gradient-to-br from-[#1DB954] to-[#191414]">
            <header className="px-4 py-6 md:px-6 lg:px-8">
                <Link href="/#" className="flex items-center justify-center text-white" prefetch={false}>
                    <FileMusicIcon className="size-6" />
                    <span className="sr-only">Music Website</span>
                </Link>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:px-6 lg:px-8">
                <div className="max-w-md space-y-6 text-center flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Welcome to our Music Website</h1>
                    <p className="text-lg text-white/80">
                        Sign in with your Google account to access our exclusive music content.
                    </p>
                    <Button className="flex items-center justify-center gap-2 text-white hover:bg-white/10" onClick={() => signIn("google")}>
                        <IconBrandGoogle className="size-5" />
                        Sign in with Google
                    </Button>
                </div>
            </main>
            <footer className="bg-black/50 px-4 py-6 text-center text-white/80 md:px-6 lg:px-8">
                &copy; 2024 Music Website. All rights reserved.
            </footer>
        </div>
    )
}