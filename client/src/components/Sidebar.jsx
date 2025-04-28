import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
    const { logout, user } = useAuth();
    
    const handleLogout = async () => {
        await logout();
    };

    return (
        <aside className="hidden w-64 bg-[#1E293B] text-white p-6 md:flex flex-col fixed h-full">
        <h2 className="text-2xl font-bold mb-6">🎓 Ecademy</h2>
        <nav className="flex flex-col gap-4 text-lg">
          { user.isTeacher ? (
            <>
            <a href="/teacher-dashboard" className="hover:text-yellow-400">🏠 Dashboard</a>
            <a href="/teacher-dashboard/question-set" className="hover:text-yellow-400">🧠 Question Sets</a>
            <a href="/teacher-dashboard/test" className="hover:text-yellow-400">📝 Tests</a>
            </> 
          ) : (
            <>
            <a href="/teacher-dashboard" className="hover:text-yellow-400">🏠 Dashboard</a>
            <a href="/teacher-dashboard/test" className="hover:text-yellow-400">📝 Assigned Tests</a>
            <a href="/student-dashboard/test-search" className="hover:text-yellow-400">🔍 Search Tests</a>
            <a href="/student-dashboard/enter-test-id" className="hover:text-yellow-400">📝 Take test with code</a>
            </>  
          )}
        </nav>
        <button 
          onClick={handleLogout} 
          className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      </aside>
    );
}