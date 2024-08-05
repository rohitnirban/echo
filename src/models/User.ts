import mongoose, { Document, Schema } from "mongoose";


export interface Subscription extends Document {
    startDate: Date
    endDate: Date
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
    totalListeningTimeInSeconds: number;
    lastAdPlayedAt: Date;
    lastPlayedSongId: string;
    subscription: Subscription[];
    recentSongs: string[];
}

const userSchema: Schema<User> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            min: [3, "Name should be atleast 3 charcters long"],
            max: [30, "Name should be atmost 30 charcters long"],
            trim: true,
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            min: [5, "Username should be atleast 5 charcters long"],
            max: [20, "Username should be atmost 20 charcters long"],
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
            required: [true, "Profile Image is required"],
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
        totalListeningTimeInSeconds: {
            type: Number,
            default: 0
        },
        lastAdPlayedAt: {
            type: Date,
        },
        lastPlayedSongId: {
            type: String
        },
        subscription: [subscriptionSchema],
        recentSongs:[
            {
                type:String,
            }
        ]
    },
    {
        timestamps: true
    }
)

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema));

export default UserModel;