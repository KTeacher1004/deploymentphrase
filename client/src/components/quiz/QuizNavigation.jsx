import React from 'react';

const QuizNavigation = ({
  current,
  totalQuestions,
  onPrev,
  onNext,
  onSubmit,
  isFinished
}) => {
  return (
    <div className="flex justify-between">
      <button
        onClick={onPrev}
        disabled={current === 0}
        className={`px-4 py-2 rounded-lg font-medium ${
          current === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        ← Back
      </button>
      {current === totalQuestions - 1 ? (
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Submit ✅
        </button>
      ) : (
        <button
          onClick={onNext}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          Next →
        </button>
      )}
    </div>
  );
};

export default QuizNavigation; 