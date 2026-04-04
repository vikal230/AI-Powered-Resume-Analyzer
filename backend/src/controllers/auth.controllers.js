import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
import blocklistModel from "../models/blocklist.model.js";
import interviewReportModel from "../models/interviewReport.model.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
};
//! register controller
/**
 * @name registerUserController
 * @description register a new user, expects userName, email and password in the required
 * @access public
 */
export const registerUserController = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ userName }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "account already exists with this userName or email",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      userName,
      email,
      password: hashpassword,
    });

    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "user created successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "error in registerUserController",
    });
  }
};

//! loginUserController
/**
 * @name loginUserController
 * @description login a user with email and password
 * @access public
 */
export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found with this email",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "user login in successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "error in loginUserController",
    });
  }
};

/**
 * @name logoutUserController
 * @description clear token from the cookie and add the token in blocklist
 * @access public
 */
export const logoutUserController = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token) {
      await blocklistModel.create({ token });
    }
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({
      success: true,
      message: "user logout out successfully",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "error in logoutUserController",
    });
  }
};

/**
 *@name getMeControllers
 *@description get the current logged in user details.
 @access private
 */
export const getMeController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    return res.status(200).json({
      success: true,
      message: "user fetched successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "error in getMeController",
    });
  }
};

