import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const POSTS_PER_PAGE = 8;

export const getPosts = async (req, res) => {
  try {
    // Clamp the page so a junk or out-of-range ?page never yields a negative
    // skip or an empty list the UI can't navigate back from.
    const total = await PostMessage.countDocuments();
    const numberOfPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
    const requested = Number(req.query.page);
    const currentPage = Number.isInteger(requested) && requested > 0
      ? Math.min(requested, numberOfPages)
      : 1;

    const data = await PostMessage.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE);

    res.status(200).json({ data, currentPage, numberOfPages, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { title, message, tags, selectedFile } = req.body;

  try {
    const newPost = new PostMessage({
      title,
      message,
      tags,
      selectedFile,
      creator: req.userId,
      name: req.userName,
      createdAt: new Date(),
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const { title, message, tags, selectedFile } = req.body;

  try {
    if (!isValidId(_id)) return res.status(404).json({ message: 'No post with that id' });

    const post = await PostMessage.findById(_id);
    if (!post) return res.status(404).json({ message: 'No post with that id' });

    if (post.creator !== req.userId)
      return res.status(403).json({ message: 'You can only edit your own memories.' });

    const updatedPost = await PostMessage.findByIdAndUpdate(
      _id,
      { title, message, tags, selectedFile },
      { new: true, runValidators: true }
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  try {
    if (!isValidId(_id)) return res.status(404).json({ message: 'No post with that id' });

    const post = await PostMessage.findById(_id);
    if (!post) return res.status(404).json({ message: 'No post with that id' });

    if (post.creator !== req.userId)
      return res.status(403).json({ message: 'You can only delete your own memories.' });

    await PostMessage.findByIdAndDelete(_id);

    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  try {
    if (!isValidId(_id)) return res.status(404).json({ message: 'No post with that id' });

    const post = await PostMessage.findById(_id);
    if (!post) return res.status(404).json({ message: 'No post with that id' });

    const index = post.likes.findIndex((id) => id === req.userId);

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== req.userId);
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(
      _id,
      { likes: post.likes },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
