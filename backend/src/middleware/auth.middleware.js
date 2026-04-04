import jwt from "jsonwebtoken";
import blocklistModel from "../models/blocklist.model.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "token not provided" });
    }

    const tokenInBlocklist = await blocklistModel.findOne({ token });
    if (tokenInBlocklist) {
      return res.status(401).json({ message: "token is in blocklist" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "invalid token" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};
