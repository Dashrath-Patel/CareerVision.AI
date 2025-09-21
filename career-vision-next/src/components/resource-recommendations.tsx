'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Video, 
  Award, 
  ExternalLink, 
  Clock, 
  Star, 
  DollarSign,
  Filter,
  Search,
  Bookmark,
  Play,
  FileText,
  Monitor,
  Zap
} from 'lucide-react';

interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'course' | 'tutorial' | 'book' | 'certification' | 'project' | 'practice';
  provider: string;
  url: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  rating: number;
  price: 'free' | 'paid' | 'freemium';
  relevanceScore: number;
  category: string;
}

interface ResourceRecommendationsProps {
  userProfile: any;
  assessmentResult: any;
  specificSkills?: string[];
}

export default function ResourceRecommendations({ 
  userProfile, 
  assessmentResult, 
  specificSkills 
}: ResourceRecommendationsProps) {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'difficulty'>('relevance');
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userProfile && assessmentResult) {
      fetchResources();
    }
  }, [userProfile, assessmentResult, specificSkills]);

  const fetchResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommend-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          assessmentResult,
          specificSkills
        }),
      });

      const data = await response.json();

      if (data.success && data.resources) {
        setResources(data.resources);
      } else {
        throw new Error(data.error || 'Failed to fetch resources');
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err instanceof Error ? err.message : 'Failed to load resources');
      
      // Set fallback resources
      setResources([
        {
          id: 'fallback-1',
          title: 'JavaScript Fundamentals',
          description: 'Master the basics of JavaScript programming',
          type: 'course',
          provider: 'freeCodeCamp',
          url: 'https://freecodecamp.org',
          duration: '20 hours',
          difficulty: 'beginner',
          skills: ['JavaScript', 'Programming'],
          rating: 4.8,
          price: 'free',
          relevanceScore: 95,
          category: 'Programming'
        },
        {
          id: 'fallback-2',
          title: 'React Complete Guide',
          description: 'Build modern web applications with React',
          type: 'tutorial',
          provider: 'YouTube',
          url: 'https://youtube.com',
          duration: '8 hours',
          difficulty: 'intermediate',
          skills: ['React', 'Frontend'],
          rating: 4.6,
          price: 'free',
          relevanceScore: 90,
          category: 'Frontend'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      video: <Video className="w-5 h-5" />,
      article: <FileText className="w-5 h-5" />,
      course: <Monitor className="w-5 h-5" />,
      tutorial: <Play className="w-5 h-5" />,
      book: <Book className="w-5 h-5" />,
      certification: <Award className="w-5 h-5" />,
      project: <Zap className="w-5 h-5" />,
      practice: <Zap className="w-5 h-5" />
    };
    return icons[type as keyof typeof icons] || <Book className="w-5 h-5" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'text-green-400 bg-green-100',
      intermediate: 'text-yellow-400 bg-yellow-100',
      advanced: 'text-red-400 bg-red-100'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-400 bg-gray-100';
  };

  const getPriceIcon = (price: string) => {
    if (price === 'free') return <span className="text-green-500 font-bold">FREE</span>;
    if (price === 'paid') return <DollarSign className="w-4 h-4 text-yellow-500" />;
    return <span className="text-blue-500 text-xs">FREEMIUM</span>;
  };

  const filteredAndSortedResources = resources
    .filter(resource => {
      const matchesFilter = filter === 'all' || resource.type === filter || resource.difficulty === filter;
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'relevance':
        default:
          return b.relevanceScore - a.relevanceScore;
      }
    });

  const toggleBookmark = (resourceId: string) => {
    const newBookmarks = new Set(bookmarkedResources);
    if (newBookmarks.has(resourceId)) {
      newBookmarks.delete(resourceId);
    } else {
      newBookmarks.add(resourceId);
    }
    setBookmarkedResources(newBookmarks);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🎯 Personalized Learning Resources
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            AI-curated learning resources tailored to your skill level, goals, and improvement areas
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="video">Videos</option>
            <option value="course">Courses</option>
            <option value="tutorial">Tutorials</option>
            <option value="book">Books</option>
            <option value="certification">Certifications</option>
            <option value="project">Projects</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'relevance' | 'rating' | 'difficulty')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="relevance">By Relevance</option>
            <option value="rating">By Rating</option>
            <option value="difficulty">By Difficulty</option>
          </select>

          <button
            onClick={fetchResources}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? <span>Loading...</span> : <span>Refresh</span>}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating personalized recommendations...</p>
          </div>
        )}

        {/* Resources Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-blue-500">
                      {getTypeIcon(resource.type)}
                    </div>
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {resource.type}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleBookmark(resource.id)}
                    className={`p-1 rounded ${bookmarkedResources.has(resource.id) 
                      ? 'text-yellow-500' 
                      : 'text-gray-400 hover:text-yellow-500'
                    } transition-colors`}
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {resource.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.skills.slice(0, 3).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {resource.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{resource.skills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{resource.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{resource.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                  <div className="flex items-center">
                    {getPriceIcon(resource.price)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {resource.provider}
                  </span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <span>Start</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="mt-2 bg-gray-100 rounded-full h-1">
                  <div 
                    className="bg-green-500 h-1 rounded-full" 
                    style={{ width: `${resource.relevanceScore}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {resource.relevanceScore}% relevance
                </span>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredAndSortedResources.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">No resources found matching your criteria.</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              className="mt-4 text-blue-500 hover:text-blue-600 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}