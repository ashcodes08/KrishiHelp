import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";



export const create = async (req, res, next) => {
    //only allow admins to create post
    
    if (!req.user.isFarmer) {
      return next(errorHandler(403, 'You are not allowed to create a post'));
    }

    //check for missing content
    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    //generating a slug for each post
    const slug = req.body.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

      //creating new post
    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
    });
    try {
        //sending json response to frontend
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error) {
      next(error);
    }
  };
  

  export const getposts = async (req, res, next) => {
    try {
      //where should the poss start from
      const startIndex = parseInt(req.query.startIndex) || 0;
      //how many posts need to be there
      const limit = parseInt(req.query.limit) || 9;
      //how should the posts be sorted based on user request
      const sortDirection = req.query.order === 'asc' ? 1 : -1;

      //finding of posts based on userId,category,slug,postId
      const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      })
      //sorting the posts found based on updatedAt time
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        //limiting the no of posts
        .limit(limit);
  

      //counting the total number of posts
      const totalPosts = await Post.countDocuments();
      
      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      //displaying all posts posted in the last month
      const lastMonthPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
      //sending json response
      res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts,
      });
    } catch (error) {
      next(error);
    }
  };


  export const deletepost = async (req, res, next) => {
    if (!req.user.isFarmer || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this post'));
    }
    try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json('The post has been deleted');
    } catch (error) {
      next(error);
    }
  };

  export const updatepost = async (req, res, next) => {
    if (!req.user.isFarmer || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this post'));
    }
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
          },
        },
        { new: true }
      );
      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  };