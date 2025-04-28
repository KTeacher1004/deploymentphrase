import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import ErrorPopup from "../components/ui/ErrorPopup.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Login() {
    // State to manage form data and error message
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [error, setError] = useState("");

    // Get login function from AuthContext
    const { login } = useAuth();

    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        // Delete token from sessionStorage if it exists
        if (sessionStorage.getItem("token")) {
            sessionStorage.removeItem("token");
        }
        // Delete token in cookie if it exists
        if (document.cookie.includes("jwt")) {
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
        // Validate form data
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields!");
            return;
        }

        try {
            await login(formData);
        } catch (err) {
            setError(err.message || "Login failed!");
        }
    };
        
    return (
        <>
        {/* Error popup */}
        {error && <ErrorPopup message={error} onClose={() => setError("")} />}
        {/* Main background */}
        <div className="flex items-center justify-center min-h-screen bg-background">
            {/* Login form */}
            <form onSubmit={handleSubmit} className="bg-card shadow-lg rounded-lg p-8 w-full max-w-sm flex flex-col items-center justify-center">
                {/* Welcome text */}
                <h1 className="text-sectionTitle font-bold text-primary mb-6">Welcome to Ecademy</h1>
                {/* e-mail input */}
                <div className="relative w-full">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary" size={20} />
                    <input
                        name="email"
                        type="text"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 border-2 border-primary opacity-[80%] focus:opacity-[100%] focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm w-full py-2 px-3 outline-none"
                    />
                </div>
                {/* Password input */}
                <div className="relative w-full mt-4">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary" size={20} />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 border-2 border-primary opacity-[80%] focus:opacity-[100%] focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm w-full py-2 px-3 outline-none"
                    />
                </div>
                {/* Remember me checkbox */}
                <div className="w-full mt-4">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="remember" className="ml-2 text-textPrimary">
                        Remember me
                    </label>
                </div>
                {/* Login button */}
                <button className="bg-primary text-white py-2 px-4 rounded shadow hover:bg-secondary transition duration-300 w-full mt-6" type="submit">
                    Login
                </button>
                {/* Sign up link */}
                <div className="text-center mt-4">
                    <p className="text-textPrimary text-sm">Don't have an account? <a href="/register" className="text-secondary hover:underline">Sign up</a></p>
                </div>
            </form>
        </div>
        </> 
    )
};