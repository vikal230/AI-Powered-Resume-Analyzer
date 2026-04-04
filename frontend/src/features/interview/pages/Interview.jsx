import React, { useState, useEffect } from "react";
import { Code, MessageSquare, Map, ChevronDown } from "lucide-react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useParams } from "react-router";
import { RiGeminiFill } from "react-icons/ri";

const Interview = () => {
  const [activeTab, setActiveTab] = useState("technical");
  const [openBehavIndex, setOpenBehavIndex] = useState(0);
  const [openTechIndex, setOpenTechIndex] = useState(0);
  const { report, getReportById, getResumePdf } = useInterview();
  const { interviewId } = useParams();

  useEffect(() => {
    if (interviewId && !report) {
      getReportById(interviewId);
    }
  }, [interviewId, report, getReportById]);

  if (!report) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Loading your interview plan...
      </div>
    );
  }
  // Helper function for score ring color
  const getScoreClass = (score) => {
    if (score >= 80) return "score--high";
    if (score >= 50) return "score--mid";
    return "score--low";
  };

  return (
    <div className="interview-page">
      <div className="interview-layout">
        {/* --- LEFT NAVIGATION --- */}
        <nav className="interview-nav">
          <div>
            <div className="interview-nav__label">Sections</div>
            <button
              className={`interview-nav__item ${activeTab === "technical" ? "interview-nav__item--active" : ""}`}
              onClick={() => setActiveTab("technical")}
            >
              <span className="interview-nav__icon">
                <Code size={18} />
              </span>
              Technical Questions
            </button>
            <button
              className={`interview-nav__item ${activeTab === "behavioral" ? "interview-nav__item--active" : ""}`}
              onClick={() => setActiveTab("behavioral")}
            >
              <span className="interview-nav__icon">
                <MessageSquare size={18} />
              </span>
              Behavioral Questions
            </button>
            <button
              className={`interview-nav__item ${activeTab === "roadmap" ? "interview-nav__item--active" : ""}`}
              onClick={() => setActiveTab("roadmap")}
            >
              <span className="interview-nav__icon">
                <Map size={18} />
              </span>
              Preparation Road Map
            </button>
          </div>
          <button
            className="gemini-btn"
            onClick={() => {
              getResumePdf(interviewId);
            }}
          >
            <RiGeminiFill className="gemini-icon" size={35} />
            <span>Dawnload Ai Resume</span>
          </button>
        </nav>

        <div className="interview-divider"></div>

        {/* --- CENTER CONTENT --- */}
        <main className="interview-content">
          {/* TECHNICAL QUESTIONS TAB */}
          {activeTab === "technical" && (
            <section>
              <header className="content-header">
                <h2>Technical Questions</h2>
                <span className="content-header__count">
                  {report.technicalQuestion.length} Items
                </span>
              </header>

              <div className="q-list">
                {report.technicalQuestion.map((item, index) => {
                  const isOpen = openTechIndex === index;
                  return (
                    <div className="q-card" key={index}>
                      <div
                        className="q-card__header"
                        onClick={() => setOpenTechIndex(isOpen ? null : index)} // Toggle logic
                      >
                        <span className="q-card__index">Q{index + 1}</span>
                        <h3 className="q-card__question">{item.question}</h3>
                        <ChevronDown
                          className={`q-card__chevron ${isOpen ? "q-card__chevron--open" : ""}`}
                          size={20}
                        />
                      </div>

                      {isOpen && (
                        <div className="q-card__body">
                          <div className="q-card__section">
                            <span className="q-card__tag q-card__tag--intention">
                              Intention
                            </span>
                            <p>{item.intention}</p>
                          </div>
                          <div className="q-card__section">
                            <span className="q-card__tag q-card__tag--answer">
                              Model Answer
                            </span>
                            <p>{item.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* BEHAVIORAL QUESTIONS TAB */}
          {activeTab === "behavioral" && (
            <section>
              <header className="content-header">
                <h2>Behavioral Questions</h2>
                <span className="content-header__count">
                  {report.behavioralQuestion.length} Items
                </span>
              </header>

              <div className="q-list">
                {report.behavioralQuestion.map((item, index) => {
                  const isOpen = openBehavIndex === index;
                  return (
                    <div className="q-card" key={index}>
                      <div
                        className="q-card__header"
                        onClick={() => setOpenBehavIndex(isOpen ? null : index)}
                      >
                        <span className="q-card__index">Q{index + 1}</span>
                        <h3 className="q-card__question">{item.question}</h3>
                        <ChevronDown
                          className={`q-card__chevron ${isOpen ? "q-card__chevron--open" : ""}`}
                          size={20}
                        />
                      </div>

                      {isOpen && (
                        <div className="q-card__body">
                          <div className="q-card__section">
                            <span className="q-card__tag q-card__tag--intention">
                              Intention
                            </span>
                            <p>{item.intention}</p>
                          </div>
                          <div className="q-card__section">
                            <span className="q-card__tag q-card__tag--answer">
                              Model Answer
                            </span>
                            <p>{item.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ROADMAP TAB */}
          {activeTab === "roadmap" && (
            <section>
              <header className="content-header">
                <h2>Preparation Road Map</h2>
                <span className="content-header__count">
                  {report.preprationPlan.length} Days Plan
                </span>
              </header>

              <div className="roadmap-list">
                {report.preprationPlan.map((plan, index) => (
                  <div className="roadmap-day" key={index}>
                    <div className="roadmap-day__header">
                      <span className="roadmap-day__badge">{plan.day}</span>
                      <h4 className="roadmap-day__focus">{plan.focus}</h4>
                    </div>
                    <ul className="roadmap-day__tasks">
                      {plan.tasks.map((task, i) => (
                        <li key={i}>
                          <div className="roadmap-day__bullet"></div>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="interview-divider"></div>

        {/* --- RIGHT SIDEBAR --- */}
        <aside className="interview-sidebar">
          <div className="match-score">
            <h4 className="match-score__label">Match Score</h4>
            <div
              className={`match-score__ring ${getScoreClass(report.matchScore)}`}
            >
              <span className="match-score__value">{report.matchScore}</span>
              <span className="match-score__pct">%</span>
            </div>
            <p className="match-score__sub">Strong match for this role</p>
          </div>

          <div className="sidebar-divider"></div>

          <div className="skill-gaps">
            <h4 className="skill-gaps__label">Skill Gaps Focus</h4>
            <div className="skill-gaps__list">
              {report.skillGap.map((gap, index) => (
                <span
                  key={index}
                  className={`skill-tag skill-tag--${gap.severity}`}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;
