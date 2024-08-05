import Razorpay from 'razorpay'

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
    key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(request: Request) {
    try {
        const options = {
            amount: 1900,
            currency: "INR",
            receipt: "receipt_order_" + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);

        console.log(order);

        return Response.json(
            {
                success: true,
                order
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error creating payment order"
            },
            {
                status: 400
            }
        )
    }
}
