import { CircleCheckIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <CircleCheckIcon className="mx-auto h-12 w-12 text-green-500" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Payment Successful!</h1>
                <p className="mt-4 text-muted-foreground">
                    Congratulations, your payment for the Acme Music Subscription has been processed successfully.
                </p>
                <div className="mt-6 grid gap-4">
                    <div className="grid grid-cols-2 items-center gap-2 rounded-md bg-muted p-4 text-sm">
                        <div className="font-medium">Item:</div>
                        <div>Echo Music Subscription</div>
                        <div className="font-medium">Amount:</div>
                        <div>₹19/month</div>
                        <div className="font-medium">Transaction ID:</div>
                        <div>ABC123456789</div>
                    </div>
                    <Button>
                        <Link
                            href="/music"
                            prefetch={false}
                        >
                            Go to Music
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
