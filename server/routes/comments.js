import express from "express";
import verifyToken from "../verifyToken.js";

import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/comment.js";

const router = express.Router();

router.post("/create/:videoId", verifyToken, createComment);
router.delete("/delete/:commentId", verifyToken, deleteComment);
router.get("/get/:videoId", getComments);

export default router;
