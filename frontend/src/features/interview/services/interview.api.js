import { api } from "../../../services/api";

/**
 * @description service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({
  jobDescription,
  resumeFile,
  selfDescription,
}) => {
  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    const response = await api.post("/api/interview", formData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("frontend generateInterviewReport error aa gya hai!", error);
    throw error;
  }
};

/**
 * @description service to get interview report by interviewId
 */
export const getInterviewReportById = async (interviewId) => {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
  } catch (error) {
    console.log("frontend getInterviewReport error aa gya hai!", error);
    throw error;
  }
};

/**
 * @description service to get all interview reports of logged in user.
 */
export const getAllInterviewReport = async () => {
  try {
    const response = await api.get("/api/interview");
    return response.data;
  } catch (error) {
    console.log("frontend getAllInterviewReport error aa gya hai!", error);
    throw error;
  }
};

/**
 * @description service to generate resume pdf based on user self description resume and job description.
 */
export const generateResumePdf = async (interviewReportId) => {
  try {
    const response = await api.post(
      `/api/interview/resume/pdf/${interviewReportId}`,
      {},
      {
        responseType: "blob",
      },
    );
    return response.data;
  } catch (error) {
    console.log("frontend generateResumePdf error aa gya hai!", error);
    throw error;
  }
};

export const deleteInterviewReport = async (interviewId) => {
  try {
    const response = await api.delete(`/api/interview/${interviewId}`);
    return response.data;
  } catch (error) {
    console.log("frontend deleteInterviewReport error aa gya hai!", error);
    throw error;
  }
};
