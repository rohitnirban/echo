import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
    key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authenticated'
            }),
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

        // Check if all required fields are present
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Missing required fields in the request"
                }),
                { status: 400 }
            );
        }

        const text = `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET!)
            .update(text)
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        console.log("Is Authentic:", isAuthentic);

        if (!isAuthentic) {
            return Response.json(
                {
                    success: false,
                    message: "Payment verification failed"
                },
                {
                    status: 400
                }
            );
        }

        const user = await UserModel.findById(_user._id);

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 400
                }
            );
        }

        user.subscriptionStatus = true;

        const currentDate = new Date();
        const futureDate = new Date(currentDate);
        futureDate.setDate(currentDate.getDate() + 30);

        user.subscriptionExpiry = futureDate;
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Subscription added successfully",
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.error("Error updating subscription status:", error);
        return Response.json(
            {
                success: false,
                message: "Error updating subscription status"
            },
            {
                status: 500
            }
        );
    }
}
