import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/ui/BackButton.jsx";
import { useAuth } from "../hooks/useAuth";
import TestHeader from '../components/teacher/TestHeader';
import TestMode from '../components/teacher/TestMode';
import AssignedStudents from '../components/teacher/AssignedStudents';
import QuestionDistribution from '../components/teacher/QuestionDistribution';

export default function TestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const { user } = useAuth();

    const [test, setTest] = useState(null);
    const [questionSets, setQuestionSets] = useState([]);
    const [copied, setCopied] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [error, setError] = useState("");
    const [searchType, setSearchType] = useState("username"); // "username" or "email"
    const [tempDistribution, setTempDistribution] = useState({
        totalQuestions: 0,
        easy: 0,
        medium: 0,
        hard: 0
    });

    // Fetch test and question sets when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch test details
                const testResponse = await axios.get(`${BACKEND_URL}/tests/${id}`, {
                    withCredentials: true
                });
                if (testResponse.status === 200) {
                    setTest(testResponse.data);
                    console.log("Test Data:", testResponse.data);
                    if (testResponse.data.assignedStudentsId && testResponse.data.assignedStudentsId.length > 0) {
                        // Fetch assigned students details
                        const studentsResponse = await axios.get(`${BACKEND_URL}/users/students`, {
                            params: { ids: testResponse.data.assignedStudentsId },
                            withCredentials: true
                        });
                        if (studentsResponse.status === 200) {
                            setAssignedStudents(studentsResponse.data);
                        }
                    } else {
                        setAssignedStudents([]); // Handle case where assignedStudentsId is an empty array
                    }
                }

                // Fetch question sets for this teacher
                const setsResponse = await axios.get(`${BACKEND_URL}/question-sets/teacher/${user._id}`, {
                    withCredentials: true
                });
                if (setsResponse.status === 200) {
                    setQuestionSets(setsResponse.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id, BACKEND_URL, user._id]);

    // Add this after the existing useEffect
    useEffect(() => {
        if (test) {
            setTempDistribution({
                totalQuestions: test.totalQuestions || 0,
                easy: test.easy || 0,
                medium: test.medium || 0,
                hard: test.hard || 0
            });
        }
    }, [test]);

    // Handle updating test with question set
    const handleSetSelect = async (setId) => {
        try {
            // If setId is empty string, we're removing the set
            const updateData = setId ? { questionSetId: setId } : { questionSetId: null };

            // Fetch questions for the question set
            const questionsResponse = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/questions`,
                {
                params: {
                    questionSetId: setId
                }
                }
            );
            const allQuestions = questionsResponse.data;
            console.log('All Questions:', allQuestions);
    
            // Filter questions by difficulty
            const easyQuestions = allQuestions.filter(q => q.difficulty === 'easy');
            const mediumQuestions = allQuestions.filter(q => q.difficulty === 'medium');
            const hardQuestions = allQuestions.filter(q => q.difficulty === 'hard');

            // If the question set do not contain enough questions, alert the user
            if (easyQuestions.length < tempDistribution.easy) {
                alert(`Not enough easy questions in the selected set. Available: ${easyQuestions.length}`);
                return;
            }
            if (mediumQuestions.length < tempDistribution.medium) {
                alert(`Not enough medium questions in the selected set. Available: ${mediumQuestions.length}`);
                return;
            }
            if (hardQuestions.length < tempDistribution.hard) {
                alert(`Not enough hard questions in the selected set. Available: ${hardQuestions.length}`);
                return;
            }
    
            console.log('Filtered Questions:', {
                easy: easyQuestions.length,
                medium: mediumQuestions.length,
                hard: hardQuestions.length
            });
            
            const response = await axios.put(`${BACKEND_URL}/tests/${id}`, updateData, {
                withCredentials: true
            });
            
            if (response.status === 200) {
                setTest(prev => ({ ...prev, questionSetId: setId || null }));
                alert(setId ? "Test updated with question set successfully!" : "Question set removed successfully!");
            }
        } catch (error) {
            console.error("Error updating test with question set:", error);
            alert("Failed to update test with question set. Please try again.");
        }
    };

    // Handle updating test mode
    const handleModeChange = async (mode) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/tests/${id}`, {
                mode: mode
            }, {
                withCredentials: true
            });
            if (response.status === 200) {
                setTest(prev => ({ ...prev, mode: mode }));
                alert("Test mode updated successfully!");
            }
        } catch (error) {
            console.error("Error updating test mode:", error);
            alert("Failed to update test mode. Please try again.");
        }
    };

    // Handle copying test ID to clipboard
    const copyTestId = () => {
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Handle adding a student
    const handleAddStudent = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            // Find student by username or email
            const studentResponse = await axios.get(`${BACKEND_URL}/users/find`, {
                params: { 
                    [searchType]: identifier,
                    isTeacher: false 
                },
                withCredentials: true
            });

            console.log(studentResponse);
            
            if (studentResponse.status === 200) {
                const student = studentResponse.data;
                
                // Check if student is already assigned
                if (assignedStudents.some(s => s._id === student._id)) {
                    setError("This student is already assigned to the test.");
                    return;
                }

                // Update the test
                const response = await axios.put(`${BACKEND_URL}/tests/${id}`, {
                    assignedStudentsId: [...(test.assignedStudentsId || []), student._id]
                }, {
                    withCredentials: true
                });
                
                if (response.status === 200) {
                    setTest(prev => ({
                        ...prev,
                        assignedStudentsId: [...(prev.assignedStudentsId || []), student._id]
                    }));
                    setAssignedStudents(prev => [...prev, student]);
                    setIdentifier("");
                    setError("");
                }
            }
        } catch (error) {
            console.error("Error adding student:", error);
            if (error.response?.status === 404) {
                setError("Student not found. Please check the " + searchType + " and try again.");
            } else if (error.response?.status === 401) {
                setError("Please login again to continue.");
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    // Handle removing a student
    const handleRemoveStudent = async (studentId) => {
        try {
            // Remove student from test
            const response = await axios.put(`${BACKEND_URL}/tests/${id}`, {
                assignedStudentsId: test.assignedStudentsId.filter(id => id !== studentId)
            }, {
                withCredentials: true
            });
            
            if (response.status === 200) {
                setTest(prev => ({
                    ...prev,
                    assignedStudentsId: prev.assignedStudentsId.filter(id => id !== studentId)
                }));
                setAssignedStudents(prev => prev.filter(student => student._id !== studentId));
            }
        } catch (error) {
            console.error("Error removing student:", error);
            alert("Failed to remove student. Please try again.");
        }
    };

    const handleAllowMultipleAttempts = async (e) => {
        const { checked } = e.target;
        console.log("Allow multiple attempts:", checked);
        try {
            const response = await axios.put(`${BACKEND_URL}/tests/${id}`, {
                multipleAttempts: checked
            }, {
                withCredentials: true
            });
            if (response.status === 200) {
                setTest(prev => ({ ...prev, multipleAttempts: checked }));
                alert("Test updated successfully!");
            }
        } catch (error) {
            console.error("Error updating test settings:", error);
            alert("Failed to update test settings. Please try again.");
        }
    };

    // Handle publishing test
    const handlePublish = async () => {
        try {
            // Validate that a question set is selected
            if (!test.questionSetId) {
                alert("Please select a question set before publishing the test.");
                return;
            }

            // Validate that test mode is selected
            if (!test.mode) {
                alert("Please select a test mode before publishing the test.");
                return;
            }

            // Update test status to published
            const response = await axios.put(`${BACKEND_URL}/tests/${id}`, {
                status: 'published'
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                setTest(prev => ({ ...prev, status: 'published' }));
                alert("Test published successfully!");
            }
        } catch (error) {
            console.error("Error publishing test:", error);
            alert("Failed to publish test. Please try again.");
        }
    };

    // Handle canceling published test
    const handleCancelPublish = async () => {
        try {
            // Update test status back to draft
            const response = await axios.put(`${BACKEND_URL}/tests/${id}`, {
                status: 'draft'
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                setTest(prev => ({ ...prev, status: 'draft' }));
                alert("Test status changed back to draft.");
            }
        } catch (error) {
            console.error("Error canceling publish:", error);
            alert("Failed to cancel publish. Please try again.");
        }
    };

    // Update the handleDistributionChange function
    const handleDistributionChange = (field, value) => {
        if (test.status === 'published') {
            alert("Cannot modify question distribution while test is published");
            return;
        }

        const newValue = parseInt(value) || 0;
        setTempDistribution(prev => ({
            ...prev,
            [field]: newValue
        }));
    };

    // Add this function after other handler functions
    const validateQuestionSetCapacity = () => {
        if (!test.questionSetId) {
            alert("Please select a question set first");
            return false;
        }

        const selectedSet = questionSets.find(set => set._id === test.questionSetId);
        if (!selectedSet) {
            alert("Selected question set not found");
            return false;
        }

        // Check if the question set has enough questions of each difficulty
        if (tempDistribution.easy > selectedSet.easy) {
            alert(`Not enough easy questions in the selected set. Available: ${selectedSet.easy}`);
            return false;
        }
        if (tempDistribution.medium > selectedSet.medium) {
            alert(`Not enough medium questions in the selected set. Available: ${selectedSet.medium}`);
            return false;
        }
        if (tempDistribution.hard > selectedSet.hard) {
            alert(`Not enough hard questions in the selected set. Available: ${selectedSet.hard}`);
            return false;
        }

        return true;
    };

    // Update the handleConfirmDistribution function
    const handleConfirmDistribution = async () => {
        // Validate total questions
        const total = tempDistribution.easy + tempDistribution.medium + tempDistribution.hard;
        if (total !== tempDistribution.totalQuestions) {
            alert("Sum of easy, medium, and hard questions must equal total questions");
            return;
        }

        // Validate question set capacity
        if (!validateQuestionSetCapacity()) {
            return;
        }

        try {
            const response = await axios.put(`${BACKEND_URL}/tests/${id}`, {
                totalQuestions: tempDistribution.totalQuestions,
                easy: tempDistribution.easy,
                medium: tempDistribution.medium,
                hard: tempDistribution.hard
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                setTest(prev => ({
                    ...prev,
                    totalQuestions: tempDistribution.totalQuestions,
                    easy: tempDistribution.easy,
                    medium: tempDistribution.medium,
                    hard: tempDistribution.hard
                }));
                alert("Question distribution updated successfully!");
            }
        } catch (error) {
            console.error("Error updating question distribution:", error);
            alert("Failed to update question distribution. Please try again.");
        }
    };

    const handleViewResults = () => {
        navigate(`/tests/${id}/results`);
    };

    if (!test) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-background p-4">
            <div className="w-[80%] flex justify-start mb-4">
                <BackButton />
            </div>

            <div className="md:w-[80%] bg-card shadow-lg rounded-lg p-8">
                <TestHeader test={test} handlePublish={handlePublish} handleCancelPublish={handleCancelPublish} />

                <p className="text-gray-600 mb-6">{test.description}</p>
                <div className="mb-6">
                    <span className="font-semibold">Duration:</span> {test.duration} minutes
                </div>

                <TestMode test={test} handleModeChange={handleModeChange} copyTestId={copyTestId} copied={copied} id={id} />

                {test.mode === 'assigned' && (
                    <AssignedStudents
                        test={test}
                        assignedStudents={assignedStudents}
                        handleAddStudent={handleAddStudent}
                        handleRemoveStudent={handleRemoveStudent}
                        searchType={searchType}
                        setSearchType={setSearchType}
                        identifier={identifier}
                        setIdentifier={setIdentifier}
                        error={error}
                    />
                )}

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Select Question Set</h2>
                    <div className="flex gap-4 items-center">
                        <select
                            onChange={(e) => handleSetSelect(e.target.value)}
                            className={`flex-1 p-2 border rounded-md ${test.status === 'published' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            value={test.questionSetId || ""}
                            disabled={test.status === 'published'}
                        >
                            <option value="">Select a question set</option>
                            {questionSets.map((set) => (
                                <option key={set._id} value={set._id}>
                                    {set.name} (Easy: {set.easy}, Medium: {set.medium}, Hard: {set.hard})
                                </option>
                            ))}
                        </select>
                        {test.questionSetId && test.status !== 'published' && (
                            <button
                                onClick={() => handleSetSelect("")}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Remove Set
                            </button>
                        )}
                    </div>
                    {!test.questionSetId && test.status === 'draft' && (
                        <p className="mt-2 text-sm text-red-500">
                            Please select a question set before publishing the test.
                        </p>
                    )}
                    {test.status === 'published' && (
                        <p className="mt-2 text-sm text-gray-500">
                            Question set cannot be changed while the test is published.
                        </p>
                    )}
                </div>

                <div className="flex items-center mb-8">
                    <input
                        type="checkbox"
                        checked={test.multipleAttempts}
                        onChange={handleAllowMultipleAttempts}
                        className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                    />
                    <span className="text-gray-700">Allow Multiple Attempts</span>
                </div>

                <QuestionDistribution
                    test={test}
                    tempDistribution={tempDistribution}
                    handleDistributionChange={handleDistributionChange}
                    handleConfirmDistribution={handleConfirmDistribution}
                />

                <div className="mb-8">
                    <button
                        onClick={handleViewResults}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        View Test Results
                    </button>
                </div>
            </div>
        </div>
    );
}