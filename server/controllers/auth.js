import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import createError from "../error.js";
import Users from "../models/users.js";

export const signin = async (req, res, next) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User Not found"));

    const isValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isValid) return next(createError(401, "Wrong Credentials"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    const { password, ...others } = user._doc;

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(others);
  } catch (err) {
    next(createError(500, "Something went wrong"));
  }
};

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new Users({ ...req.body, password: hash });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(201)
      .json(newUser);
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(user);
    } else {
      const newUser = new Users(req.body);
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(newUser._doc);
    }
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};
