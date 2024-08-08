import mongoose, { Document, Schema, Types } from "mongoose";


export interface Favourite extends Document {
    user: Types.ObjectId;
    songs: string[];
}

const favouriteSchema: Schema<Favourite> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "User is required"]
        },
        songs: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true
    }
);

const FavouriteModel = (mongoose.models.Favourite as mongoose.Model<Favourite>) || (mongoose.model<Favourite>("Favourite", favouriteSchema));

export default FavouriteModel;
