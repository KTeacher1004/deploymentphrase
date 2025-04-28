import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

export default function UploadQuestions({ newSet, BACKEND_URL, setQuestions }) {
    const [previewQuestions, setPreviewQuestions] = useState([]);
    const [fileName, setFileName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle File Upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Format the questions
            const formattedQuestions = jsonData.map((row, index) => {
                const options = {
                    A: String(row.A || "N/A"),
                    B: String(row.B || "N/A"),
                    C: String(row.C || "N/A"),
                    D: String(row.D || "N/A")
                };

                const correctAnswer = row.correctAnswer && ["A", "B", "C", "D"].includes(row.correctAnswer) 
                    ? row.correctAnswer 
                    : "N/A"; 

                return {
                    id: index + 1,
                    text: row.text || "Missing Question",
                    options: options,
                    correctAnswer: correctAnswer,
                    difficulty: row.difficulty || "easy",
                    questionSetId: newSet._id,
                };
            });

            setPreviewQuestions(formattedQuestions); // Set the formatted questions
            setIsModalOpen(true); // Open the modal after the preview is ready
        };

        reader.readAsArrayBuffer(file);
    };

    // Handle Upload to Backend
    const handleUpload = async () => {
        try {
            // Check if question limit is reached
            const easyCount = previewQuestions.filter((q) => q.difficulty === "easy").length;
            const mediumCount = previewQuestions.filter((q) => q.difficulty === "medium").length;
            const hardCount = previewQuestions.filter((q) => q.difficulty === "hard").length;
            if (easyCount > newSet.easy) {
                alert("Easy question limit reached!");
                return;
            }
            if (mediumCount > newSet.medium) {
                alert("Medium question limit reached!");
                return;
            }
            if (hardCount > newSet.hard) {
                alert("Hard question limit reached!");
                return;
            }

            // Remove the id field from each question
            const questionsToUpload = previewQuestions.map(({ id, ...rest }) => rest);

            // Call the API to upload questions
            const response = await axios.post(`${BACKEND_URL}/questions/multiple`, { "questions" : questionsToUpload });
            if (response.status === 201) {
                setQuestions((prev) => [...prev, ...response.data]);
                alert("Questions uploaded successfully!");
                resetModal(); // Close the modal after successful upload
            }
        } catch (error) {
            alert("Upload Failed! Check console for details.");
            console.error(error);
        }
    };

    // Reset all fields to default values
    const resetModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="p-4 border rounded-lg bg-gray-100">
            {/* File Input */}
            <input
                type="file"
                accept=".xlsx, .csv"
                onChange={handleFileUpload}
                className="mb-4 p-2 border rounded-md"
            />

            {/* Show File Name */}
            {fileName && (
                <>
                <p className="text-sm text-gray-600">Previewing: {fileName}</p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                    Reopen Preview
                </button>
                </>
            )}

            {/* Modal for Reviewing Questions */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl">
                        <h2 className="text-xl font-semibold mb-4">Review Questions</h2>
                        <div className="overflow-y-auto max-h-96"> {/* Added scrollable container */}
                            <table className="w-full border-collapse border mb-4">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">#</th>
                                        <th className="border p-2">Question</th>
                                        <th className="border p-2">A</th>
                                        <th className="border p-2">B</th>
                                        <th className="border p-2">C</th>
                                        <th className="border p-2">D</th>
                                        <th className="border p-2">Answer</th>
                                        <th className="border p-2">Difficulty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewQuestions.map((q, index) => (
                                        <tr key={index} className="text-center">
                                            <td className="border p-2">{q.id}</td>
                                            <td className="border p-2">{q.text}</td>
                                            <td className="border p-2">{q.options.A}</td>
                                            <td className="border p-2">{q.options.B}</td>
                                            <td className="border p-2">{q.options.C}</td>
                                            <td className="border p-2">{q.options.D}</td>
                                            <td className="border p-2">{q.correctAnswer}</td>
                                            <td className="border p-2 capitalize">{q.difficulty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Upload Button */}
                        <div className="flex justify-between">
                            <button
                                onClick={handleUpload}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                                Upload Questions
                            </button>

                            <button
                                onClick={resetModal} // Just close the modal
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Close Preview
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
