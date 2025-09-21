"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Brain, CheckCircle, Trophy, Target, Play } from "lucide-react";
import { CardSpotlight } from "./ui/card-spotlight";
import { CometCard } from "./ui/comet-card";
import PredictionForm from "./prediction-form";

interface QuizQuestion {
  id: number;
  question_text: string;
  choices: {
    id: number;
    choice_text: string;
    is_correct: boolean;
  }[];
}

export default function TwoStageAssessment() {
  const [currentStage, setCurrentStage] = useState<'intro' | 'quiz' | 'personal'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResults, setShowQuizResults] = useState(false);

  // MCQ Quiz Questions (similar to Django model structure)
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question_text: "What is the time complexity of binary search?",
      choices: [
        { id: 1, choice_text: "O(n)", is_correct: false },
        { id: 2, choice_text: "O(log n)", is_correct: true },
        { id: 3, choice_text: "O(n²)", is_correct: false },
        { id: 4, choice_text: "O(1)", is_correct: false }
      ]
    },
    {
      id: 2,
      question_text: "Which programming paradigm does Python primarily support?",
      choices: [
        { id: 5, choice_text: "Only Object-Oriented", is_correct: false },
        { id: 6, choice_text: "Only Functional", is_correct: false },
        { id: 7, choice_text: "Multi-paradigm", is_correct: true },
        { id: 8, choice_text: "Only Procedural", is_correct: false }
      ]
    },
    {
      id: 3,
      question_text: "What does SQL stand for?",
      choices: [
        { id: 9, choice_text: "Structured Query Language", is_correct: true },
        { id: 10, choice_text: "Simple Query Language", is_correct: false },
        { id: 11, choice_text: "Standard Query Language", is_correct: false },
        { id: 12, choice_text: "System Query Language", is_correct: false }
      ]
    },
    {
      id: 4,
      question_text: "Which of the following is NOT a principle of Object-Oriented Programming?",
      choices: [
        { id: 13, choice_text: "Encapsulation", is_correct: false },
        { id: 14, choice_text: "Inheritance", is_correct: false },
        { id: 15, choice_text: "Compilation", is_correct: true },
        { id: 16, choice_text: "Polymorphism", is_correct: false }
      ]
    },
    {
      id: 5,
      question_text: "What is the primary purpose of version control systems like Git?",
      choices: [
        { id: 17, choice_text: "Code compilation", is_correct: false },
        { id: 18, choice_text: "Track changes and collaborate", is_correct: true },
        { id: 19, choice_text: "Database management", is_correct: false },
        { id: 20, choice_text: "User interface design", is_correct: false }
      ]
    }
  ];

  const handleQuizAnswer = (questionId: number, choiceId: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: choiceId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateQuizScore();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateQuizScore = () => {
    let score = 0;
    quizQuestions.forEach(question => {
      const selectedChoiceId = quizAnswers[question.id];
      if (selectedChoiceId) {
        const selectedChoice = question.choices.find(choice => choice.id === selectedChoiceId);
        if (selectedChoice?.is_correct) {
          score += 1;
        }
      }
    });
    setQuizScore(score);
    setShowQuizResults(true);
  };

  const proceedToPersonalQuestions = () => {
    setCurrentStage('personal');
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const selectedAnswer = quizAnswers[currentQuestion?.id];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  if (currentStage === 'personal') {
    return <PredictionForm initialQuizScore={quizScore} />;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {currentStage === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Career Assessment Journey
              </h1>
              
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-8">
                Discover your perfect career path through our comprehensive two-stage assessment process
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <CometCard className="h-full">
                <div className="p-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 h-full flex flex-col">
                  <div className="text-center flex-grow">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">
                      Stage 1: Knowledge Quiz
                    </h3>
                    
                    <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                      Test your technical expertise with <span className="font-semibold text-blue-500">{quizQuestions.length} carefully crafted questions</span> covering:
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Programming & Algorithms
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                        Database Management
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        Software Development
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                        <span className="text-lg">📊</span>
                        Generates your logical quotient rating
                      </div>
                    </div>
                  </div>
                </div>
              </CometCard>

              <CometCard className="h-full">
                <div className="p-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 h-full flex flex-col">
                  <div className="text-center flex-grow">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">
                      Stage 2: Personal Profile
                    </h3>
                    
                    <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                      Share your <span className="font-semibold text-purple-500">unique background</span> for personalized insights including:
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Interests & Preferences
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                        Skills & Experience
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                        Career Goals
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 font-medium">
                        <span className="text-lg">🎯</span>
                        AI-powered career matching
                      </div>
                    </div>
                  </div>
                </div>
              </CometCard>
            </div>

            <motion.button
              onClick={() => setCurrentStage('quiz')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all duration-300 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-5 h-5" />
              Start Assessment
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        )}

        {currentStage === 'quiz' && !showQuizResults && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Knowledge Quiz</h2>
                    <p className="text-neutral-400">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                  </div>
                </div>
                <div className="text-blue-400 font-medium">
                  {Math.round(progress)}% Complete
                </div>
              </div>
              
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <CardSpotlight className="p-8 mb-8">
              <div className="relative z-20">
                <h3 className="text-xl font-semibold text-white mb-6">
                  {currentQuestion?.question_text}
                </h3>
                
                <div className="space-y-4">
                  {currentQuestion?.choices.map((choice) => (
                    <motion.button
                      key={choice.id}
                      onClick={() => handleQuizAnswer(currentQuestion.id, choice.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 relative z-30 ${
                        selectedAnswer === choice.id
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white bg-neutral-800/50'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      style={{ pointerEvents: 'auto' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedAnswer === choice.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-neutral-500'
                        }`}>
                          {selectedAnswer === choice.id && (
                            <motion.div
                              className="w-full h-full rounded-full bg-white"
                              initial={{ scale: 0 }}
                              animate={{ scale: 0.6 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </div>
                        <span>{choice.choice_text}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </CardSpotlight>

            <div className="flex justify-between relative z-30">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 text-neutral-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-neutral-800/50 rounded-lg"
                style={{ pointerEvents: 'auto' }}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ pointerEvents: 'auto' }}
              >
                {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {currentStage === 'quiz' && showQuizResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mb-8">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
              <p className="text-xl text-neutral-400">
                Great job! You've completed the knowledge assessment.
              </p>
            </div>

            <CardSpotlight className="p-8 mb-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {quizScore}/{quizQuestions.length}
                </div>
                <div className="text-neutral-400 mb-4">Questions Correct</div>
                
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <CheckCircle 
                        className={`w-6 h-6 mx-1 ${
                          i < Math.round((quizScore / quizQuestions.length) * 5) 
                            ? 'text-green-500' 
                            : 'text-neutral-600'
                        }`} 
                      />
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-sm text-green-400 font-medium">
                  Logical Quotient Rating: {quizScore}/10
                </div>
              </div>
            </CardSpotlight>

            <motion.button
              onClick={proceedToPersonalQuestions}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all duration-300 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue to Personal Assessment
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}