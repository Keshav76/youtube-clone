import jwt from "jsonwebtoken";
import createError from "./error.js";

const verifyToken = (req, res, next) => {
  try {
    const data = jwt.verify(
      req.cookies.access_token,
      process.env.JWT_SECRET_KEY
    );
    req.id = data.id;
    next();
  } catch (err) {
    next(createError(401, "Login first"));
  }
};

export default verifyToken;
