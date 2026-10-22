import mongoose, { Document, Types } from "mongoose";
export interface ISong extends Document {
    title: string;
    description: string;
    thumbnail?: string;
    audio: string;
    album_id?: Types.ObjectId;
    createdAt: Date;
}
export declare const Song: mongoose.Model<ISong, {}, {}, {}, Document<unknown, {}, ISong, {}, mongoose.DefaultSchemaOptions> & ISong & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISong & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
//# sourceMappingURL=Song.d.ts.map