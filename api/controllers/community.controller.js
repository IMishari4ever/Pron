import Community from "../models/community.model.js";

export const createPost = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const creator = req.userId;
     const communityPost = new Community({
    createdBy: req.userId,
    ...req.body,
  });
    const savedPost = await communityPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Community.findById(id).populate('createdBy');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Community.find().populate('createdBy');
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};