import createError from "../error.js";
import Comment from "../models/comments.js";
import Video from "../models/videos.js";

export const createComment = async (req, res, next) => {
  try {
    const comm = new Comment({
      userId: req.id,
      videoId: req.params.videoId,
      desc: req.body.desc,
    });
    await comm.save();
    res.status(200).json(comm);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comm = await Comment.findOne({ _id: req.params.commentId });
    const video = await Video.findOne({ _id: comm.videoId });

    if (req.id === comm.userId || req.id === video.userId) {
      await Comment.findOneAndDelete({ _id: req.params.commentId });
      res.status(200).json("Successfully Deleted");
    } else return next(createError(400, "You cant delete this comment"));
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const data = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
