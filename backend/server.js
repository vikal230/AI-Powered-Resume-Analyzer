import express from "express";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import interviewRoute from "./src/routes/interview.routes.js";
// import  generateInterviewReport  from "./src/services/ai.services.js";
// import {resume, jobDescription, selfDescription} from "./src/services/temp.js"
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
//! authentication api is here
//? http://localhost:/api/auth/register
app.use("/api/auth", authRoutes);
 
// app.use("/", (req,res) => {
//   res.send("server is running")
// })

//! interview api
app.use("/api/interview", interviewRoute)

const port = process.env.PORT || 5000;
app.listen(port, () => {
  connectDb();
  console.log(`server is running on port http://localhost:${port}`);
})