import express from "express";

import verifyToken from "../verifyToken.js";
import {
  createVideo,
  updateVideo,
  deleteVideo,
  getVideos,
  addView,
  getTrending,
  getRandom,
  getVideoFromSub,
  search,
  searchTags,
  getVideoByUser,
  addToWatchLater,
} from "../controllers/video.js";

const router = express.Router();

router.post("/create", verifyToken, createVideo);
router.put("/update/:id", verifyToken, updateVideo);
router.delete("/delete/:id", verifyToken, deleteVideo);
router.get("/get/:id", getVideos);
router.put("/view/:id", verifyToken, addView);
router.get("/trending", getTrending);
router.get("/random", getRandom);
router.get("/sub", verifyToken, getVideoFromSub);
router.get("/search/name", search);
router.get("/search/tags", searchTags);
router.get("/user-video/:userId", getVideoByUser);
router.put("/watch-later/:id", verifyToken, addToWatchLater);

export default router;
