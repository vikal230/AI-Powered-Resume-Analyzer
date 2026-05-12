import { useState, useEffect } from "react";
import { getUser } from "./services/auth.api";
import { AuthContext } from "./auth.context-instance";

export const AuthContextProvider = ({ children }) => {
  const publicPaths = ["/login", "/register"];
  const shouldShowAuthLoader = !publicPaths.includes(window.location.pathname);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(shouldShowAuthLoader);

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getUser();
        setUser(data?.user || null);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        if (shouldShowAuthLoader) {
          setLoading(false);
        }
      }
    };
    getAndSetUser();
  }, [shouldShowAuthLoader]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
