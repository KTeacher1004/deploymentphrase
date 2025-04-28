import React, { useEffect, useState } from 'react';
import QuestionSetPopup from '../components/ui/QuestionSetPopup';
import BackButton from '../components/ui/BackButton';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';


export default function QuestionSet() {
    // State to manage question sets
    const [sets, setSets] = useState([]);

    // Get teacher ID from AuthContext
    const { user } = useAuth();

    // Backend API URL
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // Effect to fetch question sets from the server
    useEffect(() => {
        const fetchSets = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/question-sets/teacher/${user._id}`);
                if (response.status === 200) {
                    setSets(response.data);
                } else {
                    console.error('Failed to fetch question sets:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching question sets:', error);
            }
        };
        fetchSets();
    }, [user._id, BACKEND_URL]);

    // State to manage popup visibility and new set data
    const [showPopup, setShowPopup] = useState(false);
    const [newSet, setNewSet] = useState({
        name: '',
        easy: 0,
        medium: 0,
        hard: 0,
        teacherId: user._id,
    });

    // Function to handle popup visibility
    const openPopup = () => setShowPopup(!showPopup);
    const closePopup = () => {
        setShowPopup(false);
        setNewSet({ name: '', easy: 0, medium: 0, hard: 0 });
    };

    // Function to handle input changes in the popup
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSet({ ...newSet, [name]: value });
    };

    // create a new question set with popup
    const createSet = async () => {
        console.log(newSet);
        if (!newSet.name || !newSet.teacherId) {
            alert("Enter all fields!");
            return;
        }

        // Call the API to create a new question set
        try {
            const response = await axios.post(`${BACKEND_URL}/question-sets`, newSet);
            setSets([...sets, response.data]);
            alert("Question set created successfully!");
        } catch (error) {
            console.error('Error creating question set:', error);
            alert("Error creating question set:", error.message);
        }
        closePopup();
    };

    // Delete a question set
    const deleteSet = async (id) => {
        // Call the API to delete the question set
        try {
            await axios.delete(`${BACKEND_URL}/question-sets/${id}`);
            setSets(sets.filter(set => set._id !== id));
            alert("Question set deleted successfully!");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("Something went wrong 😢");
            }
        }
    };

    // Access a question set
    const accessSet = (id) => {
        window.location.href = `/teacher-dashboard/question-set/${id}`;
    };

    return (
        <>
        {/* Main background */}
        <div className="flex flex-col items-center w-full min-h-screen bg-background p-4">
            {/* Back button */}
            <div className="w-[80%] flex justify-start mb-4">
                <BackButton />  
            </div>
            {/* Container to store main content */}
            <div className="bg-card shadow-lg rounded-lg p-6 md:p-8 w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-primary text-center md:text-left">
                Question Set List
                </h1>
                <button
                onClick={openPopup}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                Create New Set
                </button>
            </div>

            {/* Question set list */}
            <div className="mt-4 flex flex-col w-full mb-6 space-y-4">
                {sets.length > 0 ? (
                sets.map((set) => (
                    <div
                    key={set.id}
                    className="flex flex-col md:flex-row md:justify-between md:items-center p-4 border rounded-md hover:shadow transition"
                    >
                    <span className="font-semibold text-lg text-cardTitle text-textPrimary mb-2 md:mb-0">
                        {set.name}
                    </span>

                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-2 md:mb-0">
                        <p className="text-textSecondary text-base">Easy: {set.easy}</p>
                        <p className="text-textSecondary text-base">Medium: {set.medium}</p>
                        <p className="text-textSecondary text-base">Hard: {set.hard}</p>
                    </div>

                    <div className="flex justify-center md:justify-end gap-2">
                        {/* Access button */}
                        <button
                        onClick={() => accessSet(set._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                        Access
                        </button>
                        {/* Delete button */}
                        <button
                        onClick={() => deleteSet(set._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                ))
                ) : (
                <p className="text-gray-500 text-center">There is no question set yet.</p>
                )}
            </div>
            </div>
 

            {/* Popup for creating new question set */}
            <QuestionSetPopup
                showPopup={showPopup}
                closePopup={closePopup}
                handleChange={handleChange}
                createSet={createSet}
                newSet={newSet}
            />
        </div>
        </>
    );
}
