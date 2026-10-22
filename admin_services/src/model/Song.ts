// models/Song.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISong extends Document {
    title: string;
    description: string;
    thumbnail?: string;
    audio: string;
    album_id?: Types.ObjectId;
    createdAt: Date;
}

const songSchema = new Schema<ISong>(
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
        },
        audio: {
            type: String,
            required: true,
        },
        album_id: {
            type: Schema.Types.ObjectId,
            ref: "Album",        // ✅ رابطه با مدل Album
            default: null,
        },
    },
    { timestamps: true }
);

export const Song = mongoose.model<ISong>("Song", songSchema);