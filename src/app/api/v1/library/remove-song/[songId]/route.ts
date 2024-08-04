import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import LibraryModel from "@/models/Library";
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
        let library = await LibraryModel.findOne({ user: _user._id });

        if (!library) {
            return Response.json(
                {
                    success: false,
                    message: "Nothing in Library"
                },
                {
                    status: 404
                }
            )
        }

        // Remove song logic
        const updatedLibrary = await LibraryModel.findOneAndUpdate(
            { user: _user._id },
            { $pull: { songs: { _id: songID } } },
            { new: true }
        );

        if (!updatedLibrary) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to remove song from library"
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
                library: updatedLibrary
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
