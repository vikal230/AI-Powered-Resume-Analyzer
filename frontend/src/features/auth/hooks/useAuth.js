import { useContext } from "react";
import { AuthContext } from "../auth.context-instance";
import { getUser, login, register, logout } from "../services/auth.api";
export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;


  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      const currentUser = await getUser();

      if (currentUser?.user) {
        setUser(currentUser.user);
        return true;
      }

      if (data?.user) {
        setUser(data.user);
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ userName, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ userName, email, password });
      const currentUser = await getUser();
      setUser(currentUser?.user || data?.user || null);
      return Boolean(currentUser?.user || data?.user);
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      const data = await logout();
      setUser(null);
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleLogin, handleLogout, handleRegister };
};
