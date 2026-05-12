import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReport,
  generateResumePdf,
  deleteInterviewReport,
} from "../services/interview.api";
import { useContext } from "react";
import { interviewContext } from "../interview.context-instance";
import toast from "react-hot-toast";

export const useInterview = () => {
  const context = useContext(interviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an interviewProvider!");
  }
  const { loading, setloading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    resumeFile,
    selfDescription,
  }) => {
    setloading(true);
    const toastId = toast.loading("Generate your report");
    let response = null;
    try {
      response = await generateInterviewReport({
        jobDescription,
        resumeFile,
        selfDescription,
      });
      setReport(response.interviewReport);
      toast.success("Report generated successfully", { id: toastId });
      return response.interviewReport;
      // setReports([...reports, response.interviewReport]);
    } catch (error) {
      console.log("frontend generateReport error aa gya hai!", error);
      toast.error("Unable to generate report", { id: toastId });
      throw error;
    } finally {
      setloading(false);
    }
  };
  const getReportById = async (interviewId) => {
    setloading(true);
    let response = null;
    try {
      response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
      return response.interviewReport;
      // setReports([...reports, response.interviewReport]);
    } catch (error) {
      console.log("frontend getReportById error aa gya hai!", error);
      throw error;
    } finally {
      setloading(false);
    }
  };

  const getAllReports = async () => {
    setloading(true);
    let response = null;
    try {
      response = await getAllInterviewReport();
      setReports(response.interviewReports);
      return response.interviewReports;
    } catch (error) {
      if (error.response?.status === 401) {
        setReports([]);
        return [];
      }
      console.log("frontend getAllReport error aa rha hai!", error);
      throw error;
    } finally {
      setloading(false);
    }
  };

  const getResumePdf = async (interviewReportId) => {
    setloading(true);
    const toastId = toast.loading("Download your resume");

    try {
      const response = await generateResumePdf(interviewReportId);

      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `resume_${interviewReportId}${Date.now()}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      toast.success("Resume downloaded successfully", { id: toastId });
      return response;
    } catch (error) {
      console.log("frontend generateResume error aa gya hai!", error);
      toast.error("Unable to download resume", { id: toastId });
      throw error;
    } finally {
      setloading(false);
    }
  };

  const handleDeleteReport = async (interviewId) => {
    const toastId = toast.loading("Deleting report");
    try {
      await deleteInterviewReport(interviewId);
      setReports((prev) => prev.filter((item) => item._id !== interviewId));
      if (report?._id === interviewId) {
        setReport(null);
      }
      toast.success("Report deleted successfully", { id: toastId });
      return true;
    } catch (error) {
      console.log("frontend deleteReport error aa gya hai!", error);
      toast.error("Unable to delete report", { id: toastId });
      return false;
    }
  };

  return {
    loading,
    report,
    reports,
    generateReport,
    getAllReports,
    getReportById,
    getResumePdf,
    handleDeleteReport,
  };
};
