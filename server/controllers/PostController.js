import Post from '../models/Post.js';

export const create = async (req, res) => {
  try {
    if (!req.accountID) {
      return res.status(400).json({ message: 'Account ID is missing' });
    }

    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.file ? req.file.path : '',
      tags: req.body.tags,
      account: req.accountID,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error while fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const testGet = (req, res) => {
  console.log('Test GET request received');
  res.status(200).json({ message: 'Test GET request successful' });
};
