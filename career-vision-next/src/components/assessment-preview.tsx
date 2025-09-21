"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { CardSpotlight } from "./ui/card-spotlight";
import { 
  Brain, 
  Code, 
  Palette, 
  Users, 
  TrendingUp, 
  Play,
  ChevronRight,
  Star,
  Trophy,
  Target
} from "lucide-react";

export default function AssessmentPreview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const gameQuestions = [
    {
      id: 1,
      question: "What energizes you the most?",
      icon: Brain,
      options: [
        { id: 1, text: "Solving complex problems", icon: Code, color: "blue" },
        { id: 2, text: "Creating beautiful designs", icon: Palette, color: "purple" },
        { id: 3, text: "Leading and inspiring teams", icon: Users, color: "green" },
        { id: 4, text: "Analyzing data and trends", icon: TrendingUp, color: "orange" }
      ]
    },
    {
      id: 2,
      question: "Your ideal work environment?",
      icon: Target,
      options: [
        { id: 1, text: "Fast-paced startup", icon: TrendingUp, color: "red" },
        { id: 2, text: "Creative studio", icon: Palette, color: "purple" },
        { id: 3, text: "Tech company", icon: Code, color: "blue" },
        { id: 4, text: "Corporate office", icon: Users, color: "green" }
      ]
    }
  ];

  const handleAnswerSelect = (answerId: number) => {
    setSelectedAnswer(answerId);
    setTimeout(() => {
      if (currentQuestion < gameQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-neutral-900 via-black to-neutral-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full mb-6">
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">Interactive Assessment</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Discover Your Perfect
            <span className="text-blue-500"> Career Path</span>
          </h2>
          
          <p className="text-lg text-neutral-400 max-w-3xl mx-auto mb-8">
            Take our fun, game-like assessment to unlock personalized career recommendations 
            and roadmaps tailored just for you. No boring forms - just engaging questions!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Assessment Game Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <CardSpotlight className="p-8">
              <div className="relative">
                {!showResult ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-neutral-400 mb-2">
                          <span>Question {currentQuestion + 1} of {gameQuestions.length}</span>
                          <span>{Math.round(((currentQuestion + 1) / gameQuestions.length) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${((currentQuestion + 1) / gameQuestions.length) * 100}%` 
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* Question */}
                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                          {(() => {
                            const IconComponent = gameQuestions[currentQuestion].icon;
                            return <IconComponent className="w-6 h-6 text-blue-400" />;
                          })()}
                          <h3 className="text-xl font-semibold text-white">
                            {gameQuestions[currentQuestion].question}
                          </h3>
                        </div>
                      </div>

                      {/* Answer Options */}
                      <div className="grid grid-cols-2 gap-4">
                        {gameQuestions[currentQuestion].options.map((option) => (
                          <motion.button
                            key={option.id}
                            onClick={() => handleAnswerSelect(option.id)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              selectedAnswer === option.id
                                ? `border-${option.color}-500 bg-${option.color}-500/20`
                                : 'border-neutral-700 hover:border-neutral-600'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex flex-col items-center gap-3">
                              {(() => {
                                const OptionIconComponent = option.icon;
                                return (
                                  <OptionIconComponent className={`w-8 h-8 ${
                                    selectedAnswer === option.id 
                                      ? `text-${option.color}-400` 
                                      : 'text-neutral-400'
                                  }`} />
                                );
                              })()}
                              <span className={`text-sm font-medium ${
                                selectedAnswer === option.id 
                                  ? 'text-white' 
                                  : 'text-neutral-300'
                              }`}>
                                {option.text}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="mb-6">
                      <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">Assessment Complete!</h3>
                      <p className="text-neutral-400">
                        Great job! Your personalized career roadmap is ready.
                      </p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                        <span className="text-neutral-300">Career Match</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                            ))}
                          </div>
                          <span className="text-white font-semibold">95%</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <span className="text-green-400 font-medium">Top Recommendation: Software Developer</span>
                      </div>
                    </div>

                    <button
                      onClick={resetGame}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}
              </div>
            </CardSpotlight>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-8">
              What Makes Our Assessment Special?
            </h3>

            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Advanced algorithms analyze your responses to predict the best career matches with 95% accuracy."
              },
              {
                icon: Play,
                title: "Gamified Experience",
                description: "Engaging, interactive questions that feel more like a game than a boring survey."
              },
              {
                icon: Target,
                title: "Personalized Roadmaps",
                description: "Get custom learning paths, skill requirements, and timeline estimates for your dream career."
              },
              {
                icon: TrendingUp,
                title: "Market Insights",
                description: "Real-time salary data, job growth trends, and industry demands for informed decisions."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  {(() => {
                    const FeatureIconComponent = feature.icon;
                    return <FeatureIconComponent className="w-6 h-6 text-blue-400" />;
                  })()}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="pt-6"
            >
              <a
                href="/predict"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 group"
              >
                Start Your Assessment
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}