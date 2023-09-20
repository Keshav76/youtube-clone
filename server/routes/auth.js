import express from "express";
import { signin, google, signup, logout } from "../controllers/auth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/google", google);
router.get("/logout", logout);

export default router;
