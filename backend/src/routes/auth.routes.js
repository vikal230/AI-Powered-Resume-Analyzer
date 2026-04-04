import { Router } from "express";
import {
  getMeController,
  loginUserController,
  logoutUserController,
  registerUserController,
} from "../controllers/auth.controllers.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRoutes = Router();

/**
 * @route post/api/auth/register
 * @description register a new user
 * @access public
 */
authRoutes.post("/register", registerUserController);

/**
 * @route post/api/auth/login
 * @description login a user
 * @access public
 */
authRoutes.post("/login", loginUserController);

/**
 * @route get/api/auth/logout
 * @description clear token from user cookie and add the token
 * @access public
 */
authRoutes.get("/logout", logoutUserController);

/**
 * @route get /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRoutes.get("/get-me", authUser, getMeController)
export default authRoutes;
