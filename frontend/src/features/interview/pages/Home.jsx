import React, { useEffect, useRef, useState } from "react";
import { Briefcase, User, UploadCloud, Info, Sparkles } from "lucide-react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";


const Home = () => {
  const { user, handleLogout } = useAuth();
  const { loading, generateReport, reports, getAllReports } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    getAllReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateReport = async () => {
    const resume = resumeInputRef.current.files[0];
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resume,
    });
    navigate(`/interview/${data._id}`);
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>loading your interview plan...</h1>
      </main>
    );
  }

  return (
    <main className="home-container">
      {/* Header Section */}
      <header className="home-header">
        <h1>
          Create Your Custom{" "}
          <span className="highlight-text">Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </header>

      {/* Main Content Card */}
      <div className="main-card">
        <div className="card-columns">
          {/* Left Column - Target Job Description */}
          <section className="left-col">
            <div className="section-header">
              <div className="title-wrap">
                <Briefcase size={18} className="icon-pink" />
                <h2>Target Job Description</h2>
              </div>
              <span className="badge-required">Required</span>
            </div>

            <div className="textarea-wrapper">
              <textarea
                name="jobDescription"
                id="jobDescription"
                placeholder="Paste the full job description here...&#10;e.g., 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={5000}
              ></textarea>
              <span className="char-count">
                {jobDescription.length} / 5000 chars
              </span>
            </div>
          </section>

          {/* Right Column - Your Profile */}
          <section className="right-col">
            <div className="section-header">
              <div className="title-wrap">
                <User size={18} className="icon-pink" />
                <h2>{user.userName}</h2>
              </div>
              <div className="logout-profile" onClick={handleLogout}>logout</div>
            </div>
            

            {/* Upload Resume Section */}
            <div className="upload-group">
              <label htmlFor="resume">
                Upload Resume{" "}
                <span className="best-results">(Best Results)</span>
              </label>
              <div className="drag-drop-zone">
                <UploadCloud size={28} className="upload-icon" />
                <p className="main-text">Click to upload or drag & drop</p>
                <p className="sub-text">PDF or DOCX (Max 5MB)</p>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf"
                  ref={resumeInputRef}
                />
              </div>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            {/* Self Description Section */}
            <div className="self-desc-group">
              <label htmlFor="selfDescription">Quick Self-Description</label>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              ></textarea>
            </div>

            {/* Info Alert */}
            <div className="info-alert">
              <Info size={16} className="info-icon" />
              <p>
                Either a <strong>Resume</strong> or a{" "}
                <strong>Self Description</strong> is required to generate a
                personalized plan.
              </p>
            </div>
          </section>
        </div>

        {/* Action Footer inside card */}
        <div className="card-footer">
          <span className="time-estimate">
            AI-Powered Strategy Generation • Approx 30s
          </span>
          <button
            className="generate-button"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            <Sparkles size={18} />
            Generate My Interview Strategy
          </button>
        </div>
      </div>

      {/* Recent Reports List */}
      {reports.length > 0 && (
        <section className="recent-reports">
          <h2>Your Recent Interview Plans</h2>
          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || "Untitled Position"}</h3>
                <p className="report-meta">
                  Generated On {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p
                  className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
                >
                  Match Score: {report.matchScore || 0}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Bottom Links */}
      <footer className="bottom-links">
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#help">Help Center</a>
      </footer>
    </main>
  );
};

export default Home;
