import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import FavouriteModel from "@/models/Favourite";
import LibraryModel from "@/models/Library";
import { getServerSession } from "next-auth";

export async function GET(
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

    const songID = params.songId


    try {

        const library = await LibraryModel.findOne({
            user: _user._id,
            songs: songID
        });


        if (!library) {
            return Response.json(
                {
                    success: false,
                    message: "Nothing in library"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: true
            },
            {
                status: 200
            }
        )



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
