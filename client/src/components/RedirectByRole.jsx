import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RedirectByRole() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  console.log(user);

  return user.isTeacher == true ? (
    <Navigate to="/teacher-dashboard" replace />
  ) : (
    <Navigate to="/student-dashboard" replace />
  );
}
