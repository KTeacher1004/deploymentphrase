import React, { useEffect, useState } from 'react';
import BackButton from '../components/ui/BackButton';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import TestPopup from '../components/ui/TestPopup'; // You’ll need to create this

export default function Test() {
    const [tests, setTests] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const { user } = useAuth();

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [newTest, setNewTest] = useState({
        title: '',
        description: '',
        teacherId: user._id,
    });

    // Fetch tests on mount
    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/tests/teacher/${user._id}`);
                setTests(res.data);
            } catch (err) {
                console.error("Failed to fetch tests:", err);
            }
        };
        fetchTests();
    }, [user._id, BACKEND_URL]);

    // Open/Close popup
    const openPopup = () => setShowPopup(true);
    const closePopup = () => {
        setShowPopup(false);
        setNewTest({ title: '', description: '', duration: 30, teacherId: user._id });
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewTest({ ...newTest, [name]: type === 'checkbox' ? checked : value });
    };

    // Create a test
    const createTest = async () => {
        const total =
        parseInt(newTest.easy || 0) +
        parseInt(newTest.medium || 0) +
        parseInt(newTest.hard || 0);

        if (total > parseInt(newTest.totalQuestions)) {
            alert("❌ Total of Easy + Medium + Hard exceeds total questions.");
            return;
        }

        if (total < parseInt(newTest.totalQuestions)) {
            alert("⚠️ Make sure all questions are allocated (Easy + Medium + Hard = Total Questions)");
            return;
        }
        
        if (!newTest.title || !newTest.duration) {
            alert("Please fill in the title and duration.");
            return;
        }
        try {
            console.log("Creating test with data:", newTest);
            const res = await axios.post(`${BACKEND_URL}/tests`, newTest);
            setTests([...tests, res.data]);
            closePopup();
            alert("Test created!");
        } catch (err) {
            console.error("Error creating test:", err);
        }
    };

    // Delete test
    const deleteTest = async (id) => {
        try {
            if (!window.confirm("Are you sure you want to delete this test and test result?")) return;
            console.log("Deleting test with ID:", id);
            await axios.delete(`${BACKEND_URL}/tests/${id}`);
            setTests(tests.filter(test => test._id !== id));
            alert("Test deleted!");
        } catch (err) {
            console.error("Error deleting test:", err);
        }
    };

    // Go to test details page
    const accessTest = (id) => {
        window.location.href = `/teacher-dashboard/test/${id}`;
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-background p-4">
            <div className="w-[80%] flex justify-start mb-4">
                <BackButton />
            </div>
            <div className="bg-card shadow-lg rounded-lg p-6 md:p-8 w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-primary text-center md:text-left">
                Test List
                </h1>
                <button
                onClick={openPopup}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                Create New Test
                </button>
            </div>

            {/* Test list */}
            <div className="mt-4 flex flex-col w-full mb-6 space-y-4">
                {tests.length > 0 ? (
                tests.map((test) => (
                    <div
                    key={test._id}
                    className="flex flex-col md:flex-row md:justify-between md:items-center p-4 border rounded-md hover:shadow transition"
                    >
                    <span className="font-semibold text-lg text-cardTitle text-textPrimary mb-2 md:mb-0">
                        {test.title}
                    </span>

                    <div className="text-textSecondary text-base mb-2 md:mb-0">
                        Duration: {test.duration} mins
                    </div>

                    <div className="flex justify-center md:justify-end gap-2">
                        <button
                        onClick={() => accessTest(test._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                        Access
                        </button>
                        <button
                        onClick={() => deleteTest(test._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                ))
                ) : (
                <p className="text-gray-500 text-center">There is no test yet.</p>
                )}
            </div>
            </div>


            {/* Popup for test creation */}
            <TestPopup
                showPopup={showPopup}
                closePopup={closePopup}
                handleChange={handleChange}
                createTest={createTest}
                newTest={newTest}
            />
        </div>
    );
}
