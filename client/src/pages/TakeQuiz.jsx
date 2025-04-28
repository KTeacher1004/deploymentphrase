import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import QuizTimer from "../components/quiz/QuizTimer";
import QuizQuestion from "../components/quiz/QuizQuestion";
import QuizNavigation from "../components/quiz/QuizNavigation";
import QuizResults from "../components/quiz/QuizResults";
import { useAuth } from "../hooks/useAuth";

export default function TakeQuiz() {
  const [current, setCurrent] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        // Fetch test details
        const testResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tests/${id}`);
        const testData = testResponse.data;
        console.log('Test Data:', testData);
        setTest(testData);
        setCountdown(testData.duration * 60);

        // Check if the test allows multiple attempts
        if (!testData.multipleAttempts) {
          const attemptsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/test-results/${testData._id}/results`);
          console.log('Attempts:', attemptsResponse.data);
          if (attemptsResponse.data.length > 0) {
            attemptsResponse.data.forEach(attempt => {
              if (attempt.studentId._id === user._id) {
                alert("You have already completed this test. You cannot retake it.");
                navigate('/student-dashboard', { replace: true });
                return
              }
            });
          }
        }
        // Fetch questions for the question set
        const questionsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/questions`,
          {
            params: {
              questionSetId: testData.questionSetId
            }
          }
        );
        const allQuestions = questionsResponse.data;

        // Filter questions by difficulty
        const easyQuestions = allQuestions.filter(q => q.difficulty === 'easy');
        const mediumQuestions = allQuestions.filter(q => q.difficulty === 'medium');
        const hardQuestions = allQuestions.filter(q => q.difficulty === 'hard');

        // Get question counts from test data
        const easyCount = testData.easy || 0;
        const mediumCount = testData.medium || 0;
        const hardCount = testData.hard || 0;
        // Randomly select questions based on distribution
        const selectedQuestions = [
          ...getRandomQuestions(easyQuestions, easyCount),
          ...getRandomQuestions(mediumQuestions, mediumCount),
          ...getRandomQuestions(hardQuestions, hardCount)
        ];
        // Shuffle all selected questions
        const shuffledQuestions = shuffleArray(selectedQuestions);
        setQuestions(shuffledQuestions);
      } catch (err) {
        console.error('Error fetching test:', err);
        setError(err.response?.data?.message || 'Failed to load test');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const getRandomQuestions = (questions, count) => {
    if (!questions.length || count <= 0) return [];
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    if (isFinished || !countdown) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          submitQuiz();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, countdown]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isFinished) {
        event.preventDefault();
        event.returnValue = "If you leave, your test will be submitted automatically.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFinished]);

  useEffect(() => {
    const handleNavigation = () => {
      if (!isFinished) {
        alert("You cannot navigate away during the test. Your test will be submitted automatically.");
        navigate(location.pathname, { replace: true });
      }
    };

    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [isFinished, navigate, location.pathname]);

  const selectAnswer = (optionKey) => {
    if (isFinished) return;
    setSelectedAnswers({ ...selectedAnswers, [current]: optionKey });
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      let totalScore = 0;
      const answers = questions.map((q, i) => ({
        questionId: q._id,
        selectedAnswer: selectedAnswers[i] || "" // Use null if no answer selected
      }));
      console.log('Answers:', answers);

      // Calculate score
      questions.forEach((q, i) => {
        if (selectedAnswers[i] && selectedAnswers[i] === q.correctAnswer) {
          totalScore += 1;
        }
      });

      //Submit test attempt
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/test-results/submit`, {
        studentId: user._id,
        testId: id,
        answers,
        score: (totalScore / questions.length) * 100,
        trueAnswer: totalScore,
      });

      setScore(totalScore);
      setIsFinished(true);
    } catch (err) {
      console.error('Error submitting test:', err);
      setError('Failed to submit test. Please try again.');
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setSelectedAnswers({});
    setCountdown(test.duration * 60);
    setIsFinished(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 to-indigo-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 to-indigo-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 to-indigo-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No questions available for this test.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full text-gray-800">
        <QuizTimer countdown={countdown} isFinished={isFinished} />
        {!isFinished ? (
          <>
            <QuizQuestion
              question={questions[current]}
              selectedAnswer={selectedAnswers[current]}
              isFinished={isFinished}
              onSelectAnswer={selectAnswer}
              currentIndex={current}
              totalQuestions={questions.length}
            />
            <QuizNavigation
              current={current}
              totalQuestions={questions.length}
              onPrev={prevQuestion}
              onNext={nextQuestion}
              onSubmit={submitQuiz}
              isFinished={isFinished}
            />
          </>
        ) : (
          <QuizResults
            score={score}
            totalQuestions={questions.length}
            onRetry={resetQuiz}
            navigateToDashboard={() => navigate('/student-dashboard')}
          />
        )}
      </div>
    </div>
  );
}
