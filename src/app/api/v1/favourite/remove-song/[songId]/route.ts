import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import FavouriteModel from "@/models/Favourite";
import { getServerSession } from "next-auth";

export async function DELETE(
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
                message: "Song ID is required to remove song"
            },
            {
                status: 400
            }
        );
    }

    try {
        let favourite = await FavouriteModel.findOne({ user: _user._id });

        if (!favourite) {
            return Response.json(
                {
                    success: false,
                    message: "Nothing in favourite"
                },
                {
                    status: 404
                }
            )
        }

        // Remove song logic
        const updatedFavourite = await FavouriteModel.findOneAndUpdate(
            { user: _user._id },
            { $pull: { songs: { _id: songID } } },
            { new: true }
        );

        if (!updatedFavourite) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to remove song from favourite"
                },
                {
                    status: 400
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Song removed successfully",
                favourite: updatedFavourite
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.error("Error removing song:", error);
        return Response.json(
            {
                success: false,
                message: "Error removing song"
            },
            {
                status: 500
            }
        );
    }
}
