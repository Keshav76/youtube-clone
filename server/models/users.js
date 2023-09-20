import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    imgUrl: {
      type: String,
      default: "",
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: {
      type: [String],
      default: [],
    },
    history: {
      type: [String],
      default: [],
    },
    liked: {
      type: [String],
      default: [],
    },
    userVideos: {
      type: [String],
      default: [],
    },
    watchLater: {
      type: [String],
      default: [],
    },
    playlist: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          videos: { type: [String], default: [] },
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
