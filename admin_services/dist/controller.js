import TryCatch from "./TryCatch.js";
import getBuffer from "./config/dataUri.js";
import { v2 as cloudinary } from "cloudinary";
import { Album } from "./model/Album.js";
import { Song } from "./model/Song.js";
// ✅ ساخت آلبوم جدید
export const addAlbum = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "شما دسترسی ادمین ندارید",
        });
        return;
    }
    const { title, description } = req.body;
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "فایلی برای آپلود ارسال نشده است",
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer) {
        res.status(500).json({
            message: "Failed to generate file buffer",
        });
        return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer, {
        folder: "albums",
    });
    // ✅ INSERT INTO albums → Album.create()
    const album = await Album.create({
        title,
        description,
        thumbnail: cloud.secure_url,
    });
    res.json({
        message: "آلبوم با موفقیت ساخته شد",
        album,
    });
});
// ✅ ساخت آهنگ جدید
export const addSongs = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(403).json({
            message: "شما دسترسی ادمین ندارید",
        });
        return;
    }
    const { title, description, album } = req.body;
    // ✅ SELECT * FROM albums WHERE id → Album.findById()
    const isAlbum = await Album.findById(album);
    if (!isAlbum) {
        res.status(404).json({
            message: "آلبومی با این شناسه پیدا نشد",
        });
        return;
    }
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "فایلی برای آپلود ارسال نشده است",
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer) {
        res.status(500).json({
            message: "Failed to generate file buffer",
        });
        return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer, {
        folder: "songs",
        resource_type: "video",
    });
    // ✅ INSERT INTO songs → Song.create()
    await Song.create({
        title,
        description,
        audio: cloud.secure_url,
        album_id: album,
    });
    res.json({
        message: "آهنگ با موفقیت ساخته شد",
    });
});
// ✅ اضافه کردن کاور آهنگ
export const addThumbnail = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(403).json({
            message: "شما دسترسی ادمین ندارید",
        });
        return;
    }
    // ✅ SELECT * FROM songs WHERE id → Song.findById()
    const song = await Song.findById(req.params.id);
    if (!song) {
        res.status(404).json({
            message: "آهنگی با این شناسه پیدا نشد",
        });
        return;
    }
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "فایلی برای آپلود ارسال نشده است",
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer) {
        res.status(500).json({
            message: "Failed to generate file buffer",
        });
        return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer);
    // ✅ UPDATE songs SET thumbnail ... RETURNING * → findByIdAndUpdate() + { new: true }
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, { thumbnail: cloud.secure_url }, { new: true });
    res.json({
        message: "کاور با موفقیت اضافه شد",
        song: updatedSong,
    });
});
// ✅ حذف آلبوم + آهنگ‌های مرتبط
export const deleteAlbum = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "شما دسترسی ادمین ندارید",
        });
        return;
    }
    const { id } = req.params;
    // ✅ SELECT * FROM albums WHERE id → Album.findById()
    const isAlbum = await Album.findById(id);
    if (!isAlbum) {
        res.status(404).json({ message: "آلبومی با این شناسه پیدا نشد" });
        return;
    }
    // ✅ از _id خود آبجکت استفاده می‌کنیم، نه string پارامتر
    await Song.deleteMany({ album_id: isAlbum._id });
    await Album.findByIdAndDelete(id);
    res.json({ message: "آلبوم با موفقیت حذف شد" });
});
// ✅ حذف آهنگ
export const deleteSongs = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "شما دسترسی ادمین ندارید",
        });
        return;
    }
    const { id } = req.params;
    // ✅ SELECT * FROM songs WHERE id → Song.findById()
    const song = await Song.findById(id);
    if (!song) {
        res.status(404).json({
            message: "آهنگی با این شناسه پیدا نشد",
        });
        return;
    }
    // ✅ DELETE FROM songs WHERE id → Song.findByIdAndDelete()
    await Song.findByIdAndDelete(id);
    res.json({
        message: "آهنگ با موفقیت حذف شد",
    });
});
export const editAlbums = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "شما دسترسی ادمین ندارید",
        });
        return;
    }
    const { id } = req.params;
    const { title, description } = req.body;
    const isAlbum = await Album.findById(id);
    if (!isAlbum) {
        res.status(404).json({
            message: "آلبومی با این شناسه پیدا نشد",
        });
        return;
    }
    let thumbnailUrl = isAlbum.thumbnail; // مقدار قدیمی رو نگه دار
    if (req.file) {
        const fileBuffer = getBuffer(req.file);
        if (!fileBuffer) {
            res.status(500).json({
                message: "Failed to generate file buffer",
            });
            return;
        }
        const cloud = await cloudinary.uploader.upload(fileBuffer, {
            folder: "albums",
        });
        thumbnailUrl = cloud.secure_url;
    }
    const updatedAlbum = await Album.findByIdAndUpdate(id, {
        ...(title && { title }),
        ...(description && { description }),
        thumbnail: thumbnailUrl,
    }, { new: true });
    res.json({
        message: "آلبوم با موفقیت ویرایش شد",
        album: updatedAlbum,
    });
});
export const editSong = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "شما دسترسی ادمین ندارید",
        });
        return;
    }
    const { id } = req.params;
    const { title, description, album } = req.body;
    const isSong = await Song.findById(id);
    if (!isSong) {
        res.status(404).json({
            message: "آهنگی با این شناسه پیدا نشد",
        });
        return;
    }
    // ✅ اگر album_id جدید فرستاده شد، چک کن آلبوم وجود داره
    if (album) {
        const isAlbum = await Album.findById(album);
        if (!isAlbum) {
            res.status(404).json({
                message: "آلبومی با این شناسه پیدا نشد",
            });
            return;
        }
    }
    // ✅ اگر فایل صوتی جدید آپلود شد، آپدیت کن
    let audioUrl = isSong.audio;
    if (req.file) {
        const fileBuffer = getBuffer(req.file);
        if (!fileBuffer) {
            res.status(500).json({
                message: "Failed to generate file buffer",
            });
            return;
        }
        const cloud = await cloudinary.uploader.upload(fileBuffer, {
            folder: "songs",
            resource_type: "video",
        });
        audioUrl = cloud.secure_url;
    }
    const updatedSong = await Song.findByIdAndUpdate(id, {
        ...(title && { title }),
        ...(description && { description }),
        ...(album && { album_id: album }),
        audio: audioUrl,
    }, { new: true });
    res.json({
        message: "آهنگ با موفقیت ویرایش شد",
        song: updatedSong,
    });
});
//# sourceMappingURL=controller.js.map