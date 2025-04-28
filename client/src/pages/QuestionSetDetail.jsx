import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import QuestionPopup from "../components/ui/QuestionPopup.jsx";
import axios from "axios";
import UploadQuestions from "../components/ui/UploadQuestion.jsx";
import BackButton from "../components/ui/BackButton.jsx";

export default function QuestionSetDetail() {
    // Get the question set ID from the URL parameters
    const { id } = useParams(); 
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // Ensure `questions` is an array by default
    const [questions, setQuestions] = useState([]); 
    const [modalOpen, setModalOpen] = useState(false);
    const [editQuestion, setEditQuestion] = useState(null);
    const [newSet, setNewSet] = useState({});

    // Fetch questions and question set details when the component mounts
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/questions`, {
                    params: { questionSetId: id },
                });
                if (response.status === 200) {
                    setQuestions(Array.isArray(response.data) ? response.data : []);
                } else {
                    console.error("Failed to fetch questions:", response.statusText);
                }
                const setResponse = await axios.get(`${BACKEND_URL}/question-sets/${id}`);
                if (setResponse.status === 200) {
                    setNewSet(setResponse.data);
                } else {
                    console.error("Failed to fetch question set:", setResponse.statusText);
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [id, BACKEND_URL]);

    // Function to handle opening and closing the question popup
    const openPopup = (question = null) => {
        setEditQuestion(question);
        setModalOpen(true);
    };
    const closePopup = () => {
        setEditQuestion(null);
        setModalOpen(false);
    };

    // Function to handle saving a question
    const handleSaveQuestion = async (formData) => {
        try {
            if (editQuestion) {
                // Update existing question
                const response = await axios.put(`${BACKEND_URL}/questions/${editQuestion._id}`, formData);
                console.log("Response:", response.data.message);
                if (response.status === 200) {
                    setQuestions((prev) =>
                        prev.map((q) => (q._id === editQuestion._id ? { ...q, ...formData } : q))
                    );
                }
            } else {
                // Check if question limit is reached
                if (formData.difficulty === "easy" && questions.filter((q) => q.difficulty === "easy").length >= newSet.easy) {
                    alert("Easy question limit reached!");
                    return;
                }
                if (formData.difficulty === "medium" && questions.filter((q) => q.difficulty === "medium").length >= newSet.medium) {
                    alert("Medium question limit reached!");
                    return;
                }
                if (formData.difficulty === "hard" && questions.filter((q) => q.difficulty === "hard").length >= newSet.hard) {
                    alert("Hard question limit reached!");
                    return;
                }
                // Create a new question
                const response = await axios.post(`${BACKEND_URL}/questions`, { ...formData, questionSetId: id });
                if (response.status === 201) {
                    setQuestions([...questions, response.data]);
                }
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("Something went wrong 😢");
            }
        }
        closePopup();
    };

    // Function to handle deleting a question
    const deleteQuestion = async (questionId) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        try {
            await axios.delete(`${BACKEND_URL}/questions/${questionId}`);
            setQuestions((prev) => prev.filter((q) => q._id !== questionId));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("Something went wrong 😢");
            }
        }
    };

    // Ensure groupedQuestions is based on an array
    const groupedQuestions = {
        easy: (questions || []).filter((q) => q.difficulty === "easy"),
        medium: (questions || []).filter((q) => q.difficulty === "medium"),
        hard: (questions || []).filter((q) => q.difficulty === "hard"),
    };

    return (
        <>
        {/* Main background */ }
        <div className="flex flex-col items-center w-full min-h-screen bg-background p-4">
            {/* Back button */}
            <div className="w-[80%] flex justify-start mb-4">
                <BackButton />  
            </div>

            {/* Question container */}
            <div className="w-[80%] bg-card shadow-lg mx-auto p-6">
                {/* Question set title and add question button */}
                <h1 className="text-2xl font-bold mb-4">{newSet.name}</h1>
                <button onClick={() => openPopup()} className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md">
                    + Add Question
                </button>

                <UploadQuestions newSet={newSet} BACKEND_URL={BACKEND_URL} setQuestions={setQuestions} />

                {/* Question categories */}
                {["easy", "medium", "hard"].map((level) => (
                    <div key={level} className="mb-6">
                        {/* Category title */}
                        <h2 className={`text-xl font-semibold ${level === "easy" ? "text-green-600" : level === "medium" ? "text-yellow-600" : "text-red-600"}`}>
                            {level.charAt(0).toUpperCase() + level.slice(1)} Questions ({groupedQuestions[level].length} of {newSet[level]}):
                        </h2>
                        {/* Questions list */}
                        <div className="border p-4 rounded-md">
                            {groupedQuestions[level].length > 0 ? (
                                groupedQuestions[level].map((q) => (
                                    // Display each question with edit and delete buttons
                                    <div key={q._id} className="flex justify-between items-center p-3 border-b">
                                        <span>{q.text}</span>
                                        <div className="flex space-x-2">
                                            {/* Edit and delete buttons */}
                                            <button onClick={() => openPopup(q)} className="px-2 py-1 bg-blue-500 text-white rounded-md mr-2">
                                                Edit
                                            </button>
                                            {/* Delete button */}
                                            <button onClick={() => deleteQuestion(q._id)} className="px-2 py-1 bg-red-500 text-white rounded-md">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No questions in this category.</p>
                            )}
                        </div>
                    </div>
                ))}

                {modalOpen && <QuestionPopup question={editQuestion} onSave={handleSaveQuestion} onClose={closePopup} />}
            </div>
        </div>
        </>
    );
}
