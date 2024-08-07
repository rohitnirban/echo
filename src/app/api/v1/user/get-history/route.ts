import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
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

    try {
        const user = await UserModel.findById(_user._id).select('songHistory');

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            );
        }

        return Response.json(
            {
                success: true,
                songHistory: user.songHistory
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Error fetching song history:", error);
        return Response.json(
            {
                success: false,
                message: "Error fetching song history"
            },
            {
                status: 500
            }
        );
    }
}
