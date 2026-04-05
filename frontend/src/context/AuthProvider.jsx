import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
export default function AuthProvider({ children }) {
  const API_URL = "http://localhost:5000/api/auth";
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/getuser`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.user);
        
      }
    } catch (err) {
      setUser(null);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { username, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        getUser(); // Fetch user from DB immediately
        
        return {
          success: true,
          message: res.data.message || "Logged in successfully!",
        };
      }

      return { success: false, message: res.data?.message || "Login failed" };
    } catch {
      return { success: false, message: "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      navigate("/adminLogin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
