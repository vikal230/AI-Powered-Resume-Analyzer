import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Protected = ({children}) => {
  const { loading, user } = useAuth();
  const hasAuthSession =
    window.sessionStorage.getItem("resumeAuthSession") === "true";
  const loadingText = window.location.pathname.startsWith("/interview/")
    ? "Loading Interview..."
    : !hasAuthSession
      ? "Loading Login..."
      : "Loading Home...";

  if (loading) {
    return (
      <main
        style={{ minHeight: "100vh", display: "grid", placeItems: "center", gap: "10px" }}
      >
        <svg width="44" height="44" viewBox="0 0 50 50" aria-hidden="true">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="5"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#ec4899"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="32 120"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>{loadingText}</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return children;
  
}

export default Protected;
