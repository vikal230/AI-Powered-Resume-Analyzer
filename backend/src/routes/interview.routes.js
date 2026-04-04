import express from "express";
import { generateInterviewReportController } from "../controllers/interview.controller.js";
import upload from "../middleware/file.middleware.js";
import { authUser } from "../middleware/auth.middleware.js";
import {
  getInterviewReportByIdController,
  getAllInterviewReportController,
} from "../controllers/interview.controller.js";
import { generateResumePdfController } from "../controllers/interview.controller.js";

const interviewRoute = express.Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description, resume pdf and job description
 * @access public
 */
interviewRoute.post(
  "/",
  authUser,
  upload.single("resume"),
  generateInterviewReportController,
);

/**
 * @route Get/api/interview/report/:interviewId
 * @description get interview report by interview
 * @access private
 */
interviewRoute.get("/report/:interviewId", authUser, getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRoute.get("/", authUser, getAllInterviewReportController)

/**
 * @route post/api/interview/resume/pdf
 * @description generate resume pdf on the bashic of user self description resume and job description
 * @access private
 */

interviewRoute.post(
  "/resume/pdf/:interviewReportId",
  authUser,
  generateResumePdfController,
);

export default interviewRoute;