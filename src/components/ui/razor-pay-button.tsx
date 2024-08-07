import { useEffect, useState } from 'react';
import { Button } from './button';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';
import axios from 'axios';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function RazorpayButton() {
    const [paymentVerified, setPaymentVerified] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const openPayModal = async () => {
        if (!scriptLoaded) {
            toast({
                title: 'Error',
                description: "Razorpay script is still loading. Please try again."
            });
            return;
        }

        try {
            // First, create an order
            const orderRes = await axios.post('/api/v1/payment/create-order');
            const order = orderRes.data.order;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: order.amount,
                currency: order.currency,
                name: "Echo Music",
                description: "Echo Music Subscription",
                image: "/logo.svg",
                order_id: order.id, // This is important. It ensures you get all fields in the response
                handler: function (response: any) {
                    console.log(response);
                    verifyPayment(response)
                },
                notes: {
                    address: "Razorpay Corporate Office"
                },
                theme: {
                    color: "#020202"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error('Error creating order:', error);
            toast({
                title: 'Error',
                description: "Error creating payment order"
            });
        }
    }

    const verifyPayment = async (response: any) => {
        try {
            const res = await axios.post('/api/v1/payment/verify', {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.data.success) {
                setPaymentVerified(true);
                router.replace('/payment-success');
            } else {
                router.replace('/payment-error');
            }

        } catch (error) {
            console.error('Error verifying payment:', error);
            router.replace('/payment-error')
            toast({
                title: 'Error',
                description: "Error verifying payment"
            })
        }
    }

    return (
        <Button
            onClick={openPayModal}
            className='w-full'
            disabled={!scriptLoaded}
        >
            Pay with Razorpay
        </Button>
    );
}
