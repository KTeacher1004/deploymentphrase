import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../components/ui/BackButton";
import { useAuth } from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL; // ✅ dùng đúng biến môi trường chuẩn

export default function AnswerHistory() {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [testInfo, setTestInfo] = useState({ title: "", description: "" });
    const [testTakerName, setTestTakerName] = useState("");
    const [aiSuggestion, setAiSuggestion] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);
    const { id } = useParams();
    const { user } = useAuth();
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchAnswerHistory = async () => {
            try {
                setLoading(true);
                const testResultResponse = await axios.get(`${API_URL}/test-results/${id}`, {
                    withCredentials: true,
                });
                const testResult = testResultResponse.data;

                const questionSetResponse = await axios.get(`${API_URL}/questions`, {
                    params: { questionSetId: testResult.testId },
                    withCredentials: true,
                });
                const questionSet = questionSetResponse.data;

                const mappedAnswers = testResult.answers.map((studentAnswer) => {
                    const question = questionSet.find(q => q._id === studentAnswer.questionId);
                    return {
                        question: question?.text || "Unknown question",
                        options: question?.options || {},
                        studentAnswer: studentAnswer.selectedAnswer,
                        correctAnswer: question?.correctAnswer || "Unknown",
                        isCorrect: studentAnswer.selectedAnswer === question?.correctAnswer
                    };
                });

                setAnswers(mappedAnswers);
                setTestInfo({
                    title: testResult.testId.title || "Unknown Title",
                    description: testResult.testId.description || "No Description"
                });
                setTestTakerName(testResult.studentId.username || "Anonymous");
            } catch (error) {
                setErrorMsg("Could not load answer history. Please check the link or try again.");
                console.error("Error fetching answer history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnswerHistory();
    }, [id]);

    async function handleGetAISuggestion() {
        try {
            setLoadingAI(true);
            const response = await axios.post(`${API_URL}/ai-suggestion/bulk-feedback`, {
                answers
            }, {
                withCredentials: true
            });
            setAiSuggestion(response.data.feedback);
        } catch (error) {
            console.error("Error fetching AI suggestion:", error);
            alert("Failed to fetch AI suggestion. Please try again later.");
        } finally {
            setLoadingAI(false);
        }
    }

    if (errorMsg) return <div>{errorMsg}</div>;

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="mb-4">
                <BackButton />
            </div>
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Answer History</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Test Information</h2>
                <p><strong>Title:</strong> {testInfo.title}</p>
                <p><strong>Description:</strong> {testInfo.description}</p>
                <p><strong>Test Taker:</strong> {testTakerName}</p>
            </div>
            {answers.length === 0 ? (
                <p className="text-center text-gray-500">No answer history available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Question</th>
                                <th className="border border-gray-300 px-4 py-2">Options</th> {/* New column */}
                                <th className="border border-gray-300 px-4 py-2">Student Answer</th>
                                <th className="border border-gray-300 px-4 py-2">Correct Answer</th>
                                <th className="border border-gray-300 px-4 py-2">Correct</th>
                            </tr>
                        </thead>
                        <tbody>
                            {answers.map((entry, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{entry.question}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-700"> {/* New cell for options */}
                                        {Object.entries(entry.options).map(([key, value]) => (
                                            <div key={key}><strong>{key}:</strong> {value}</div>
                                        ))}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                                        {entry.studentAnswer === "" ? (
                                            <span className="px-2 py-1 rounded-full text-white bg-yellow-500">Missing</span>
                                        ) : (
                                            entry.studentAnswer
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{entry.correctAnswer}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <span className={`px-2 py-1 rounded-full text-white ${entry.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {entry.isCorrect ? "Yes" : "No"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!user.isTeacher && (
                <>
                    <button
                        onClick={handleGetAISuggestion}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        disabled={loadingAI}
                    >
                        {loadingAI ? "Fetching AI Suggestion..." : "Get AI Suggestion"}
                    </button>
                    {aiSuggestion && (
                        <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-md">
                            <h3 className="text-lg font-semibold text-blue-700">AI Suggestion:</h3>
                            <p className="text-gray-700">{aiSuggestion}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
