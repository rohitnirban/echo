import mongoose, { Document, Schema, Types, model } from "mongoose";
import { Song, songSchema } from "./Song";

export interface Playlist extends Document {
    name: string;
    user: Types.ObjectId;
    songs: Song[];
}

const playlistSchema: Schema<Playlist> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "User is required"]
        },
        name: {
            type: String,
            required: [true, "Playlist name is required"],
            minlength: [3, "Playlist name should be at least 3 characters long"],
            maxlength: [30, "Playlist name should be at most 30 characters long"],
            trim: true,
        },
        songs: [songSchema]
    },
    {
        timestamps: true
    }
);

const PlaylistModel = (mongoose.models.playlistSchema as mongoose.Model<Playlist>) || (mongoose.model<Playlist>("Playlist", playlistSchema));

export default PlaylistModel;
