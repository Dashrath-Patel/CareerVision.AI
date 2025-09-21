"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Map, Download, Eye, Filter, Search, DollarSign, Award, Clock } from "lucide-react";
import PdfViewerModal from "./pdf-viewer-modal";

// Updated roadmap data with actual PDF files
const mockRoadmaps = [
  {
    id: 1,
    title: "Software Engineer/SDE",
    description: "Complete roadmap to become a Software Development Engineer with focus on full-stack development, algorithms, and system design.",
    image: "/api/placeholder/400/300",
    pdf: "/media/roadmaps/SDE.pdf",
    average_salary: 85000,
    verified_by: "Tech Industry Experts",
    difficulty: "Intermediate",
    duration: "12-18 months",
    category: "Software Development",
    skills: ["JavaScript", "React", "Node.js", "Algorithms", "System Design"],
    content: "This comprehensive roadmap covers everything from programming fundamentals to advanced system design concepts. You'll learn modern web technologies, practice problem-solving, and understand scalable system architecture.",
  },
  {
    id: 2,
    title: "Data Scientist",
    description: "Master data science with Python, machine learning, statistics, and deep learning to solve real-world problems.",
    image: "/api/placeholder/400/300",
    pdf: "/media/roadmaps/data-analyst.pdf",
    average_salary: 95000,
    verified_by: "ML Professionals",
    difficulty: "Advanced",
    duration: "15-24 months",
    category: "Data Science",
    skills: ["Python", "Pandas", "Machine Learning", "Statistics", "SQL"],
    content: "Learn to extract insights from data using statistical analysis, machine learning algorithms, and data visualization. Master Python libraries and build predictive models.",
  },
  {
    id: 3,
    title: "Frontend Developer",
    description: "Become a modern frontend developer specializing in React, TypeScript, and modern web technologies.",
    image: "/api/placeholder/400/300",
    pdf: "/media/roadmaps/frontend.pdf",
    average_salary: 75000,
    verified_by: "Frontend Guild",
    difficulty: "Beginner",
    duration: "8-12 months",
    category: "Web Development",
    skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
    content: "Master modern frontend development with React, learn responsive design, state management, and build interactive user interfaces.",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    description: "Learn DevOps practices, cloud infrastructure, CI/CD pipelines, and automation tools for modern software delivery.",
    image: "/api/placeholder/400/300",
    pdf: "/media/roadmaps/devops.pdf",
    average_salary: 90000,
    verified_by: "Cloud Architects",
    difficulty: "Advanced",
    duration: "10-15 months",
    category: "DevOps",
    skills: ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform"],
    content: "Master container orchestration, cloud platforms, infrastructure as code, and continuous integration/deployment practices.",
  },
  {
    id: 5,
    title: "Product Manager",
    description: "Develop product strategy, user research, roadmap planning, and cross-functional team leadership skills.",
    image: "/api/placeholder/400/300",
    pdf: "/media/roadmaps/product-manager.pdf",
    average_salary: 110000,
    verified_by: "Product Leaders",
    difficulty: "Intermediate",
    duration: "6-12 months",
    category: "Product Management",
    skills: ["Strategy", "Analytics", "User Research", "Agile", "Leadership"],
    content: "Learn to identify market opportunities, define product vision, work with engineering teams, and drive product growth.",
  },
  {
    id: 6,
    title: "UI/UX Designer",
    description: "Master user experience design, user interface design, prototyping, and user research methodologies.",
    image: "/api/placeholder/400/300",
    pdf: "/media/roadmaps/ux-design.pdf",
    average_salary: 70000,
    verified_by: "Design Professionals",
    difficulty: "Beginner",
    duration: "6-10 months",
    category: "Design",
    skills: ["Figma", "Sketch", "Prototyping", "User Research", "Visual Design"],
    content: "Create user-centered designs, conduct usability testing, and build intuitive digital experiences that solve real user problems.",
  },
];

const categories = ["All", "Software Development", "Data Science", "Web Development", "DevOps", "Product Management", "Design"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

export default function RoadmapGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const filteredRoadmaps = mockRoadmaps.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roadmap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roadmap.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || roadmap.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || roadmap.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleDownload = (roadmap: any) => {
    // Create a link to download the PDF
    const link = document.createElement('a');
    link.href = roadmap.pdf;
    link.download = `${roadmap.title.replace(/\s+/g, '_')}_roadmap.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (roadmap: any) => {
    // Open the roadmap in the PDF viewer modal
    setSelectedRoadmap(roadmap);
    setIsPdfModalOpen(true);
  };

  const closePdfModal = () => {
    setIsPdfModalOpen(false);
    setSelectedRoadmap(null);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Career Roadmaps
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Explore comprehensive career paths with step-by-step guidance, skill requirements, and learning resources.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-lg mb-8"
        >
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search roadmaps..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center md:justify-start">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {filteredRoadmaps.length} roadmap{filteredRoadmaps.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </motion.div>

        {/* Roadmaps Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredRoadmaps.map((roadmap, index) => (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Card Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      roadmap.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      roadmap.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {roadmap.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white mb-1">{roadmap.title}</h3>
                    <p className="text-white/80 text-sm">{roadmap.category}</p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
                    {roadmap.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        ${(roadmap.average_salary / 1000).toFixed(0)}k
                      </div>
                      <div className="text-xs text-neutral-500">Avg Salary</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {roadmap.duration.split('-')[0]}+ mo
                      </div>
                      <div className="text-xs text-neutral-500">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Award className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {roadmap.skills.length}
                      </div>
                      <div className="text-xs text-neutral-500">Skills</div>
                    </div>
                  </div>

                  {/* Skills Preview */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {roadmap.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {roadmap.skills.length > 3 && (
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 rounded-full text-xs">
                          +{roadmap.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(roadmap)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDownload(roadmap)}
                      className="flex items-center justify-center space-x-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Verified Badge */}
                  <div className="mt-3 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      Verified by {roadmap.verified_by}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredRoadmaps.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              No roadmaps found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Try adjusting your search criteria or filters.
            </p>
          </motion.div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {selectedRoadmap && (
        <PdfViewerModal
          isOpen={isPdfModalOpen}
          onClose={closePdfModal}
          pdfUrl={selectedRoadmap.pdf}
          title={selectedRoadmap.title}
        />
      )}
    </div>
  );
}