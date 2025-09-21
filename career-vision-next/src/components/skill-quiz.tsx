"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, Brain, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";

interface QuizQuestion {
  id: number;
  skill: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
}

interface SkillQuizProps {
  skill: string;
  onComplete: (score: number, level: string) => void;
  onClose: () => void;
}

const skillQuestions: Record<string, QuizQuestion[]> = {
  "JavaScript": [
    {
      id: 1,
      skill: "JavaScript",
      question: "What will console.log(typeof null) output?",
      options: ["null", "undefined", "object", "boolean"],
      correctAnswer: 2,
      difficulty: "beginner",
      explanation: "In JavaScript, typeof null returns 'object'. This is a well-known quirk in the language."
    },
    {
      id: 2,
      skill: "JavaScript",
      question: "What is the result of: [1, 2, 3].map(x => x * 2)?",
      options: ["[1, 2, 3]", "[2, 4, 6]", "6", "undefined"],
      correctAnswer: 1,
      difficulty: "beginner",
      explanation: "The map() method creates a new array with the results of calling a function for every array element."
    },
    {
      id: 3,
      skill: "JavaScript",
      question: "What is a closure in JavaScript?",
      options: [
        "A way to close a function",
        "A function that has access to variables in its outer scope",
        "A method to end a loop",
        "A way to import modules"
      ],
      correctAnswer: 1,
      difficulty: "intermediate",
      explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has finished executing."
    },
    {
      id: 4,
      skill: "JavaScript",
      question: "What is the difference between '==' and '===' in JavaScript?",
      options: [
        "No difference",
        "'==' checks type, '===' checks value",
        "'==' allows type coercion, '===' checks both type and value",
        "'===' is faster"
      ],
      correctAnswer: 2,
      difficulty: "intermediate",
      explanation: "'==' performs type coercion if the types are different, while '===' strictly compares both value and type."
    },
    {
      id: 5,
      skill: "JavaScript",
      question: "What is the output of: console.log(1 + '2' + 3)?",
      options: ["6", "'123'", "'15'", "TypeError"],
      correctAnswer: 1,
      difficulty: "advanced",
      explanation: "Due to operator precedence and type coercion, 1 + '2' becomes '12', then '12' + 3 becomes '123'."
    }
  ],
  "React": [
    {
      id: 1,
      skill: "React",
      question: "What is JSX?",
      options: [
        "A JavaScript library",
        "A syntax extension for JavaScript",
        "A CSS framework",
        "A database query language"
      ],
      correctAnswer: 1,
      difficulty: "beginner",
      explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files."
    },
    {
      id: 2,
      skill: "React",
      question: "What is the purpose of useState hook?",
      options: [
        "To fetch data from APIs",
        "To manage component state",
        "To handle side effects",
        "To optimize performance"
      ],
      correctAnswer: 1,
      difficulty: "beginner",
      explanation: "useState is a React hook that allows you to add state to functional components."
    },
    {
      id: 3,
      skill: "React",
      question: "When should you use useEffect?",
      options: [
        "For state management",
        "For handling events",
        "For side effects and lifecycle events",
        "For rendering components"
      ],
      correctAnswer: 2,
      difficulty: "intermediate",
      explanation: "useEffect is used for handling side effects like API calls, subscriptions, and lifecycle events in functional components."
    },
    {
      id: 4,
      skill: "React",
      question: "What is the virtual DOM?",
      options: [
        "A copy of the real DOM",
        "A JavaScript representation of the DOM",
        "A browser API",
        "A React component"
      ],
      correctAnswer: 1,
      difficulty: "intermediate",
      explanation: "The virtual DOM is a JavaScript representation of the real DOM that React uses to optimize updates."
    },
    {
      id: 5,
      skill: "React",
      question: "What is React.memo used for?",
      options: [
        "Memory management",
        "Component memoization for performance",
        "State persistence",
        "Error handling"
      ],
      correctAnswer: 1,
      difficulty: "advanced",
      explanation: "React.memo is a higher-order component that memoizes the result and only re-renders if props change."
    }
  ]
};

export default function SkillQuiz({ skill, onComplete, onClose }: SkillQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = skillQuestions[skill] || [];
  const currentQ = questions[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const percentage = (correctAnswers / questions.length) * 100;
    setScore(percentage);
    
    let level = 'beginner';
    if (percentage >= 80) level = 'expert';
    else if (percentage >= 60) level = 'advanced';
    else if (percentage >= 40) level = 'intermediate';
    
    setShowResults(true);
    onComplete(percentage, level);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  if (!questions.length) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl p-8 max-w-md w-full"
        >
          <div className="text-center">
            <Brain className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
              Quiz Not Available
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Quiz for {skill} is not available yet. We'll add it soon!
            </p>
            <button
              onClick={onClose}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {!showResults ? (
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                  {skill} Assessment
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-8">
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Question */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQ.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  currentQ.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentQ.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-neutral-300'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                      <span className="text-neutral-800 dark:text-neutral-200">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2 px-6 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center"
            >
              <Brain className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
              Quiz Complete!
            </h2>

            <div className="text-6xl font-bold text-orange-500 mb-4">
              {Math.round(score)}%
            </div>

            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
              Based on your performance, your {skill} skill level is:{" "}
              <span className="font-semibold text-orange-500 capitalize">
                {score >= 80 ? 'Expert' : score >= 60 ? 'Advanced' : score >= 40 ? 'Intermediate' : 'Beginner'}
              </span>
            </p>

            {/* Detailed Results */}
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                Question Review
              </h3>
              <div className="space-y-3">
                {questions.map((question, index) => {
                  const isCorrect = selectedAnswers[index] === question.correctAnswer;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Question {index + 1}
                      </span>
                      <div className="flex items-center space-x-2">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          isCorrect ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={restartQuiz}
                className="flex items-center space-x-2 px-6 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Use This Assessment
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}