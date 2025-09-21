"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Download, 
  Share, 
  MapPin, 
  Calendar,
  ExternalLink,
  DollarSign,
  Award,
  CheckCircle,
  Clock,
  Star,
  BarChart3,
  PieChart,
  Briefcase,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced mock data matching Django output
const mockResults = {
  predicted_role: "Databases",
  confidence: 85,
  match_percentage: 75,
  recommended_roles: [
    "Database Developer",
    "Database Administrator", 
    "Database Manager",
    "Portal Administrator"
  ],
  average_salary: "10 LPA",
  verified_by: "None",
  current_skills: [
    "Information Security",
    "Security Fundamentals", 
    "Testing",
    "Rapid Prototyping",
    "Advanced Programming",
    "Management Skills",
    "Communication",
    "Network Security",
    "Programming",
    "Leadership",
    "Competitive Programming",
    "Team Collaboration",
    "Public Speaking"
  ],
  required_skills: [
    "SQL",
    "Database Management",
    "Data Modeling",
    "NoSQL",
    "Database Security", 
    "Query Optimization",
    "Data Architecture"
  ],
  skills_to_develop: [
    {
      name: "SQL",
      priority: 3,
      current_level: 0,
      required_level: 10,
      resources: [
        {
          title: "SQL Basics",
          type: "Tutorial",
          provider: "W3Schools", 
          is_free: true,
          url: "#"
        },
        {
          title: "Introduction to SQL",
          type: "Course",
          provider: "Codecademy",
          is_free: true,
          url: "#"
        },
        {
          title: "SQL for Data Analysis",
          type: "Course", 
          provider: "Udacity",
          is_free: true,
          url: "#"
        }
      ]
    },
    {
      name: "Database Management",
      priority: 3,
      current_level: 0,
      required_level: 10,
      resources: [
        {
          title: "Learn Database Management on Coursera",
          type: "Course Platform",
          provider: "Coursera",
          is_free: false,
          url: "#"
        },
        {
          title: "Database Management Tutorials on YouTube", 
          type: "Video Tutorials",
          provider: "YouTube",
          is_free: true,
          url: "#"
        },
        {
          title: "Database Management Documentation and Guides",
          type: "Documentation",
          provider: "Various",
          is_free: true,
          url: "#"
        }
      ]
    },
    {
      name: "Data Modeling",
      priority: 3,
      current_level: 0,
      required_level: 10,
      resources: [
        {
          title: "Data Modeling Fundamentals",
          type: "Course",
          provider: "Pluralsight",
          is_free: false,
          url: "#"
        }
      ]
    },
    {
      name: "NoSQL",
      priority: 3,
      current_level: 0, 
      required_level: 10,
      resources: [
        {
          title: "NoSQL Database Tutorial",
          type: "Tutorial",
          provider: "MongoDB University",
          is_free: true,
          url: "#"
        }
      ]
    }
  ],
  job_opportunities: [
    {
      title: "Senior Principal Consultant",
      company: "Oracle",
      location: "Bangalore, Karnataka",
      posted_date: "September 19, 2025",
      description: "We are looking for a highly capable, self-motivated and independent Database Administrators based in India. If you are passionate about Oracle database technology as well as cloud computing, this is the ideal role you've been waiting for. Our DBA team supports databases which are ava...",
      apply_url: "#"
    },
    {
      title: "Senior Principal Consultant", 
      company: "Oracle",
      location: "Chennai, Tamil Nadu",
      posted_date: "September 19, 2025",
      description: "We are looking for a highly capable, self-motivated and independent Database Administrators based in India. If you are passionate about Oracle database technology as well as cloud computing, this is the ideal role you've been waiting for. Our DBA team supports databases which are ava...",
      apply_url: "#"
    },
    {
      title: "Senior Principal Consultant",
      company: "Oracle", 
      location: "Mumbai, Maharashtra",
      posted_date: "September 19, 2025",
      description: "We are looking for a highly capable, self-motivated and independent Database Administrators based in India. If you are passionate about Oracle database technology as well as cloud computing, this is the ideal role you've been waiting for. Our DBA team supports databases which are ava...",
      apply_url: "#"
    },
    {
      title: "Senior Principal Consultant",
      company: "Oracle",
      location: "Pune, Maharashtra", 
      posted_date: "September 19, 2025",
      description: "We are looking for a highly capable, self-motivated and independent Database Administrators based in India. If you are passionate about Oracle database technology as well as cloud computing, this is the ideal role you've been waiting for. Our DBA team supports databases which are ava...",
      apply_url: "#"
    }
  ],
  roadmap_url: "/media/roadmaps/Databases-roadmap.pdf"
};

