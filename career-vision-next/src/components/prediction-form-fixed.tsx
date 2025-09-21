"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Brain, CheckCircle } from "lucide-react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { 
  CAREER_AREAS, 
  COMPANY_TYPES, 
  BOOK_TYPES, 
  SUBJECTS, 
  YES_NO_OPTIONS, 
  MANAGEMENT_TECHNICAL, 
  WORK_STYLE, 
  PERSONALITY_TYPE,
  LEARNING_LEVELS,
  RATING_SCALE 
} from "@/lib/constants";
import { PredictionRequest } from "@/lib/api";

interface FormData extends Partial<PredictionRequest> {}

export default function PredictionForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      title: "Skills Assessment",
      description: "Let's evaluate your technical and personal skills",
      fields: [
        {
          key: "logical_quotient_rating",
          label: "Logical Quotient Rating (1-10)",
          type: "select",
          options: RATING_SCALE,
          placeholder: "Rate your logical thinking ability",
        },
        {
          key: "coding_skills",
          label: "Coding Skills Rating (1-10)",
          type: "select",
          options: RATING_SCALE,
          placeholder: "Rate your programming skills",
        },
        {
          key: "memory_capability_score",
          label: "Memory Capability Score (1-10)",
          type: "select",
          options: RATING_SCALE,
          placeholder: "Rate your memory and retention ability",
        },
        {
          key: "public_speaking_points",
          label: "Public Speaking Points (1-10)",
          type: "select",
          options: RATING_SCALE,
          placeholder: "Rate your public speaking skills",
        },
      ],
    },
    {
      title: "Learning & Development",
      description: "Tell us about your learning journey",
      fields: [
        {
          key: "extra_courses_did",
          label: "Extra Courses Completed",
          type: "select",
          options: YES_NO_OPTIONS,
          placeholder: "Have you completed extra courses?",
        },
        {
          key: "certifications",
          label: "Professional Certifications",
          type: "select",
          options: YES_NO_OPTIONS,
          placeholder: "Do you have professional certifications?",
        },
        {
          key: "workshops",
          label: "Workshops Attended",
          type: "select",
          options: YES_NO_OPTIONS,
          placeholder: "Have you attended workshops?",
        },
        {
          key: "self_learning_capability",
          label: "Self-Learning Capability",
          type: "select",
          options: LEARNING_LEVELS,
          placeholder: "Rate your self-learning ability",
        },
      ],
    },
    {
      title: "Interests & Preferences",
      description: "Let's understand what motivates you",
      fields: [
        {
          key: "interested_career",
          label: "Interested Career Area",
          type: "select",
          options: CAREER_AREAS,
          placeholder: "Select your area of interest",
        },
        {
          key: "Type_of_company_want_to_settle_in",
          label: "Preferred Company Type",
          type: "select",
          options: COMPANY_TYPES,
          placeholder: "What type of company interests you?",
        },
        {
          key: "interested_books",
          label: "Book Preferences",
          type: "select",
          options: BOOK_TYPES,
          placeholder: "What type of books do you enjoy?",
        },
        {
          key: "interested_subjects",
          label: "Favorite Subjects",
          type: "select",
          options: SUBJECTS,
          placeholder: "Which subjects interest you most?",
        },
      ],
    },
    {
      title: "Work Style & Personality",
      description: "Help us understand your work preferences",
      fields: [
        {
          key: "Management_or_Technical",
          label: "Career Path Preference",
          type: "select",
          options: MANAGEMENT_TECHNICAL,
          placeholder: "Do you prefer management or technical roles?",
        },
        {
          key: "hard_or_smart_worker",
          label: "Work Style",
          type: "select",
          options: WORK_STYLE,
          placeholder: "How would you describe your work style?",
        },
        {
          key: "worked_in_teams",
          label: "Team Experience",
          type: "select",
          options: YES_NO_OPTIONS,
          placeholder: "Have you worked in teams before?",
        },
        {
          key: "Introvert",
          label: "Personality Type",
          type: "select",
          options: PERSONALITY_TYPE,
          placeholder: "How would you describe yourself?",
        },
      ],
    },
  ];

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // API call would go here
      console.log("Form data:", formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Assessment completed! Your career prediction is ready.");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepComplete = () => {
    const currentFields = steps[currentStep].fields;
    return currentFields.every((field) => formData[field.key as keyof FormData]);
  };

  const renderField = (field: any) => {
    const value = formData[field.key as keyof FormData] || "";

    if (field.type === "select") {
      return (
        <div key={field.key} className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {field.label}
          </label>
          <select
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">{field.placeholder}</option>
            {field.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={field.key} className="mb-6">
        <PlaceholdersAndVanishInput
          placeholders={[field.placeholder]}
          onChange={(e) => handleInputChange(field.key, e.target.value)}
          onSubmit={() => {}}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 animate-ping"></div>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 px-4 py-2 rounded-full mb-6 border border-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium">AI-Powered Assessment</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Career Prediction 
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Assessment</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            🎮 Answer a few questions about yourself, and our AI will predict the most suitable career paths for you.
            <br />
            <span className="text-blue-400 font-medium">Make it fun - each question is a step closer to your dream career!</span>
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-neutral-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-blue-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentStep + 1) / steps.length) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-800"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="space-y-6">
            {steps[currentStep].fields.map(renderField)}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep === steps.length - 1 ? (
            <HoverBorderGradient
              onClick={handleSubmit}
              disabled={!isStepComplete() || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Complete Assessment
                </>
              )}
            </HoverBorderGradient>
          ) : (
            <HoverBorderGradient
              onClick={nextStep}
              disabled={!isStepComplete()}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </HoverBorderGradient>
          )}
        </div>
      </div>
    </div>
  );
}