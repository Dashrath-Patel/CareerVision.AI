'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Target,
  Award,
  Brain,
  BarChart3,
  Lightbulb,
  Download,
  RefreshCw
} from 'lucide-react';

interface ResumeAnalysis {
  overallScore: number;
  skillsDetected: string[];
  experienceLevel: string;
  strengthAreas: string[];
  improvementAreas: string[];
  missingKeywords: string[];
  recommendations: string[];
  skillGaps: SkillGap[];
  careerSuggestions: string[];
  atsScore: number;
}

interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: 'high' | 'medium' | 'low';
  learningPath: string[];
}

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please enter your resume content');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole }),
      });

      const data = await response.json();

      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        throw new Error(data.error || 'Failed to analyze resume');
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setResumeText(content);
      };
      reader.readAsText(file);
    } else {
      setError('Please upload a text (.txt) file');
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setResumeText(content);
      };
      reader.readAsText(file);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-500 bg-red-100',
      medium: 'text-yellow-500 bg-yellow-100',
      low: 'text-green-500 bg-green-100'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-500 bg-gray-100';
  };

  const exportAnalysis = () => {
    if (!analysis) return;

    const exportData = {
      resumeAnalysis: analysis,
      analyzedAt: new Date().toISOString(),
      targetRole: targetRole || 'General Analysis'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-analysis.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            📄 AI Resume Analyzer
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get comprehensive feedback on your resume with AI-powered analysis, 
            skill gap identification, and personalized improvement recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Role (Optional)
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Senior Software Engineer, Data Scientist"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume Content
              </label>
              
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Drop a text file here or</p>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
                >
                  Choose File
                </label>
              </div>

              <div className="mt-4">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Or paste your resume content here..."
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>{resumeText.length} characters</span>
                  <span>Minimum 100 characters required</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={analyzeResume}
              disabled={loading || resumeText.length < 100}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Analyze Resume</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Stats */}
          {analysis && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Overview</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                    {analysis.atsScore}%
                  </div>
                  <div className="text-sm text-gray-600">ATS Score</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-blue-500">
                    {analysis.skillsDetected.length}
                  </div>
                  <div className="text-sm text-gray-600">Skills Found</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-purple-500 capitalize">
                    {analysis.experienceLevel}
                  </div>
                  <div className="text-sm text-gray-600">Experience Level</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Header with Export */}
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Detailed Analysis</h3>
                <button
                  onClick={exportAnalysis}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Analysis</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Strengths & Improvements */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Strength Areas
                    </h4>
                    <ul className="space-y-2">
                      {analysis.strengthAreas.map((strength, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-yellow-600 mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {analysis.improvementAreas.map((area, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Skills & Keywords */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Skills Detected
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skillsDetected.slice(0, 15).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                      {analysis.skillsDetected.length > 15 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                          +{analysis.skillsDetected.length - 15} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                      <XCircle className="w-5 h-5 mr-2" />
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skill Gaps */}
              {analysis.skillGaps.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Skill Gap Analysis
                  </h4>
                  <div className="space-y-4">
                    {analysis.skillGaps.map((gap, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-gray-800">{gap.skill}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(gap.priority)}`}>
                            {gap.priority} priority
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex-1">
                            <div className="text-sm text-gray-600 mb-1">Current: {gap.currentLevel}/10</div>
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-400 h-2 rounded-full" 
                                style={{ width: `${gap.currentLevel * 10}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-600 mb-1">Required: {gap.requiredLevel}/10</div>
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-400 h-2 rounded-full" 
                                style={{ width: `${gap.requiredLevel * 10}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Learning Path:</strong> {gap.learningPath.join(' → ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-indigo-600 mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-emerald-600 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Career Suggestions
                  </h4>
                  <ul className="space-y-3">
                    {analysis.careerSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}