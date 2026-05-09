import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Protected = ({children}) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main
        style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}
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
      </main>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return children;
  
}

export default Protected;
