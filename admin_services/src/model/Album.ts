// models/Album.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IAlbum extends Document {
    title: string;
    description: string;
    thumbnail: string;
    createdAt: Date;
}

const albumSchema = new Schema<IAlbum>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Album = mongoose.model<IAlbum>("Album", albumSchema);