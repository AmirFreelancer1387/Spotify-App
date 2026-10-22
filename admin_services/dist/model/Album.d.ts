import mongoose, { Document } from "mongoose";
export interface IAlbum extends Document {
    title: string;
    description: string;
    thumbnail: string;
    createdAt: Date;
}
export declare const Album: mongoose.Model<IAlbum, {}, {}, {}, Document<unknown, {}, IAlbum, {}, mongoose.DefaultSchemaOptions> & IAlbum & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAlbum & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
//# sourceMappingURL=Album.d.ts.map