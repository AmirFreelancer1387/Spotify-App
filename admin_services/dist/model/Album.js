// models/Album.ts
import mongoose, { Document, Schema } from "mongoose";
const albumSchema = new Schema({
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
}, { timestamps: true });
export const Album = mongoose.model("Album", albumSchema);
//# sourceMappingURL=Album.js.map