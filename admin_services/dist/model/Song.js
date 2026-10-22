// models/Song.ts
import mongoose, { Document, Schema, Types } from "mongoose";
const songSchema = new Schema({
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
        ref: "Album", // ✅ رابطه با مدل Album
        default: null,
    },
}, { timestamps: true });
export const Song = mongoose.model("Song", songSchema);
//# sourceMappingURL=Song.js.map