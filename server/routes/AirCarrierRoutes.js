import express from 'express';
import multer from 'multer';
import { checkAuth } from '../middlewares/index.js';
import { checkUserRole } from '../middlewares/roleMiddleware.js';
import { PostController } from '../controllers/index.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set the file name to be unique
  },
});

const upload = multer({ storage: storage });

router.post(
  '/api/post/add',
  checkAuth,
  checkUserRole(['air carrier', 'user', 'admin']),
  upload.single('imageUrl'),
  PostController.create
);

router.get('/api/post', PostController.getAllPosts);

export default router;
