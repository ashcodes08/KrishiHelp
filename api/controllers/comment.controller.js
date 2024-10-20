import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, 'You are not allowed to create this comment')
      );
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    //find the comment to be liked
    const comment = await Comment.findById(req.params.commentId);
    //return apt error if comment is not found
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    //check if user has already liked the comment or not
    const userIndex = comment.likes.indexOf(req.user.id);

    //if user has not liked the comment increase like count
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      //else dislike the comment that is remove the like
      comment.numberOfLikes -= 1;
      //deleting the user using splice
      comment.likes.splice(userIndex, 1);
    }
    //save the updated liked or disliked set of users
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    if (comment.userId !== req.user.id && !req.user.isFarmer) {
      return next(
        errorHandler(403, 'You are not allowed to edit this comment')
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    if (comment.userId !== req.user.id && !req.user.isFarmer) {
      return next(
        errorHandler(403, 'You are not allowed to delete this comment')
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json('Comment has been deleted');
  } catch (error) {
    next(error);
  }
};


export const getcomments = async (req, res, next) => {
  if (!req.user.isFarmer)
    return next(errorHandler(403, 'You are not allowed to get all comments'));

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;

    // Step 1: Find all post IDs created by the current user
    const userPosts = await Post.find({ userId: req.user.id }).select('_id');

    // Extract the IDs of the user's posts
    const postIds = userPosts.map(post => post._id);

    // Step 2: Find comments related to the user's posts
    const comments = await Comment.find({ postId: { $in: postIds } })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Get total comment count for user's posts
    const totalComments = await Comment.countDocuments({
      postId: { $in: postIds },
    });

    // Step 3: Optionally, get comments from the last month
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      postId: { $in: postIds },
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};