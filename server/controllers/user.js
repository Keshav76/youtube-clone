import bcrypt from "bcryptjs";

import User from "../models/users.js";
import Video from "../models/videos.js";
import createError from "../error.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return next(createError(404, "User not found"));

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.id === req.params.id) {
      if (req.body.password) {
        const salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(req.body.password, salt);
      }

      const updateUser = await User.findOneAndUpdate(
        { _id: req.id },
        { $set: req.body },
        { new: true }
      );
      const { password, ...others } = updateUser._doc;
      res.status(200).json(others);
    } else next(createError(403, "You can only update your account"));
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.id === req.params.id) {
      await User.deleteOne({ _id: req.params.id });
      res.status(200).json("Sucessfully deleted");
    } else next(createError(403, "You can only delete your account"));
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    const result = await User.findOne({ _id: req.id });

    if (result.subscribedUsers.includes(req.params.id))
      return next(createError(400, "You can not subscribe the channel again"));

    await User.findOneAndUpdate(
      { _id: req.id },
      {
        $push: { subscribedUsers: req.params.id },
      }
    );

    await User.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { subscribers: 1 } }
    );
    res.status(200).json("Subscribed");
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    const result = await User.findOne({ _id: req.id });

    if (!result.subscribedUsers.includes(req.params.id))
      return next(createError(400, "You are not subscribed to the channel"));

    await User.findOneAndUpdate(
      { _id: req.id },
      {
        $pull: { subscribedUsers: req.params.id },
      }
    );
    await User.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { subscribers: -1 } }
    );
    res.status(200).json("Unsubscribed");
  } catch (err) {
    next(err);
  }
};

export const history = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.id });
    const videos = [];
    for (let i = 0; i < user.history.length; i++) {
      videos.push(await Video.findById(user.history[i]));
    }
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const liked = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.id });
    const videos = [];
    for (let i = 0; i < user.liked.length; i++) {
      videos.push(await Video.findById(user.liked[i]));
    }
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const yourVideos = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.id });
    const videos = [];
    for (let i = 0; i < user.userVideos.length; i++) {
      videos.push(await Video.findById(user.userVideos[i]));
    }
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const userPlaylistsName = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.id });
    const playlists = [];
    for (let i = 0; i < user.playlist.length; i++) {
      playlists.push(user.playlist[i].name);
    }
    res.status(200).json(playlists);
  } catch (err) {
    next(err);
  }
};

export const playlistVideos = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.id });
    let videos = [];
    for (let i = 0; i < user.playlist.length; i++) {
      if (user.playlist[i].name === req.params.name) {
        for (let item of user.playlist[i].videos)
          videos.push(await Video.findById(item));
      }
    }
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const watchLater = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.id });
    const videos = [];
    for (let i = 0; i < user.watchLater.length; i++) {
      videos.push(await Video.findById(user.watchLater[i]));
    }
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const like = async (req, res, next) => {
  try {
    const result = await Video.findOne({ _id: req.params.videoId });

    if (result.likes.includes(req.id))
      return next(createError(400, "You have already liked the video"));

    await Video.findOneAndUpdate(
      { _id: req.params.videoId },
      {
        $push: { likes: req.id },
        $pull: { dislikes: req.id },
      }
    );
    await User.findOneAndUpdate(
      { _id: req.id },
      { $push: { liked: req.params.videoId } }
    );

    res.status(200).json("Liked");
  } catch (err) {
    next(err);
  }
};

export const unlike = async (req, res, next) => {
  try {
    const result = await Video.findOne({ _id: req.params.videoId });

    if (!result.likes.includes(req.id))
      return next(createError(400, "You have not liked the video"));

    await Video.findOneAndUpdate(
      { _id: req.params.videoId },
      {
        $pull: { likes: req.id },
      }
    );
    await User.findOneAndUpdate(
      { _id: req.id },
      { $pull: { liked: req.params.videoId } }
    );

    res.status(200).json("Unliked");
  } catch (err) {
    next(err);
  }
};

export const dislike = async (req, res, next) => {
  try {
    const result = await Video.findOne({ _id: req.params.videoId });

    if (result.dislikes.includes(req.id))
      return next(createError(400, "You have already disliked the video"));

    await Video.findOneAndUpdate(
      { _id: req.params.videoId },
      {
        $push: { dislikes: req.id },
        $pull: { likes: req.id },
      }
    );

    res.status(200).json("DisLiked");
  } catch (err) {
    next(err);
  }
};

export const undislike = async (req, res, next) => {
  try {
    const result = await Video.findOne({ _id: req.params.videoId });

    if (!result.dislikes.includes(req.id))
      return next(createError(400, "You have not disliked the video"));

    await Video.findOneAndUpdate(
      { _id: req.params.videoId },
      {
        $pull: { dislikes: req.id },
      }
    );

    res.status(200).json("Undisliked");
  } catch (err) {
    next(err);
  }
};

export const subscriberList = async (req, res, next) => {
  try {
    const user = await User.findById(req.id);
    let subs = [];
    for (let ele of user.subscribedUsers) {
      const u = await User.findById(ele);
      const data = {
        name: u.userId,
        id: u._id,
      };
      subs.push(data);
    }
    res.status(200).json(subs);
  } catch (err) {
    next(err);
  }
};
