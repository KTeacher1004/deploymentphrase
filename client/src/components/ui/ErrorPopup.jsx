import { useEffect, useState } from "react";

export default function ErrorPopup({ message, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 2700); // Fade out
    const removeTimer = setTimeout(onClose, 3000); // Auto close

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-[9999] flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg pointer-events-auto">
        <p className="text-lg font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 bg-white text-red-500 px-3 py-1 rounded-md font-bold hover:bg-gray-200"
        >
          OK
        </button>
      </div>
    </div>
  );
}
