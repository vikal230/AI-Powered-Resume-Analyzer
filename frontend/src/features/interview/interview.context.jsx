import { createContext, useState } from "react";

export const interviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [loading, setloading] = useState(false);
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);

  return (
    <interviewContext.Provider
      value={{ loading, setloading, report, setReport, reports, setReports }}
    >
      {children}
    </interviewContext.Provider>
  );
};