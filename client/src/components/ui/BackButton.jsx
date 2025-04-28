import { useNavigate } from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button 
            onClick={handleBack} 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg">
            &larr; Back
        </button>
    );
}
