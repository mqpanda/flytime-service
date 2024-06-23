import Post from '../models/Post.js';

export const create = async (req, res) => {
  try {
    if (!req.accountID) {
      return res.status(400).json({ message: 'Account ID is missing' });
    }

    // Parse the tags as JSON if it's a string
    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : JSON.parse(req.body.tags);

    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.file ? req.file.path : '',
      tags: tags,
      account: req.accountID, // Associate the post with the logged-in user
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
    const posts = await Post.find().populate('account', 'email'); // Populate the 'account' field with the 'email'
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

export const getPostsByAccount = async (req, res) => {
  try {
    if (!req.accountID) {
      return res.status(400).json({ message: 'Account ID is missing' });
    }

    const posts = await Post.find({ account: req.accountID }).populate(
      'account',
      'email'
    );
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error while fetching posts by account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Ваш файл с контроллерами (например, postsController.js)

// In your postsController.js
// In your postsController.js
export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    console.log('Post ID:', postId); // Log the postId to check if it's undefined

    if (!postId) {
      return res.status(400).json({ message: 'Post ID is missing' });
    }

    // Найдем пост по ID
    const post = await Post.findById(postId).populate('account', 'email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Error while fetching post by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const increaseViews = async (req, res) => {
  try {
    const postId = req.params.id;

    // Найдем пост по ID и увеличим счетчик просмотров
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ viewsCount: post.viewsCount });
  } catch (error) {
    console.error('Error while increasing views:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// In your postsController.js
export const deletePostById = async (req, res) => {
  try {
    const postId = req.params.id;

    // Delete the post by ID
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error while deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// In your postsController.js

export const updatePostById = async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if the post exists
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is authorized to update the post
    if (!req.accountID || existingPost.account.toString() !== req.accountID) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Parse the tags as JSON if it's a string
    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : JSON.parse(req.body.tags);

    // Update the post
    existingPost.title = req.body.title;
    existingPost.text = req.body.text;
    existingPost.tags = tags;
    if (req.file) {
      existingPost.imageUrl = req.file.path;
    }

    const updatedPost = await existingPost.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error while updating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
