import { useAuth } from "../hooks/useAuth";

export default function Home() {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <h1 className="text-hero font-bold text-primary mb-4">Welcome {user.username} và mày là {user.isTeacher ? <h1>student</h1> : <h1>teacher</h1>}</h1>
            <p className="text-body text-textPrimary mb-8">Your journey to knowledge starts here.</p>
            <button className="bg-primary text-white py-2 px-4 rounded shadow hover:bg-secondary transition duration-300" onClick={logout}>
                Get Started
            </button>
        </div>
    );
}