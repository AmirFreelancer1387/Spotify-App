import type { Request } from "express";
import TryCatch from "./TryCatch.js";
import getBuffer from "./config/dataUri.js";
import { v2 as cloudinary } from 'cloudinary'

interface AuthenticateRequesrt extends Request {
    user?: {
        _id: string;
        role: string
    }
}

export const addAlbume = TryCatch(async (req: AuthenticateRequesrt, res) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({
            message: 'شما دسترسی ادمین ندارید'
        })
        return
    }

    const { title, description } = req.body

    const file = req.file

    if (!file) {
        res.status(403).json({
            message: 'فایلی برای آپلود ارسال نشده است'
        })
        return
    }

    const fileBuffer = getBuffer(file)

    if (!fileBuffer) {
        res.status(500).json({
            message: 'Failed to genarate file buffer'
        })
        return
    }

    const result = await cloudinary.uploader.upload(fileBuffer, {
        folder: 'albums'
    }
    );
})