import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL; // vẫn dùng API_URL

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token") || null;
      console.log("🔍 Checking authentication status...");

      if (token && token !== "undefined" && token !== "null") {
        console.log("🔐 Using session token...");
        try {
          const { data } = await axios.get(`${API_URL}/auth/autologin`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          if (data.user) {
            console.log("✅ User authenticated via token");
            setUser(data.user);
            return;
          }
        } catch (tokenError) {
          console.warn("⚠️ Token authentication failed:", tokenError?.response?.data || tokenError.message);
          sessionStorage.removeItem("token");
        }
      }

      console.log("🍪 Checking auth via cookies...");
      const { data } = await axios.get(`${API_URL}/auth/autologin`, {
        withCredentials: true,
      });
      if (data.user) {
        console.log("✅ User authenticated via cookies");
        setUser(data.user);
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error?.response?.data || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const login = async (formData) => {
    try {
      // Clear existing tokens
      sessionStorage.removeItem("token");
      document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      const res = await axios.post(`${API_URL}/auth/login`, formData, {
        withCredentials: true,
      });

      if (!formData.rememberMe && res.data.token) {
        sessionStorage.setItem("token", res.data.token);
      }

      setUser(res.data.user);
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
      throw new Error(err.response?.data?.message || "Login failed!");
    }
  };

  const register = async (formData) => {
    try {
      await axios.post(`${API_URL}/auth/register`, formData);
      window.location.href = "/login";
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("⚠️ Logout error:", error?.response?.data || error.message);
    }
    sessionStorage.removeItem("token");
    document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
