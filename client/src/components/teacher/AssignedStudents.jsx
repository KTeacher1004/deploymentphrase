import React from 'react';

export default function AssignedStudents({ test, assignedStudents, handleAddStudent, handleRemoveStudent, searchType, setSearchType, identifier, setIdentifier, error }) {
    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-4">Assigned Students</h3>
            <form onSubmit={handleAddStudent} className="mb-4">
                <div className="flex gap-2 mb-2">
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value="username">Username</option>
                        <option value="email">Email</option>
                    </select>
                    <input
                        type={searchType === "email" ? "email" : "text"}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={`Enter student ${searchType}`}
                        className="flex-1 p-2 border rounded-md"
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Add Student
                    </button>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </form>

            <div className="space-y-2">
                {assignedStudents.map((student) => (
                    <div key={student._id} className="flex justify-between items-center p-2 bg-white rounded border">
                        <div>
                            <p className="font-medium">{student.username}</p>
                            <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                        <button
                            onClick={() => handleRemoveStudent(student._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                {assignedStudents.length === 0 && (
                    <p className="text-gray-500">No students assigned yet.</p>
                )}
            </div>
        </div>
    );
}