import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";

import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import videosRouter from "./routes/videos.js";
import commentsRouter from "./routes/comments.js";
import { errorHandler } from "./error.js";

dotenv.config();

const db_connect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to Database!"))
    .catch(() => console.log("Something went wrong!"));
};

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/videos", videosRouter);
app.use("/api/comments", commentsRouter);

app.use(errorHandler);

const PORT = process.env.SERVER_PORT || 3001;
app.listen(PORT, () => {
  db_connect();
  console.log(`Server started on port ${PORT}!`);
});
