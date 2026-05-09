import { useContext } from "react";
import { AuthContext } from "../auth.context-instance";
import { getUser, login, register, logout } from "../services/auth.api";
import toast from "react-hot-toast";
export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;


  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    const toastId = toast.loading("Welcome back to your account");
    try {
      const data = await login({ email, password });
      const currentUser = await getUser();

      if (currentUser?.user) {
        setUser(currentUser.user);
        toast.success("Login successful", { id: toastId });
        return true;
      }

      if (data?.user) {
        setUser(data.user);
        toast.success("Login successful", { id: toastId });
        return true;
      }
      toast.error("Unable to login", { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Unable to login", { id: toastId });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ userName, email, password }) => {
    setLoading(true);
    const toastId = toast.loading("Register your account");
    try {
      const data = await register({ userName, email, password });
      const currentUser = await getUser();
      setUser(currentUser?.user || data?.user || null);
      const isRegistered = Boolean(currentUser?.user || data?.user);
      if (isRegistered) {
        toast.success("Account created successfully", { id: toastId });
      } else {
        toast.error("Unable to register", { id: toastId });
      }
      return isRegistered;
    } catch (error) {
      console.log(error);
      toast.error("Unable to register", { id: toastId });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    const toastId = toast.loading("Logging out of your account");

    try {
      const data = await logout();
      setUser(null);
      toast.success("Logged out successfully", { id: toastId });
      return data;
    } catch (error) {
      console.log(error);
      toast.error("Unable to logout", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleLogin, handleLogout, handleRegister };
};
