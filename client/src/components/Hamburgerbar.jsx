import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Hamburgerbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const handleLogout = async () => {
    await logout();
  };
  return (
    <div className="p-4">
      {/* Hamburger Button */}
      <button
        className="flex flex-col space-y-1.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block w-8 h-1 bg-black transition-all" />
        <span className="block w-8 h-1 bg-black transition-all" />
        <span className="block w-8 h-1 bg-black transition-all" />
      </button>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          
          <ul className="space-y-4">
            
            {user.isTeacher ? (
                <>
                    <li><a href="/teacher-dashboard" className="text-lg">Dashboard</a></li>
                    <li><a href="/teacher-dashboard/question-set" className="text-lg">Question set</a></li>
                    <li><a href="/teacher-dashboard/test" className="text-lg">Test</a></li>
                </>
            ) : (
                <> 
                    <li><a href="/student-dashboard" className="text-lg">Dashboard</a></li>
                    <li><a href="/student-dashboard/test-search" className="text-lg">Test search</a></li>
                    <li><a href="/student-dashboard/enter-test-id" className="text-lg">Take test with code</a></li>
                    <li><a href="/student-dashboard/test" className="text-lg">Test</a></li>
                </>
            )}
            <button 
                onClick={handleLogout} 
                className="w-full mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
            >
                Logout
            </button>
            <button 
                onClick={() => setIsOpen(false)} 
                className="w-full mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
                Close
            </button>
                
          </ul>
        </div>
      </div>
    </div>
  );
}
