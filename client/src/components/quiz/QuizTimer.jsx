import React from 'react';

const QuizTimer = ({ countdown, isFinished }) => {
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className={`text-sm font-semibold text-red-600 ${isFinished ? 'opacity-0' : 'opacity-100'}`}>
      ⏳ {formatTime(countdown)}
    </div>
  );
};

export default QuizTimer; 