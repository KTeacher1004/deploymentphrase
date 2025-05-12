import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RedirectByRole from "./components/RedirectByRole";
import TeacherDashboard from "./pages/TeacherDashboard";
import QuestionSet from "./pages/QuestionSet";
import QuestionSetDetail from "./pages/QuestionSetDetail";
import "./App.css";
import Test from "./pages/Test";
import TestDetail from "./pages/TestDetail";
import StudentDashboard from "./pages/StudentDashboard";
import TakeQuiz from "./pages/TakeQuiz";
import Home from "./pages/Home";

export default function App() {
    return (
        <>
            <Routes>
                <Route
                    path="/home"
                    element={
                        <ProtectedRoutes>
                            <RedirectByRole />
                        </ProtectedRoutes>
                    }
                />
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/teacher-dashboard" element={<ProtectedRoutes isTeacher={true}><TeacherDashboard /></ProtectedRoutes>} />
                <Route path="/teacher-dashboard/question-set" element={<ProtectedRoutes isTeacher={true}><QuestionSet /></ProtectedRoutes>} />
                <Route path="/teacher-dashboard/question-set/:id" element={<ProtectedRoutes isTeacher={true}><QuestionSetDetail /></ProtectedRoutes>} />
                <Route path="/teacher-dashboard/test" element={<ProtectedRoutes isTeacher={true}><Test /></ProtectedRoutes>} />
                <Route path="/teacher-dashboard/test/:id" element={<ProtectedRoutes isTeacher={true}><TestDetail /></ProtectedRoutes>} />

                <Route path="/student-dashboard/take-quiz/:id" element={<ProtectedRoutes isTeacher={false}><TakeQuiz /></ProtectedRoutes>} />
                <Route path="/student-dashboard" element={<ProtectedRoutes isTeacher={false}><StudentDashboard /></ProtectedRoutes>} />
                <Route path="*" element={<div className="flex justify-center items-center h-screen">404 Not Found</div>} />
            </Routes>
        </>
    );
}