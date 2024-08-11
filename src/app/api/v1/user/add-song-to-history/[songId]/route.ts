import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { songId: string } }
) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user = session?.user;


    if (!session || !_user) {
        return NextResponse.json(
            {
                success: false,
                message: 'Not authenticated'
            },
            {
                status: 401
            }
        );
    }

    const songID = params.songId;

    if (!songID) {
        return NextResponse.json(
            {
                success: false,
                message: "Song ID is required to add song in history"
            },
            {
                status: 404
            }
        );
    }

    try {
        const user = await UserModel.findById(_user._id);


        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            );
        }

        // Create a new subdocument directly
        const newSongHistory = {
            songId: songID,
            playedAt: new Date(),
        };

        // await user.save();

        
        // Ensure only the last 10 entries are kept
        if (user.songHistory.length >= 10) {
            user.songHistory = user.songHistory.slice(-10) as Types.DocumentArray<typeof user.songHistory[0]>;
        }

        user.songHistory.push(newSongHistory);
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Song added to history"
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Error adding new song:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error adding new song"
            },
            {
                status: 500
            }
        );
    }
}
