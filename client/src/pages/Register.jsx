import { Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import ErrorPopup from "../components/ui/ErrorPopup.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Register() {
    // State to manage form data and error message
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        isTeacher: false,
    });
    const [error, setError] = useState(null);
    
    // Get register function from AuthContext
    const { register } = useAuth();

    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        // Validate form data
        if (!formData.username || !formData.email || !formData.password) {
            setError("Please fill in all fields!");
            return;
        }
        // Check if the password is at least 6 characters long
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long!");
            return;
        }
        // Check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Invalid email format!");
            return;
        }

        try {
            register(formData);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <>
            {/* Error popup */}
            {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
            {/* Main background */}
            <div className="flex items-center justify-center min-h-screen bg-background">
                {/* Registration form */}
                <div className="bg-card shadow-lg rounded-lg p-8 w-full max-w-sm flex flex-col items-center">
                    <h1 className="text-sectionTitle font-bold text-primary mb-6">Create an Account</h1>
                    <form className="w-full" onSubmit={handleSubmit}>
                        {/* Username input */}
                        <div className="relative w-full">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary" size={20} />
                            <input
                                name="username"
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="pl-10 border-2 border-primary opacity-[80%] focus:opacity-[100%] focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm w-full py-2 px-3 outline-none"
                            />
                        </div>

                        {/* Email input */}
                        <div className="relative w-full mt-4">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary" size={20} />
                            <input
                                name="email"
                                type="email"
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

                        {/* isTeacher checkbox */}
                        <div className="w-full mt-4">
                            <input
                                type="checkbox"
                                id="isTeacher"
                                name="isTeacher"
                                checked={formData.isTeacher}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="isTeacher" className="ml-2 text-textPrimary">
                                Register as a teacher
                            </label>
                        </div>

                        {/* Register button */}
                        <button className="bg-primary text-white py-2 px-4 rounded shadow hover:bg-secondary transition duration-300 w-full mt-6">
                            Register
                        </button>
                    </form>

                    {/* Already have an account */}
                    <p className="text-textPrimary text-sm">Already have an account? <a href="/login" className="text-secondary hover:underline">Login</a></p>

                </div>
            </div>
        </>
    );
}