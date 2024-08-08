import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import FavouriteModel from "@/models/Favourite";
import { getServerSession } from "next-auth";

export async function POST(
    request: Request,
    { params }: { params: { songId: string } }
) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return Response.json(
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
        return Response.json(
            {
                success: false,
                message: "Song ID is required to add new song"
            },
            {
                status: 400
            }
        );
    }

    try {
        let favourite = await FavouriteModel.findOne({ user: _user._id });

        if (!favourite) {
            favourite = new FavouriteModel({
                user: _user._id,
                songs: []
            });
        }

        if (!favourite.songs.includes(songID)) {
            favourite.songs.push(songID);
            await favourite.save();

            return Response.json(
                {
                    success: true,
                    message: "Song added to favourite successfully"
                },
                {
                    status: 200
                }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Song already exists in the favourite"
                },
                {
                    status: 409
                }
            );
        }
    } catch (error) {
        console.error("Error adding new song:", error);
        return Response.json(
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
