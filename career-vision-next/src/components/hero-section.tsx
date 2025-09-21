"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { LoaderTwo } from "./ui/loader";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/components/navigation-context";

export default function HeroSection() {
  const router = useRouter();
  const { setIsNavigating, setNavigationText } = useNavigation();
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [isRoadmapsLoading, setIsRoadmapsLoading] = useState(false);

  // Array of different career-related phrases
  const phrases = [
    "Unlock Your Future Career Path",
    "Discover Your Dream Job", 
    "AI-Powered Career Guidance",
    "Transform Your Potential",
    "Find Your Perfect Career Match",
    "Build Your Success Story",
    "Navigate Your Career Journey",
    "Achieve Professional Excellence"
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    const timeout = setTimeout(() => {
      if (isDeleting) {
        // Backspacing
        setDisplayText(prev => prev.slice(0, -1));
        
        if (displayText === "") {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      } else {
        // Typing
        if (displayText === currentPhrase) {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 3000); // Wait 3 seconds
        } else {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }
      }
    }, isDeleting ? 50 : 100); // Faster when deleting

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhraseIndex, phrases]);

  const handlePredictionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPredictionLoading(true);
    setIsNavigating(true);
    setNavigationText("Launching AI Career Platform...");
    
    // Add a small delay to ensure the loader is visible
    setTimeout(() => {
      router.push('/predict');
    }, 800);
  };

  const handleRoadmapsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRoadmapsLoading(true);
    setIsNavigating(true);
    setNavigationText("Loading career roadmaps...");
    
    // Add a small delay to ensure the loader is visible
    setTimeout(() => {
      router.push('/roadmaps');
    }, 800);
  };

  return (
    <div className="relative">
      {/* Project Name Section */}
      <div className="text-center py-8 px-4 relative overflow-visible w-full">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full flex flex-col items-center justify-center"
        >
          <h1 className="text-[5rem] md:text-[8rem] lg:text-[13rem] font-black text-gray-800/10 dark:text-gray-200/10 leading-none tracking-normal select-none text-center">
            CAREERVISION.AI
          </h1>
          
          {/* Overlay gradient text */}
          <div className="absolute inset-0 flex items-center justify-center w-full">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="text-2xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent tracking-normal text-center"
            >
              CAREERVISION.AI
            </motion.h1>
          </div>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 text-lg md:text-xl text-neutral-400 font-medium tracking-wider"
          >
            AI-POWERED CAREER PLATFORM
          </motion.p>
        </motion.div>
      </div>

      {/* Main Hero Content */}
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center min-h-[60vh]">
        <div className="px-4 py-8 md:py-12 text-center">
        {/* Main Heading with Custom Rotating Typewriter Effect */}
        <div className="mb-8">
          <div className="text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center">
            <span className="dark:text-white text-black">
              {displayText.split(" ").map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block">
                  {word.split("").map((char, charIndex) => (
                    <span
                      key={charIndex}
                      className={
                        (word === "Career" || word === "Path" || word === "Dream" || word === "Job" || word === "AI-Powered" || word === "Guidance" || word === "Potential" || word === "Perfect" || word === "Match" || word === "Success" || word === "Story" || word === "Journey" || word === "Excellence") 
                          ? "text-blue-500 dark:text-blue-400" 
                          : "dark:text-white text-black"
                      }
                    >
                      {char}
                    </span>
                  ))}
                  {wordIndex < displayText.split(" ").length - 1 && (
                    <span className="dark:text-white text-black">&nbsp;</span>
                  )}
                </span>
              ))}
            </span>
            <span className="inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500 ml-1 animate-pulse"></span>
          </div>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.5,
          }}
          className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8"
        >
          AI-powered career prediction, skill gap analysis, and personalized roadmaps to transform your potential into success.
        </motion.p>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">10k+</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Career Predictions</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400">50+</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Career Paths</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">95%</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Accuracy Rate</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <div className={`${isPredictionLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <HoverBorderGradient
              containerClassName="rounded-full cursor-pointer"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 cursor-pointer"
              onClick={handlePredictionClick}
            >
              {isPredictionLoading ? (
                <div className="flex items-center space-x-2">
                  <LoaderTwo />
                  <span>Starting...</span>
                </div>
              ) : (
                <span>Start Career Prediction</span>
              )}
            </HoverBorderGradient>
          </div>
          
          <button 
            className="px-8 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRoadmapsClick}
            disabled={isRoadmapsLoading}
          >
            {isRoadmapsLoading ? (
              <div className="flex items-center space-x-2">
                <LoaderTwo />
                <span>Loading...</span>
              </div>
            ) : (
              "Explore Roadmaps"
            )}
          </button>
        </motion.div>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="text-sm text-neutral-500 dark:text-neutral-500 mt-8"
        >
          Join thousands of professionals who discovered their ideal career path
        </motion.p>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-20 w-3 h-3 bg-blue-500 rounded-full opacity-30"
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 left-10 w-2 h-2 bg-purple-500 rounded-full opacity-40"
        animate={{
          y: [0, 15, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-32 left-20 w-2 h-2 bg-green-500 rounded-full opacity-25"
        animate={{
          y: [0, -10, 0],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      </div>
    </div>
  );
}