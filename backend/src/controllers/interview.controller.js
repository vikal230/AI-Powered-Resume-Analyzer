import { PDFParse } from "pdf-parse";
import generateInterviewReport from "../services/ai.services.js";
import { generateResumePdf } from "../services/ai.services.js";
import interviewReportModel from "../models/interviewReport.model.js";

/**
 * @description controller to generate report based on user self description, resume and job description
 */
export async function generateInterviewReportController(req, res) {
  try {
    let resumeContent = "";

    if (req.file && req.file.buffer) {
      const parser = new PDFParse({ data: req.file.buffer });
      const data = await parser.getText();
      await parser.destroy();
      resumeContent = data.text;
    }

    const { selfDescription, jobDescription } = req.body;

    if (!resumeContent && !selfDescription) {
      return res.status(400).json({
        success: false,
        message: "Either Resume or Self Description is required",
      });
    }
    //! call to AI services
    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    //! save new report in mongoDb database
    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    return res.status(201).json({
      success: true,
      message: "interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Error in generateInterviewReportController:", error);
    return res.status(500).json({
      success: false,
      message: "Server crashed while generating report",
      error: error.message,
    });
  }
}

/**
 * @description controller to get interview report by interviewId
 */
export const getInterviewReportByIdController = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findById(interviewId);

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "interview report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "interview report fetched successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Error in getInterviewReportByIdController:", error);
    return res.status(500).json({
      success: false,
      message: "error in fetching report by id",
      error: error.message,
    });
  }
};

/**
 * @description controller to get all interview reports of logged in user.
 */
export const getAllInterviewReportController = async (req, res) => {
  try {
    // FIX: 'findOne' ki jagah 'find' use kiya hai taaki user ki saari reports fetch ho jayein
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestion -behavioralQuestion -skillGap -preprationPlan",
      );

    return res.status(200).json({
      success: true,
      message: "interview reports fetched successfully",
      interviewReports,
    });
  } catch (error) {
    console.error("Error in getAllInterviewReportController:", error);
    return res.status(500).json({
      success: false,
      message: "error fetching all reports",
      error: error.message,
    });
  }
};

/**
 * @description controller to generate resume PDF based on user self description, resume and job description.
 */

export const generateResumePdfController = async (req, res) => {
  try {
    const { interviewReportId } = req.params;

    const interviewReport =
      await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "interview report not found",
      });
    }

    const { resume, selfDescription, jobDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({
      resume,
      selfDescription,
      jobDescription,
    });

    res.set({
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename_resume_${interviewReportId}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error in generateResumePdfController:", error);
  }
};

export default generateInterviewReportController;
