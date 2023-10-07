import express from "express";
import verifyToken from "../verifyToken.js";

import {
  getUser,
  updateUser,
  deleteUser,
  subscribe,
  unsubscribe,
  history,
  yourVideos,
  watchLater,
  liked,
  like,
  unlike,
  dislike,
  undislike,
  userPlaylistsName,
  playlistVideos,
  subscriberList,
} from "../controllers/user.js";

const router = express.Router();

router.get("/find/:id", getUser);
router.post("/update/:id", verifyToken, updateUser);
router.post("/delete/:id", verifyToken, deleteUser);
router.post("/subscribe/:id", verifyToken, subscribe);
router.post("/unsubscribe/:id", verifyToken, unsubscribe);
router.get("/history", verifyToken, history);
router.get("/user-videos", verifyToken, yourVideos);
router.get("/liked", verifyToken, liked);
router.get("/playlists", verifyToken, userPlaylistsName);
router.get("/playlists/:name", verifyToken, playlistVideos);
router.get("/watch-later", verifyToken, watchLater);
router.post("/like/:videoId", verifyToken, like);
router.post("/unlike/:videoId", verifyToken, unlike);
router.post("/dislike/:videoId", verifyToken, dislike);
router.post("/undislike/:videoId", verifyToken, undislike);
router.get("/subscribers", verifyToken, subscriberList);

export default router;
