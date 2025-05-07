import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/ui/BackButton";

export default function EnterTestId() {
    const [testId, setTestId] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (testId.trim()) {
            navigate(`/student-dashboard/take-quiz/${testId}`);
        } else {
            alert("Please enter a valid Test ID.");
        }
    };

    return (
        
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="flex w-[50%] mb-5">
                <BackButton />
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-[50%]">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Enter Test ID</h1>
                <input
                    type="text"
                    value={testId}
                    onChange={(e) => setTestId(e.target.value)}
                    placeholder="Test ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Take Test
                </button>
            </form>
        </div>
    );
}