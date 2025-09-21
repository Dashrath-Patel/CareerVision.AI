"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, Plus, X, Search, BookOpen, ExternalLink, CheckCircle, AlertCircle, Brain, Zap } from "lucide-react";
import { CAREER_AREAS } from "@/lib/constants";
import SkillQuiz from "./skill-quiz";

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface SkillGap {
  skill: string;
  importance: number;
  currentLevel: string;
  requiredLevel: string;
}

interface LearningResource {
  title: string;
  provider: string;
  type: string;
  url: string;
  is_free: boolean;
  rating: number;
}

const mockSkillAnalysis = {
  match_percentage: 75,
  skill_gaps: [
    { skill: "React/Next.js", importance: 9, currentLevel: "Beginner", requiredLevel: "Advanced" },
    { skill: "System Design", importance: 8, currentLevel: "None", requiredLevel: "Intermediate" },
    { skill: "AWS/Cloud", importance: 7, currentLevel: "Beginner", requiredLevel: "Intermediate" },
    { skill: "Docker", importance: 6, currentLevel: "None", requiredLevel: "Beginner" },
  ],
  recommended_resources: [
    {
      title: "Complete React Developer Course",
      provider: "Udemy",
      type: "Course",
      url: "#",
      is_free: false,
      rating: 4.8,
    },
    {
      title: "System Design Interview Prep",
      provider: "YouTube",
      type: "Video Series",
      url: "#",
      is_free: true,
      rating: 4.9,
    },
    {
      title: "AWS Certified Solutions Architect",
      provider: "AWS",
      type: "Certification",
      url: "#",
      is_free: false,
      rating: 4.7,
    },
  ],
};

export default function SkillAnalyzer() {
  const [currentSkills, setCurrentSkills] = useState<Skill[]>([]);
  const [targetRole, setTargetRole] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<Skill['level']>('beginner');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSkill, setQuizSkill] = useState("");

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-red-500' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
    { value: 'advanced', label: 'Advanced', color: 'bg-blue-500' },
    { value: 'expert', label: 'Expert', color: 'bg-green-500' },
  ];

  const addSkill = () => {
    if (newSkillName.trim()) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: newSkillName.trim(),
        level: newSkillLevel,
      };
      setCurrentSkills([...currentSkills, newSkill]);
      setNewSkillName("");
      setNewSkillLevel('beginner');
    }
  };

  const removeSkill = (id: string) => {
    setCurrentSkills(currentSkills.filter(skill => skill.id !== id));
  };

  const analyzeSkills = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalysisResults(mockSkillAnalysis);
    setShowResults(true);
    setIsAnalyzing(false);
  };

  const startQuiz = (skillName: string) => {
    setQuizSkill(skillName);
    setShowQuiz(true);
  };

  const handleQuizComplete = (score: number, level: string) => {
    // Add skill with assessed level
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: quizSkill,
      level: level as Skill['level'],
    };
    
    // Remove existing skill if it exists
    const updatedSkills = currentSkills.filter(skill => skill.name.toLowerCase() !== quizSkill.toLowerCase());
    setCurrentSkills([...updatedSkills, newSkill]);
    
    setShowQuiz(false);
    setQuizSkill("");
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    setQuizSkill("");
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Skill Gap Analysis
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Identify your skill gaps and get personalized learning recommendations to reach your target role.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Target Role Selection */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-lg">
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                Target Role
              </h3>
              <select
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              >
                <option value="">Select your target role</option>
                {CAREER_AREAS.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Skills */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-lg">
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                Current Skills
              </h3>
              
              {/* Add Skill Form */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter skill name"
                  className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <select
                  className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as Skill['level'])}
                >
                  {skillLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quiz Section */}
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                      Skill Assessment Quiz
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      Take a quiz to accurately assess your skill level
                    </p>
                  </div>
                  <button
                    onClick={() => newSkillName.trim() && startQuiz(newSkillName.trim())}
                    disabled={!newSkillName.trim()}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Brain className="w-4 h-4" />
                    <span>Take Quiz</span>
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {currentSkills.map((skill) => {
                    const levelInfo = skillLevels.find(l => l.value === skill.level)!;
                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${levelInfo.color}`} />
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">
                            {skill.name}
                          </span>
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {levelInfo.label}
                          </span>
                        </div>
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="text-neutral-500 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {currentSkills.length === 0 && (
                <p className="text-center text-neutral-500 py-8">
                  Add your current skills to get started
                </p>
              )}
            </div>

            {/* Quick Assessment */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-lg">
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Quick Assessment</span>
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Take quick quizzes for popular skills to get accurate assessments
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["JavaScript", "React", "Python", "Node.js", "SQL", "Git"].map((skill) => (
                  <button
                    key={skill}
                    onClick={() => startQuiz(skill)}
                    className="flex items-center justify-center space-x-2 p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 group"
                  >
                    <Brain className="w-4 h-4 text-neutral-500 group-hover:text-orange-500" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-orange-500">
                      {skill}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeSkills}
              disabled={!targetRole || currentSkills.length === 0 || isAnalyzing}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Skills...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze Skill Gaps</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {showResults && analysisResults && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Match Score */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-lg">
                  <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                    Skill Match Score
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-500 mb-2">
                      {analysisResults.match_percentage}%
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisResults.match_percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                      Based on your current skills vs. target role requirements
                    </p>
                  </div>
                </div>

                {/* Skill Gaps */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-lg">
                  <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <span>Skills to Develop</span>
                  </h3>
                  <div className="space-y-3">
                    {analysisResults.skill_gaps.map((gap: SkillGap, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                            {gap.skill}
                          </h4>
                          <span className="text-sm font-medium text-orange-500">
                            Priority: {gap.importance}/10
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Current: <span className="font-medium">{gap.currentLevel}</span>
                          </span>
                          <span className="text-neutral-400">→</span>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            Required: <span className="font-medium text-green-500">{gap.requiredLevel}</span>
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Learning Resources */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-lg">
                  <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span>Recommended Resources</span>
                  </h3>
                  <div className="space-y-3">
                    {analysisResults.recommended_resources.map((resource: LearningResource, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-blue-500 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-500 transition-colors">
                              {resource.title}
                            </h4>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                {resource.provider}
                              </span>
                              <span className="text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                                {resource.type}
                              </span>
                              <span className={`text-sm px-2 py-1 rounded-full ${
                                resource.is_free 
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                              }`}>
                                {resource.is_free ? "Free" : "Paid"}
                              </span>
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {resource.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="ml-4 p-2 text-neutral-500 hover:text-blue-500 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Skill Quiz Modal */}
      {showQuiz && (
        <SkillQuiz
          skill={quizSkill}
          onComplete={handleQuizComplete}
          onClose={closeQuiz}
        />
      )}
    </div>
  );
}