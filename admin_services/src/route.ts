import express from 'express';
import uploadFile, { isAuth } from './middleware.js';
import { addAlbum, addSongs, addThumbnail, deleteAlbum, deleteSongs, editAlbums, editSong } from './controller.js';

const router = express.Router()

router.post('/album/new', isAuth, uploadFile, addAlbum)
// edit album
router.put('/album/:id', isAuth, uploadFile, editAlbums)
router.post('/song/new', isAuth, uploadFile, addSongs)
router.post('/song/thumbnail/:id', isAuth, uploadFile, addThumbnail)
// edit song
router.put('/song/:id', isAuth, uploadFile, editSong)
router.delete('/album/:id', isAuth, deleteAlbum)
router.delete('/song/:id', isAuth, deleteSongs)


export default router