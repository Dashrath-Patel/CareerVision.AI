"use client";

import { motion } from "motion/react";
import { CometCard } from "./ui/comet-card";
import { Brain, Target, Map, BarChart3, Users, Zap } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Career Prediction",
      description: "Advanced machine learning algorithms analyze your skills, interests, and preferences to predict the most suitable career paths with 95% accuracy.",
      link: "/predict",
      icon: Brain,
    },
    {
      title: "Skill Gap Analysis",
      description: "Identify exactly what skills you need to develop for your target role with personalized learning recommendations and resource suggestions.",
      link: "/skill-analysis",
      icon: Target,
    },
    {
      title: "Interactive Career Roadmaps",
      description: "Step-by-step visual guides showing your path to success, complete with timelines, milestones, and salary expectations.",
      link: "/roadmaps",
      icon: Map,
    },
    {
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics, quiz results, and skill assessments to measure your career readiness.",
      link: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Personalized Recommendations",
      description: "Get tailored job suggestions, course recommendations, and career advice based on your unique profile and market trends.",
      link: "/recommendations",
      icon: Users,
    },
    {
      title: "Real-time Insights",
      description: "Stay updated with the latest industry trends, salary data, and job market insights to make informed career decisions.",
      link: "/insights",
      icon: Zap,
    },
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">
            Powerful Features for Your
            <span className="text-blue-500"> Career Success</span>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Discover how our cutting-edge AI technology and comprehensive career tools 
            can transform your professional journey and unlock new opportunities.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CometCard className="h-full">
                <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 h-full flex flex-col">
                  <div className="mb-4">
                    <feature.icon className="w-8 h-8 text-blue-500 mb-3" />
                    <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 flex-grow">
                    {feature.description}
                  </p>
                  <div className="mt-4">
                    <a 
                      href={feature.link}
                      className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Learn More 
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </CometCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">
              Why Choose CareerVision AI?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Data-Driven Insights</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">Our ML models are trained on thousands of career success stories and industry data.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Personalized Experience</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">Every recommendation is tailored to your unique skills, interests, and career goals.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Continuous Learning</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">Our platform evolves with industry trends to provide the most current career guidance.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">10K+</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Career Predictions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">95%</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">User Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">500+</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Learning Resources</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}