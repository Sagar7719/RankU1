import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {

  try {

    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Not authorized");
    }

    const decoded =
      jwt.verify(token, process.env.JWT_SECRET);

    req.user =
      await User.findById(decoded.id).select("-password");

    next();

  } catch (error) {

    res.status(401);
    next(error);

  }

};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    next(new Error("Not authorized as an admin"));
  }
};