export default function ResultsDashboard() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchResults = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResults(mockResults);
      setIsLoading(false);
    };

    fetchResults();
  }, []);

  const downloadReport = () => {
    // Simulate PDF download
    console.log("Downloading report...");
  };

  const shareResults = () => {
    // Simulate sharing functionality
    console.log("Sharing results...");
  };

  const openRoadmap = () => {
    window.open(results.roadmap_url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Analyzing your career prediction...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">No results available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Your Career Prediction Results
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
            Based on your assessment, here's what our AI recommends for your career journey.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={downloadReport}
              className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Report</span>
            </button>
            <button
              onClick={shareResults}
              className="flex items-center justify-center space-x-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 px-6 py-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <Share className="w-5 h-5" />
              <span>Share Results</span>
            </button>
          </div>
        </motion.div>

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Predicted Career Path */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">
              Your Personalized Career Roadmap
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                  {results.predicted_role} Career Path
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  A comprehensive guide tailored for your journey to becoming a {results.predicted_role} professional. This roadmap includes skill development paths, recommended courses, and timeline expectations.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-blue-600">
                      Recommended Roles
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {results.recommended_roles.join(', ')}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-600">
                      Average Salary: {results.average_salary}
                    </h4>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-600">
                      Verified By: {results.verified_by}
                    </h4>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Database className="w-24 h-24 text-white" />
                  </div>
                  <button
                    onClick={openRoadmap}
                    className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Open Roadmap
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Confidence Score */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-lg">
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                Prediction Confidence
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">
                  {results.confidence}%
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${results.confidence}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Match Percentage */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-lg">
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                Skill Match
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  {results.match_percentage}%
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${results.match_percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skill Gap Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">
            Your Personalized Skill Gap Analysis
          </h2>

          {/* Current Skills */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Current Skills</h3>
            <div className="flex flex-wrap gap-2">
              {results.current_skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Required Skills for {results.predicted_role}</h3>
            <div className="flex flex-wrap gap-2">
              {results.required_skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Skills to Develop */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-6">Skills to Develop</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {results.skills_to_develop.map((skill: any, index: number) => (
                <div key={index} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                      {skill.name}
                    </h4>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {skill.priority}/10
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(skill.current_level / skill.required_level) * 100}%` }}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2">
                      Recommended Resources:
                    </h5>
                    <div className="space-y-2">
                      {skill.resources.map((resource: any, resIndex: number) => (
                        <div key={resIndex} className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-blue-600 hover:underline cursor-pointer">
                              {resource.title}
                            </span>
                            <div className="flex items-center space-x-2 text-xs text-neutral-500">
                              <span>{resource.type}</span>
                              <span className={resource.is_free ? 'text-green-600' : 'text-orange-600'}>
                                {resource.is_free ? 'Free' : 'Paid'}
                              </span>
                              <span>{resource.provider}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Job Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">
            Latest Job Opportunities
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {results.job_opportunities.map((job: any, index: number) => (
              <div key={index} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-neutral-800 dark:text-neutral-200 font-medium mb-1">
                      {job.company}
                    </p>
                    <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Posted: {job.posted_date}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-3">
                  {job.description}
                </p>
                
                <button 
                  onClick={() => window.open(job.apply_url, '_blank')}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}