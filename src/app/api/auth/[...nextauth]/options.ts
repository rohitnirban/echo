import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                const { email, name, image } = user;
                try {
                    await dbConnect();

                    if (!email) {
                        throw new Error("Email is required")
                    }

                    let existingUser = await UserModel.findOne({ email });

                    if (!existingUser) {
                        existingUser = new UserModel({
                            email,
                            name,
                            image,
                            username: email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, ''),
                            isVerified: true,
                            subscriptionStatus: false,
                        });
                        await existingUser.save();
                    }

                    user._id = existingUser._id as string;
                    user.isVerified = existingUser.isVerified;
                    user.username = existingUser.username;
                    user.image = existingUser.image as string;
                    user.subscriptionStatus = existingUser.subscriptionStatus;
                    user.lastAdPlayedAt = existingUser.lastAdPlayedAt;

                    return true;
                } catch (error) {
                    console.error("Error during sign in:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id.toString();
                token.username = user.username;
                token.image = user.image;
                token.isVerified = user.isVerified;
                token.subscriptionStatus = user.subscriptionStatus;
                token.lastAdPlayedAt = user.lastAdPlayedAt;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.image = token.image;
                session.user.isVerified = token.isVerified;
                session.user.subscriptionStatus = token.subscriptionStatus;
                session.user.lastAdPlayedAt = token.lastAdPlayedAt;
            }
            return session;
        },
    },
    pages: {
        signIn: '/',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
};
