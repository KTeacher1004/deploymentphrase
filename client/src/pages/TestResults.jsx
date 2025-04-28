import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../components/ui/BackButton";

export default function TestResults() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    };

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/test-results/${id}/results`, {
                    withCredentials: true
                });
                console.log("Test Results:", response.data);
                setResults(response.data);
            } catch (error) {
                console.error("Error fetching test results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [id]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="text-lg font-semibold">Loading...</div>
        </div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <BackButton />
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Test Results</h1>
            {results.length === 0 ? (
                <p className="text-gray-600">No results available for this test.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Student Name</th>
                                <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Score</th>
                                <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Completion Time</th>
                                <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result) => (
                                <tr key={result.studentId} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{result.studentId.username}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{result.score}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{formatDate(result.completedAt)}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button
                                            onClick={() => navigate(`/answer-history/${result._id}`)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                                        >
                                            View History
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}