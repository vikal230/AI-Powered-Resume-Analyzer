import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReport,
  generateResumePdf,
} from "../services/interview.api";
import { useContext } from "react";
import { interviewContext } from "../interview.context";
import { useEffect } from "react";
import { useParams } from "react-router";


export const userInterview = () => {
  const context = useContext(interviewContext);
  const { interviewId } = useParams();

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
    let response = null;
    try {
      response = await generateInterviewReport({
        jobDescription,
        resumeFile,
        selfDescription,
      });
      setReport(response.interviewReport);
      return response.interviewReport;
      // setReports([...reports, response.interviewReport]);
    } catch (error) {
      console.log("frontend generateReport error aa gya hai!", error);
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
    } catch (error) {
      console.log("frontend getAllReport error aa rha hai!", error);
      throw error;
    } finally {
      setloading(false);
    }
    return response.interviewReports;
  };

  const getResumePdf = async (interviewReportId) => {
    setloading(true);

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
      return response;
    } catch (error) {
      console.log("frontend generateResume error aa gya hai!", error);
      throw error;
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getAllReports();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getAllReports,
    getReportById,
    getResumePdf,
    
  };
};
