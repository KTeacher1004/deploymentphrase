import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL; // ✅ Sửa tên biến .env thành VITE_API_URL

    // Check authentication status 
    const checkAuth = useCallback(async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token") || null;
            console.log(token);

            if (token && token !== "undefined" && token !== "null") {
                console.log("🔐 Using session token...");
                const { data } = await axios.get(`${API_URL}/api/users/autologin`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                if (data.user) {
                    setUser(data.user);
                    return;
                }
            }

            console.log("🍪 Checking auth via cookies...");
            const { data } = await axios.get(`${API_URL}/api/users/autologin`, { withCredentials: true });
            if (data.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.error("❌ Auth check failed:", error?.response?.data || error.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [API_URL, setLoading, setUser]);

    // Login function
    const login = async (formData) => {
        try {
            sessionStorage.removeItem("token");

            // Clear cookie if exists (don't set domain=localhost vì deploy rồi)
            document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

            const res = await axios.post(`${API_URL}/api/users/login`, formData, { withCredentials: true });

            if (!formData.rememberMe) {
                sessionStorage.setItem("token", res.data.token);
            }

            setUser(res.data.user);
            window.location.href = "/";
        } catch (err) {
            throw new Error(err.response?.data?.message || "Login failed!");
        }
    };

    // Register function
    const register = async (formData) => {
        try {
            await axios.post(`${API_URL}/api/users/register`, formData);
            window.location.href = "/login";
        } catch (err) {
            throw new Error(err.response?.data?.message || "Registration failed");
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.post(`${API_URL}/api/users/logout`, {}, { withCredentials: true });
        } catch (error) {
            console.error("⚠️ Logout error:", error?.response?.data || error.message);
        }
        sessionStorage.removeItem("token");
        document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        setUser(null);
    };

    // Auto-check login on page load
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
