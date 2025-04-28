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

    useEffect(() => {
        const fetchAnswerHistory = async () => {
            try {
                setLoading(true);
                const testResultResponse = await axios.get(`${API_URL}/api/test-results/${id}`, {
                    withCredentials: true,
                });
                const testResult = testResultResponse.data;

                const questionSetResponse = await axios.get(`${API_URL}/api/questions`, {
                    params: { questionSetId: testResult.testId.questionSetId },
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
            const response = await axios.post(`${API_URL}/api/ai-suggestion/bulk-feedback`, {
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* ... phần còn lại giữ nguyên ... */}
        </div>
    );
}
