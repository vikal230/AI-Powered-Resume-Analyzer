import "./App.css";
import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { AuthContextProvider } from "./features/auth/auth.context.jsx";
import {InterviewProvider} from "./features/interview/interview.context.jsx";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <AuthContextProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2500,
            style: {
              background: "#1f2937",
              color: "#ffffff",
              border: "1px solid #374151",
            },
          }}
        />
      </InterviewProvider>
    </AuthContextProvider>
  );
}

export default App;
