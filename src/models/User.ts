import mongoose, { Document, Schema, Types } from "mongoose";

export interface SongHistory extends Document {
    songId: string;
    playedAt: Date;
}

const songHistorySchema = new Schema<SongHistory>({
    songId: { type: String, required: true },
    playedAt: { type: Date, required: true, default: Date.now },
});

export interface Subscription extends Document {
    startDate: Date;
    endDate: Date;
}

const subscriptionSchema = new Schema<Subscription>({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

export interface User extends Document {
    name: string;
    username: string;
    email: string;
    image?: string;
    isVerified: boolean;
    subscriptionStatus: boolean;
    subscriptionExpiry: Date;
    lastAdPlayedAt: Date;
    subscription: Subscription[];
    songHistory: Types.DocumentArray<SongHistory>;
}

const userSchema: Schema<User> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            min: [3, "Name should be at least 3 characters long"],
            max: [30, "Name should be at most 30 characters long"],
            trim: true,
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            min: [5, "Username should be at least 5 characters long"],
            max: [20, "Username should be at most 20 characters long"],
            trim: true,
            match: [/^[a-zA-Z0-9_]+$/, "Please enter a valid username"],
        },
        email: {
            type: String,
            required: [true, "Email Address is required"],
            unique: true,
            trim: true,
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please Enter a Valid Email Address"],
        },
        image: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        subscriptionStatus: {
            type: Boolean,
            default: false,
        },
        subscriptionExpiry: {
            type: Date,
        },
        lastAdPlayedAt: {
            type: Date,
        },
        subscription: [subscriptionSchema],
        songHistory: [songHistorySchema],
    },
    {
        timestamps: true
    }
);

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default UserModel;
