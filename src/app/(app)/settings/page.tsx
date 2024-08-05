import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { AtSignIcon, BellIcon, EyeOffIcon, LockIcon, MoonIcon, UserIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function Component() {
    return (
        <main className="flex-1 space-y-4 p-4 pt-6 md:p-8 bg-muted/40">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Settings
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Change your account settings.
                    </p>
                </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-1 gap-6 px-4 py-6 sm:px-6 md:gap-10">
                <nav className="hidden w-48 flex-col gap-2 border-r pr-6 md:flex">
                    <Link
                        href="#"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                        prefetch={false}
                    >
                        <UserIcon className="h-5 w-5" />
                        Account
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                        prefetch={false}
                    >
                        <MoonIcon className="h-5 w-5" />
                        Preferences
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                        prefetch={false}
                    >
                        <BellIcon className="h-5 w-5" />
                        Notifications
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                        prefetch={false}
                    >
                        <LockIcon className="h-5 w-5" />
                        Security
                    </Link>
                </nav>
                <div className="flex-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>Manage your account settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="John Deo" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" type="text" placeholder="abc_123"/>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t p-6">
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>Customize your app experience.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="theme">Audio Quality</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Audio Quality" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Low</SelectItem>
                                        <SelectItem value="dark">Medium</SelectItem>
                                        <SelectItem value="system">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t p-6">
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Manage your notification preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="-mx-2 flex items-start gap-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                <BellIcon className="mt-px h-5 w-5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Everything</p>
                                    <p className="text-sm text-muted-foreground">Email digest, mentions & all activity.</p>
                                </div>
                            </div>
                            <div className="-mx-2 flex items-start gap-4 rounded-md bg-accent p-2 text-accent-foreground transition-all">
                                <AtSignIcon className="mt-px h-5 w-5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Available</p>
                                    <p className="text-sm text-muted-foreground">Only mentions and comments.</p>
                                </div>
                            </div>
                            <div className="-mx-2 flex items-start gap-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                <EyeOffIcon className="mt-px h-5 w-5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Ignoring</p>
                                    <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t p-6">
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </main>
    )
}