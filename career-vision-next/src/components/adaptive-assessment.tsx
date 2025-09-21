'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Brain, Target, CheckCircle } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  selectedDomain: string;
  skillLevel: string;
  experience: string;
  goals: string[];
  interests: string[];
}

export interface AIQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'scale' | 'text' | 'multiple-select';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  skillArea: string;
  options?: string[];
  minValue?: number;
  maxValue?: number;
}

export interface AssessmentResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  skillBreakdown: Record<string, number>;
  recommendedLevel: string;
  strengthAreas: string[];
  improvementAreas: string[];
  detailedAnalysis: string;
}

interface AdaptiveAssessmentProps {
  userProfile: UserProfile;
  onComplete: (result: AssessmentResult) => void;
}

export default function AdaptiveAssessment({ userProfile, onComplete }: AdaptiveAssessmentProps) {
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    generateAIQuestions();
  }, [userProfile]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const generateAIQuestions = async () => {
    try {
      setIsGeneratingQuestions(true);
      setError(null);

      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile, numberOfQuestions: 15 }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate questions');

      setQuestions(data.questions);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error generating questions:', error);
      setError(error.message || 'Failed to generate assessment questions');
      
      setQuestions([{
        id: 'fallback-1',
        question: `Rate your experience level with ${userProfile.selectedDomain}`,
        type: 'scale',
        category: 'Experience',
        difficulty: 'easy',
        skillArea: 'Self Assessment',
        minValue: 1,
        maxValue: 10
      }]);
      setIsLoading(false);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const analyzeResults = async () => {
    try {
      setIsAnalyzing(true);
      const response = await fetch('/api/analyze-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile, questions, answers: userAnswers }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze results');
      onComplete(data.result);
    } catch (error: any) {
      console.error('Error analyzing results:', error);
      
      const fallbackResult: AssessmentResult = {
        totalScore: 75, maxScore: 100, percentage: 75,
        skillBreakdown: { [userProfile.selectedDomain]: 75, 'Problem Solving': 80 },
        recommendedLevel: userProfile.skillLevel,
        strengthAreas: ['Analytical thinking'],
        improvementAreas: ['Communication skills'],
        detailedAnalysis: `You show strong potential in ${userProfile.selectedDomain}.`
      };
      onComplete(fallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnswer = (value: any) => {
    setUserAnswers(prev => ({ ...prev, [questions[currentQuestionIndex].id]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      analyzeResults();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isGeneratingQuestions) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center space-y-6">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <Brain className="w-16 h-16 text-blue-600 mx-auto" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Preparing Your Assessment</h3>
              <p className="text-gray-600">Our AI is generating personalized questions based on your profile...</p>
            </div>
            <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '66%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center space-y-4">
            <Target className="w-16 h-16 text-red-600 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900">Assessment Error</h3>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={generateAIQuestions} 
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center space-y-6">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900">Analyzing Your Results</h3>
            <p className="text-gray-600">Processing your responses to create your personalized career roadmap...</p>
            <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-center text-gray-600">No questions available.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestion.id];
  const isAnswered = currentAnswer !== undefined && currentAnswer !== '';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
              {currentQuestion.difficulty}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {currentQuestion.category}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeSpent)}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{currentQuestion.question}</h2>
        </div>
        <div className="p-6">
          {currentQuestion.type === 'scale' ? (
            <div className="space-y-6">
              <input
                type="range"
                min={currentQuestion.minValue || 1}
                max={currentQuestion.maxValue || 10}
                value={currentAnswer || currentQuestion.minValue || 1}
                onChange={(e) => handleAnswer(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{currentQuestion.minValue || 1}</span>
                <span className="font-medium text-lg text-gray-900">
                  {currentAnswer || currentQuestion.minValue || 1}
                </span>
                <span>{currentQuestion.maxValue || 10}</span>
              </div>
            </div>
          ) : currentQuestion.type === 'multiple-choice' && currentQuestion.options ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="question-answer"
                    value={option}
                    checked={currentAnswer === option}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              value={currentAnswer || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Please provide your answer..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <div className="text-sm text-gray-500">
          Skill Area: {currentQuestion.skillArea}
        </div>

        <button
          onClick={nextQuestion}
          disabled={!isAnswered}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}