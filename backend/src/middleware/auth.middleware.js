import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized: No Token" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({ message: "Not authorized: Invalid Token" });
    }

    const user = await User.findById(decodedToken.userID);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth Middleware Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
