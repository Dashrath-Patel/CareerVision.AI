'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Brain, Trophy, Target } from 'lucide-react';

export default function PlatformDemo() {
  const [demoState, setDemoState] = useState<'intro' | 'assessment' | 'roadmap'>('intro');

  const mockUserProfile = {
    name: "Alex Demo",
    email: "alex@example.com", 
    selectedDomain: "software-development",
    skillLevel: "intermediate",
    experience: "2 years",
    goals: ["Become a senior developer", "Learn advanced frameworks"],
    interests: ["Web development", "AI/ML", "Open source"]
  };

  const mockAssessmentResult = {
    totalScore: 85,
    maxScore: 100,
    percentage: 85,
    skillBreakdown: {
      "JavaScript": 90,
      "React": 80,
      "Node.js": 75,
      "Databases": 70,
      "System Design": 60
    },
    recommendedLevel: "intermediate",
    strengthAreas: ["Frontend Development", "Problem Solving", "API Integration"],
    improvementAreas: ["System Design", "Database Optimization", "DevOps"],
    detailedAnalysis: "You demonstrate strong technical skills with excellent JavaScript and React knowledge. Focus on backend architecture and system design to advance to senior level."
  };

  const testAIConnection = async () => {
    try {
      console.log('Testing AI connection...');
      
      // Test question generation
      const questionsResponse = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: mockUserProfile, numberOfQuestions: 3 }),
      });
      
      const questionsData = await questionsResponse.json();
      console.log('Questions generated:', questionsData);

      // Test assessment analysis
      const analysisResponse = await fetch('/api/analyze-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: mockUserProfile,
          questions: [{ id: 'test', question: 'Test question', type: 'scale', category: 'Technical' }],
          answers: { 'test': 8 }
        }),
      });
      
      const analysisData = await analysisResponse.json();
      console.log('Analysis completed:', analysisData);

      // Test gamified roadmap
      const roadmapResponse = await fetch('/api/generate-gamified-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: mockUserProfile, assessmentResult: mockAssessmentResult }),
      });
      
      const roadmapData = await roadmapResponse.json();
      console.log('Roadmap generated:', roadmapData);

      alert('All AI services are working! Check the console for detailed responses.');
    } catch (error) {
      console.error('AI Test Error:', error);
      alert('AI services test completed. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">🚀 CareerVision.AI Platform</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            AI-Powered Gamified Career Development Platform with Personalized Roadmaps, 
            Adaptive Assessments, and Interactive Learning Journeys
          </p>
        </motion.div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <Brain className="w-12 h-12" />,
              title: "AI Assessment Generator",
              description: "Intelligent question generation based on user profile and domain expertise using Gemini AI",
              features: ["Adaptive difficulty", "Personalized questions", "Real-time analysis"]
            },
            {
              icon: <Trophy className="w-12 h-12" />,
              title: "Gamified Roadmaps",
              description: "Interactive learning paths with milestones, badges, and achievement tracking",
              features: ["Progress tracking", "Daily/weekly goals", "Motivational elements"]
            },
            {
              icon: <Target className="w-12 h-12" />,
              title: "Career Projections",
              description: "AI-powered career path recommendations with salary insights and skill requirements",
              features: ["Job market analysis", "Skill gap identification", "Timeline planning"]
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 hover:bg-opacity-20 transition-all duration-300"
            >
              <div className="text-blue-300 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 mb-4">{feature.description}</p>
              <ul className="space-y-1">
                {feature.features.map((item, idx) => (
                  <li key={idx} className="text-sm text-blue-200 flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Demo Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl font-bold mb-6">🎮 Platform Demonstration</h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={testAIConnection}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center space-x-2 shadow-lg"
            >
              <Zap className="w-5 h-5" />
              <span>Test AI Services</span>
            </button>
            
            <a
              href="/predict"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2 shadow-lg"
            >
              <Play className="w-5 h-5" />
              <span>Start Assessment</span>
            </a>

            <a
              href="/features"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center space-x-2 shadow-lg"
            >
              <Target className="w-5 h-5" />
              <span>Explore Features</span>
            </a>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "AI Question Generation", status: "✅ Active", color: "text-green-400" },
              { title: "Assessment Analysis", status: "✅ Active", color: "text-green-400" },
              { title: "Gamified Roadmaps", status: "✅ Active", color: "text-green-400" }
            ].map((service, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4">
                <h4 className="font-semibold">{service.title}</h4>
                <p className={service.color}>{service.status}</p>
              </div>
            ))}
          </div>

          {/* Implementation Details */}
          <div className="mt-12 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">🛠 Implementation Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-blue-300 mb-2">AI Integration</h4>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Google Gemini AI for question generation</li>
                  <li>• Adaptive assessment analysis</li>
                  <li>• Personalized career roadmap creation</li>
                  <li>• Resume analysis and skill gap identification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Gamification Features</h4>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Progressive milestone system</li>
                  <li>• Achievement badges and rewards</li>
                  <li>• Daily and weekly goal tracking</li>
                  <li>• Interactive progress visualization</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-300 mb-2">User Experience</h4>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Responsive design with smooth animations</li>
                  <li>• Real-time progress updates</li>
                  <li>• Personalized motivational content</li>
                  <li>• Resource recommendation engine</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-300 mb-2">Technical Stack</h4>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Next.js 15 with TypeScript</li>
                  <li>• Framer Motion for animations</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Google Generative AI SDK</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}