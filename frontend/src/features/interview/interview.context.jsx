import { useState } from "react";
import { interviewContext as InterviewContext } from "./interview.context-instance";

export const InterviewProvider = ({ children }) => {
  const [loading, setloading] = useState(false);
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);

  return (
    <InterviewContext.Provider
      value={{ loading, setloading, report, setReport, reports, setReports }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
