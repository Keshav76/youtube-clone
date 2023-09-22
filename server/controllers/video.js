import createError from "../error.js";
import Video from "../models/videos.js";
import User from "../models/users.js";
import jwt from "jsonwebtoken";

export const createVideo = async (req, res, next) => {
  try {
    const tags = req.body.tags.split(",");
    const video = new Video({ userId: req.id, ...req.body, tags });
    await video.save();
    await User.findOneAndUpdate(
      { _id: req.id },
      {
        $push: { userVideos: video._id },
      }
    );
    res.status(201).json(video);
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findOne({ _id: req.params.id });
    if (video.userId === req.id) {
      const updatedVideo = await Video.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else return next(createError(400, "You cant update this video"));
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findOne({ _id: req.params.id });
    if (video.userId === req.id) {
      await Video.findOneAndDelete({ _id: req.params.id });
      await User.findOneAndUpdate(
        { _id: req.id },
        { $pull: { userVideos: req.params.id } }
      );
      res.status(200).json("Successfully Deleted");
    } else return next(createError(400, "You cant delete this video"));
  } catch (err) {
    next(err);
  }
};

export const getVideos = async (req, res, next) => {
  try {
    const data = await Video.findOne({ _id: req.params.id });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  try {
    const data = jwt.verify(
      req.cookies.access_token,
      process.env.JWT_SECRET_KEY
    );
    req.id = data.id;
    next();
  } catch (err) {}
  try {
    await Video.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { views: 1 } }
    );
    if (req.id)
      await User.findOneAndUpdate(
        { _id: req.id },
        { $addToSet: { history: req.params.id } }
      );
    res.status(200).json("View Added");
  } catch (err) {
    next(err);
  }
};

export const getTrending = async (req, res, next) => {
  try {
    const data = await Video.find({}).sort({ views: -1 }).limit(20);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getRandom = async (req, res, next) => {
  try {
    const data = await Video.find({});
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getVideoFromSub = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.id });
    const subscribedUsers = user.subscribedUsers;

    const data = await Video.find({ userId: { $in: subscribedUsers } });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  try {
    const data = await Video.find({ title: { $regex: req.query.q } });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const searchTags = async (req, res, next) => {
  try {
    const data = await Video.find({ tags: { $in: req.query.q } });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getVideoByUser = async (req, res, next) => {
  try {
    const data = await Video.find({ userId: req.params.userId });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const addToWatchLater = async (req, res, next) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.id },
      { $push: { watchLater: req.params.id } }
    );
    res.status(200).json("Added to watch later");
  } catch (err) {
    next(err);
  }
};
