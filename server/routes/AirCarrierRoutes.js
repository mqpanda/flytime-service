import express from 'express';
import multer from 'multer';
import { checkAuth } from '../middlewares/index.js';
import { checkUserRole } from '../middlewares/roleMiddleware.js';
import { PostController } from '../controllers/index.js';
import { fileURLToPath, URL } from 'url';
import { dirname, join } from 'path';
import {
  deletePostById,
  getPostsByAccount,
  updatePostById,
} from '../controllers/PostController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Serve static files from the 'uploads' directory
router.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

router.post(
  '/api/post/add',
  checkAuth,
  checkUserRole(['air carrier', 'admin']),
  upload.single('imageUrl'),
  PostController.create
);

router.get(
  '/api/posts-by-account',
  checkAuth,
  checkUserRole(['air carrier', 'admin']),
  getPostsByAccount
);

router.get('/api/posts', PostController.getAllPosts);

router.get('/api/posts/:id', PostController.getPostById);

router.post('/api/posts/:id/views', PostController.increaseViews);

router.delete(
  '/api/posts/:id',
  checkAuth,
  checkUserRole(['air carrier', 'admin']),
  deletePostById
);

router.put(
  '/api/posts/:id',
  checkAuth,
  checkUserRole(['air carrier', 'admin']),
  upload.single('imageUrl'),
  updatePostById
);
export default router;
