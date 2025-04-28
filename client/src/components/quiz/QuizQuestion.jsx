import React from 'react';

const QuizQuestion = ({
  question,
  selectedAnswer,
  isFinished,
  onSelectAnswer,
  currentIndex,
  totalQuestions
}) => {
  const getOptionsArray = (options) => {
    if (!options) return [];
    return Object.entries(options).map(([key, value]) => ({
      key,
      value
    }));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          Question {currentIndex + 1} / {totalQuestions}
        </h2>
      </div>

      <p className="text-lg font-medium mb-4">
        {question?.text}
      </p>
      <ul className="space-y-3 mb-6">
        {getOptionsArray(question?.options).map((opt) => {
          const isCorrect = question.correctAnswer === opt.key;
          const isSelected = selectedAnswer === opt.key;

          let optionStyle = "hover:bg-indigo-50 border-gray-300";
          if (isFinished) {
            if (isCorrect) {
              optionStyle = "bg-green-100 border-green-400";
            } else if (isSelected && !isCorrect) {
              optionStyle = "bg-red-100 border-red-400";
            }
          } else if (isSelected) {
            optionStyle =
              "bg-indigo-100 border-indigo-400 ring-2 ring-indigo-300";
          }

          return (
            <li
              key={opt.key}
              onClick={() => !isFinished && onSelectAnswer(opt.key)}
              className={`px-4 py-3 rounded-xl border cursor-pointer transition-all ${optionStyle}`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                  isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-100'
                }`}>
                  {opt.key}
                </div>
                <span>{opt.value}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default QuizQuestion; 