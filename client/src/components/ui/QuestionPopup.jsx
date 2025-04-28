import { useState } from "react";

export default function QuestionPopup({ question, onSave, onClose }) {
    const [text, setText] = useState(question?.text || "");
    const [options, setOptions] = useState(question?.options || { A: "", B: "", C: "", D: "" });
    const [correctAnswer, setCorrectAnswer] = useState(question?.correctAnswer || "A");
    const [difficulty, setDifficulty] = useState(question?.difficulty || "easy");

    const handleOptionChange = (optionKey, value) => {
        setOptions((prev) => ({ ...prev, [optionKey]: value }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ text, options, correctAnswer, difficulty });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3">
                <h2 className="text-lg font-bold mb-4">{question ? "Edit Question" : "Create Question"}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label>
                        Question Text:
                        <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full border p-2 rounded-md" required />
                    </label>
                    <label>
                        Option A:
                        <input type="text" value={options.A} onChange={(e) => handleOptionChange("A", e.target.value)} className="w-full border p-2 rounded-md" required />
                    </label>
                    <label>
                        Option B:
                        <input type="text" value={options.B} onChange={(e) => handleOptionChange("B", e.target.value)} className="w-full border p-2 rounded-md" required />
                    </label>
                    <label>
                        Option C:
                        <input type="text" value={options.C} onChange={(e) => handleOptionChange("C", e.target.value)} className="w-full border p-2 rounded-md" required />
                    </label>
                    <label>
                        Option D:
                        <input type="text" value={options.D} onChange={(e) => handleOptionChange("D", e.target.value)} className="w-full border p-2 rounded-md" required />
                    </label>
                    <label>
                        Correct Answer:
                        <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="w-full border p-2 rounded-md">
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                    </label>
                    <label>
                        Difficulty:
                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full border p-2 rounded-md">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </label>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
