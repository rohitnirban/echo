'use client'

import React from 'react';
import Script from 'next/script';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckIcon, XIcon } from "lucide-react"
import RazorpayButton from '@/components/ui/razor-pay-button';

export default function SubscriptionModal() {

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />
            <div className="w-full max-w-5xl mx-auto py-12 md:py-20 lg:py-24 px-4 md:px-6">
                <div className="space-y-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Unlock the Power of Music</h1>
                    <p className="text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                        Choose the perfect music subscription plan to elevate your listening experience.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <Card className="bg-card text-card-foreground shadow-lg">
                        <CardHeader>
                            <CardTitle>Free</CardTitle>
                            <CardDescription>Get started with our basic features.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-4xl font-bold">₹0</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />
                                    Full music library access
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />
                                    High-quality audio
                                </li>
                                <li>
                                    <XIcon className="mr-2 inline-block h-4 w-4 text-red-500" />
                                    Full History
                                </li>
                                <li>
                                    <XIcon className="mr-2 inline-block h-4 w-4 text-red-500" />
                                    Ad-free listening
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled>Already Subscribed</Button>
                        </CardFooter>
                    </Card>
                    <Card className="bg-card text-card-foreground shadow-lg">
                        <CardHeader>
                            <CardTitle>Premium</CardTitle>
                            <CardDescription>Enjoy ad-free listening.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-4xl font-bold">₹19</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />
                                    Full music library access
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />
                                    High-quality audio
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />
                                    Full History
                                </li>
                                <li>
                                    <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />
                                    Ad-free listening
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <RazorpayButton />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    )
}
