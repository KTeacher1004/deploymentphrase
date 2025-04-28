import React from 'react';

export default function QuestionSetPopup({
    showPopup,
    closePopup,
    handleChange,
    createSet,
    newSet
}) {
    if (!showPopup) return null; 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg md:w-[400px] w-[90%]">
                <h2 className="md:text-xl font-semibold mb-4">Create New Question Set</h2>
                <p className="text-gray-600 mb-4">Question name:</p>
                <input
                    type="text"
                    name="name"
                    value={newSet.name}
                    onChange={handleChange}
                    placeholder="Question set name"
                    className="w-full p-2 border rounded mb-2"
                />
                <p className="text-gray-600 mb-4">Easy question:</p>
                <input
                    type="number"
                    name="easy"
                    value={newSet.easy}
                    onChange={handleChange}
                    placeholder="Easy questions"
                    className="w-full p-2 border rounded mb-2"
                />
                <p className="text-gray-600 mb-4">Medium question:</p>
                <input
                    type="number"
                    name="medium"
                    value={newSet.medium}
                    onChange={handleChange}
                    placeholder="Medium questions"
                    className="w-full p-2 border rounded mb-2"
                />
                <p className="text-gray-600 mb-4">Hard question:</p>
                <input
                    type="number"
                    name="hard"
                    value={newSet.hard}
                    onChange={handleChange}
                    placeholder="Hard questions"
                    className="w-full p-2 border rounded mb-2"
                />
                <div className="flex justify-end space-x-2">
                    <button onClick={closePopup} className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                        Cancel
                    </button>
                    <button onClick={createSet} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
