import mongoose, { Document, Schema } from "mongoose";

export interface Song extends Document{
    id: string;
    name: string;
    artists: { primary: { name: string }[] };
    image: { url: string }[];
    downloadUrl: { url: string }[];
    duration?: number;
}

export const songSchema: Schema<Song> = new Schema(
    {
        id: {
            type: String,
            required: [true, "Song ID is required"]
        },
        name: {
            type: String,
            required: [true, "Song name is required"]
        },
        artists: {
            primary: [{
                name: {
                    type: String,
                    required: [true, "Artist name is required"]
                }
            }]
        },
        image: [{
            url: {
                type: String,
                required: [true, "Image URL is required"]
            }
        }],
        downloadUrl: [{
            url: {
                type: String,
                required: [true, "Download URL is required"]
            }
        }],
        duration: {
            type: Number
        }
    }
);


const SongModel = (mongoose.models.songSchema as mongoose.Model<Song>) || (mongoose.model<Song>("Song", songSchema));

export default SongModel;
