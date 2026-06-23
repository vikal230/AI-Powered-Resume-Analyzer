// import { useState, useEffect } from "react";
// import { getUser } from "./services/auth.api";
// import { AuthContext } from "./auth.context-instance";

// export const AuthContextProvider = ({ children }) => {
//   const publicPaths = ["/login", "/register"];
//   const shouldShowAuthLoader = !publicPaths.includes(window.location.pathname);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(shouldShowAuthLoader);

//   useEffect(() => {
//     const getAndSetUser = async () => {
//       try {
//         const data = await getUser();
//         setUser(data?.user || null);
//         if (data?.user) {
//           window.sessionStorage.setItem("resumeAuthSession", "true");
//         } else {
//           window.sessionStorage.removeItem("resumeAuthSession");
//         }
//       } catch (error) {
//         console.error(error);
//         setUser(null);
//         window.sessionStorage.removeItem("resumeAuthSession");
//       } finally {
//         if (shouldShowAuthLoader) {
//           setLoading(false);
//         }
//       }
//     };
//     getAndSetUser();
//   }, [shouldShowAuthLoader]);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import { useState, useEffect } from "react";
import { getUser } from "./services/auth.api";
import { AuthContext } from "./auth.context-instance";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getUser();
        setUser(data?.user || null);
        if (data?.user) {
          window.sessionStorage.setItem("resumeAuthSession", "true");
        } else {
          window.sessionStorage.removeItem("resumeAuthSession");
        }
      } catch (_error) {
        setUser(null);
        window.sessionStorage.removeItem("resumeAuthSession");
      }
    };
    getAndSetUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};