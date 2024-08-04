import mongoose, { Document, Schema, Types } from "mongoose";


export interface Library extends Document {
    user: Types.ObjectId;
    songs: string[];
}

const librarySchema: Schema<Library> = new Schema(
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

const LibraryModel = (mongoose.models.Library as mongoose.Model<Library>) || (mongoose.model<Library>("Library", librarySchema));

export default LibraryModel;
