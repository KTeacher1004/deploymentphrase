import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Hamburgerbar from "../components/Hamburgerbar";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [Sets, setSets] = useState([]);
  const [Tests, setTests] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchSets = async () => {
        try {
            const SetResponse = await axios.get(`${BACKEND_URL}/question-sets/teacher/${user._id}`);
            if (SetResponse.status === 200) {
                setSets(SetResponse.data);
            } else {
                console.error('Failed to fetch question sets:', SetResponse.statusText);
            }

            const TestResponse = await axios.get(`${BACKEND_URL}/tests/teacher/${user._id}`);
            if (TestResponse.status === 200) {
                setTests(TestResponse.data);
            } else {
                console.error('Failed to fetch tests:', TestResponse.statusText);
            }
        } catch (error) {
            console.error('Error fetching question sets:', error);
        }
    };
    fetchSets();
  }, [user._id, BACKEND_URL]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Hamburger Menu */}
      
      {/* Main Content */}
      <main className="flex-1 p-10 bg-background md:ml-64">
        <div className="flex items-center justify-between mb-4">
          <Hamburgerbar />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.username || "Teacher"} 👋</h1>
        <p className="text-gray-600">Here’s your teaching control center 🧑‍🏫.</p>

        {/* Some dashboard boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          
          <div className="bg-card shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700">Question Sets</h2>
            <p className="text-gray-500 mt-2">Manage and edit your question sets.</p>

            {/* Display first 5 question sets */}
            <ul className="mt-4">
              {Sets.slice(0, 5).map((set) => (
                <li key={set._id} className="text-blue-500 hover:underline">
                  <a href={`/teacher-dashboard/question-set/${set._id}`}>
                    <div className="flex items-center justify-between p-2 border border-gray-200">
                      <p className="font-semibold">{set.name}</p>
                      <p className="text-gray-600 text-sm">Easy: {set.easy} | Medium: {set.medium} | Hard: {set.hard}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700">Tests Created</h2>
            <p className="text-gray-500 mt-2">Manage and edit your tests.</p>

            {/* Display first 5 tests */}
            <ul className="mt-4">
              {Tests.slice(0, 5).map((test) => (
                <li key={test._id} className="text-blue-500 hover:underline">
                  <a href={`/teacher-dashboard/test/${test._id}`}>
                    <div className="flex items-center justify-between p-2 border border-gray-200">
                      <p className="font-semibold">{test.title}</p>
                      <p className="text-gray-600 text-sm">Duration: {test.duration} mins</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700">Submissions</h2>
            <p className="text-gray-500 mt-2">Review completed tests from students.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
