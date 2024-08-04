import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import LibraryModel from "@/models/Library";
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
        let library = await LibraryModel.findOne({ user: _user._id });

        if (!library) {
            library = new LibraryModel({
                user: _user._id,
                songs: []
            });
        }

        if (!library.songs.includes(songID)) {
            library.songs.push(songID);
            await library.save();

            return Response.json(
                {
                    success: true,
                    message: "Song added to library successfully"
                },
                {
                    status: 200
                }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Song already exists in the library"
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
