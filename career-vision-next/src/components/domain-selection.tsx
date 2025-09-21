"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Code, Database, Palette, TrendingUp, Users, Heart, 
  Calculator, Briefcase, ChevronRight, Star, Trophy,
  Brain, Target, Zap, CheckCircle
} from "lucide-react";
import { CometCard } from "./ui/comet-card";

interface Domain {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  category: 'technical' | 'business' | 'creative' | 'healthcare' | 'education';
  skills: string[];
  careerPaths: string[];
}

interface UserProfile {
  selectedDomain: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  educationLevel: string;
  experience: string;
  interests: string[];
  goals: string[];
}

const domains: Domain[] = [
  {
    id: 'software-development',
    name: 'Software Development',
    description: 'Build applications, websites, and software systems',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    category: 'technical',
    skills: ['Programming', 'Problem Solving', 'Algorithms', 'System Design'],
    careerPaths: ['Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'Mobile Developer']
  },
  {
    id: 'data-science',
    name: 'Data Science & Analytics',
    description: 'Extract insights from data to drive business decisions',
    icon: Database,
    color: 'from-purple-500 to-pink-500',
    category: 'technical',
    skills: ['Statistics', 'Machine Learning', 'Data Visualization', 'Python/R'],
    careerPaths: ['Data Scientist', 'Data Analyst', 'ML Engineer', 'Business Intelligence Analyst']
  },
  {
    id: 'design',
    name: 'Design & UX',
    description: 'Create beautiful and functional user experiences',
    icon: Palette,
    color: 'from-orange-500 to-red-500',
    category: 'creative',
    skills: ['Design Thinking', 'User Research', 'Prototyping', 'Visual Design'],
    careerPaths: ['UX Designer', 'UI Designer', 'Product Designer', 'Design Researcher']
  },
  {
    id: 'business',
    name: 'Business & Management',
    description: 'Lead teams and drive business growth strategies',
    icon: TrendingUp,
    color: 'from-green-500 to-teal-500',
    category: 'business',
    skills: ['Leadership', 'Strategic Planning', 'Communication', 'Analysis'],
    careerPaths: ['Product Manager', 'Business Analyst', 'Consultant', 'Project Manager']
  },
  {
    id: 'marketing',
    name: 'Marketing & Sales',
    description: 'Connect products with customers and drive growth',
    icon: Users,
    color: 'from-indigo-500 to-purple-500',
    category: 'business',
    skills: ['Communication', 'Analytics', 'Strategy', 'Creativity'],
    careerPaths: ['Digital Marketer', 'Sales Manager', 'Brand Manager', 'Growth Hacker']
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medicine',
    description: 'Improve health outcomes and save lives',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    category: 'healthcare',
    skills: ['Medical Knowledge', 'Empathy', 'Problem Solving', 'Attention to Detail'],
    careerPaths: ['Doctor', 'Nurse', 'Healthcare Administrator', 'Medical Researcher']
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    description: 'Manage financial resources and investment strategies',
    icon: Calculator,
    color: 'from-yellow-500 to-orange-500',
    category: 'business',
    skills: ['Financial Analysis', 'Risk Management', 'Mathematics', 'Regulations'],
    careerPaths: ['Financial Analyst', 'Investment Banker', 'Accountant', 'Financial Advisor']
  },
  {
    id: 'consulting',
    name: 'Consulting & Strategy',
    description: 'Solve complex business problems for organizations',
    icon: Briefcase,
    color: 'from-gray-500 to-slate-600',
    category: 'business',
    skills: ['Problem Solving', 'Communication', 'Analysis', 'Strategy'],
    careerPaths: ['Management Consultant', 'Strategy Consultant', 'Business Advisor', 'Operations Consultant']
  }
];

interface DomainSelectionProps {
  onDomainSelected: (profile: UserProfile) => void;
}

export default function DomainSelection({ onDomainSelected }: DomainSelectionProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'domain' | 'profile' | 'confirmation'>('domain');
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});

  const selectedDomainData = domains.find(d => d.id === selectedDomain);

  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId);
    setUserProfile(prev => ({ ...prev, selectedDomain: domainId }));
    setCurrentStep('profile');
  };

  const handleProfileComplete = (profileData: Partial<UserProfile>) => {
    const completeProfile: UserProfile = {
      selectedDomain,
      skillLevel: profileData.skillLevel || 'beginner',
      educationLevel: profileData.educationLevel || '',
      experience: profileData.experience || '',
      interests: profileData.interests || [],
      goals: profileData.goals || []
    };
    setUserProfile(completeProfile);
    setCurrentStep('confirmation');
  };

  const handleStartAssessment = () => {
    onDomainSelected(userProfile as UserProfile);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {currentStep === 'domain' && (
            <motion.div
              key="domain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="mb-12">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-white" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Choose Your Career Domain
                </h1>
                
                <p className="text-xl text-neutral-400 max-w-3xl mx-auto mb-8">
                  Select the field that interests you most. Our AI will generate personalized assessments 
                  and career guidance tailored to your chosen domain.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {domains.map((domain) => {
                  const IconComponent = domain.icon;
                  return (
                    <CometCard key={domain.id} className="h-full">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDomainSelect(domain.id)}
                        className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 h-full cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                      >
                        <div className="text-center">
                          <div className={`w-16 h-16 bg-gradient-to-br ${domain.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          
                          <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-2">
                            {domain.name}
                          </h3>
                          
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                            {domain.description}
                          </p>
                          
                          <div className="space-y-1 mb-4">
                            {domain.skills.slice(0, 2).map((skill) => (
                              <div key={skill} className="text-xs text-neutral-500 dark:text-neutral-500">
                                • {skill}
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-center text-blue-500 hover:text-blue-600 transition-colors">
                            <span className="text-sm font-medium">Select Domain</span>
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </motion.div>
                    </CometCard>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentStep === 'profile' && selectedDomainData && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${selectedDomainData.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <selectedDomainData.icon className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedDomainData.name}
                </h2>
                
                <p className="text-neutral-400">
                  Let's personalize your assessment experience
                </p>
              </div>

              <ProfileForm 
                domain={selectedDomainData}
                onComplete={handleProfileComplete}
                onBack={() => setCurrentStep('domain')}
              />
            </motion.div>
          )}

          {currentStep === 'confirmation' && selectedDomainData && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">
                  Profile Complete!
                </h2>
                
                <p className="text-xl text-neutral-400 mb-8">
                  Your personalized AI assessment is ready to begin
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800 mb-8">
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">Selected Domain</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">{selectedDomainData.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">Skill Level</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 capitalize">{userProfile.skillLevel}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">Education</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">{userProfile.educationLevel}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">Experience</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">{userProfile.experience}</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartAssessment}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 mx-auto"
              >
                <Zap className="w-5 h-5" />
                Start AI Assessment
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ProfileFormProps {
  domain: Domain;
  onComplete: (profile: Partial<UserProfile>) => void;
  onBack: () => void;
}

function ProfileForm({ domain, onComplete, onBack }: ProfileFormProps) {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    skillLevel: 'beginner',
    educationLevel: '',
    experience: '',
    interests: [],
    goals: []
  });

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to this field' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced professional' }
  ];

  const educationLevels = [
    'High School',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Professional Certification',
    'Self-taught',
    'Bootcamp/Course'
  ];

  const experienceLevels = [
    '0-1 years',
    '1-3 years',
    '3-5 years',
    '5-10 years',
    '10+ years'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-6">Skill Level</h3>
        
        <div className="grid gap-4">
          {skillLevels.map((level) => (
            <motion.label
              key={level.value}
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                formData.skillLevel === level.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
            >
              <input
                type="radio"
                name="skillLevel"
                value={level.value}
                checked={formData.skillLevel === level.value}
                onChange={(e) => setFormData(prev => ({ ...prev, skillLevel: e.target.value as any }))}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  formData.skillLevel === level.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-neutral-300 dark:border-neutral-600'
                }`}>
                  {formData.skillLevel === level.value && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-neutral-800 dark:text-white">{level.label}</div>
                  <div className="text-sm text-neutral-500">{level.description}</div>
                </div>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
          <label className="block text-sm font-medium text-neutral-800 dark:text-white mb-3">
            Education Level
          </label>
          <select
            value={formData.educationLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, educationLevel: e.target.value }))}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white"
            required
          >
            <option value="">Select education level</option>
            {educationLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
          <label className="block text-sm font-medium text-neutral-800 dark:text-white mb-3">
            Experience
          </label>
          <select
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white"
            required
          >
            <option value="">Select experience level</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          Back
        </motion.button>
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          Continue to Assessment
        </motion.button>
      </div>
    </form>
  );
}