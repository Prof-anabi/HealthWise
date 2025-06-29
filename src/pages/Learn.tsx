import React from 'react';
import {
  BookOpen,
  Play,
  Clock,
  Star,
  Users,
  Award,
  Search,
  Filter,
  ChevronRight,
  Heart,
  Brain,
  Activity,
  Shield,
  Pill,
  Stethoscope,
  Eye,
  Zap,
  Target,
  TrendingUp,
  Download,
  Share2,
  Bookmark,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

// Mock data for educational content
const featuredCourses = [
  {
    id: '1',
    title: 'Understanding Your Blood Pressure',
    description: 'Learn what blood pressure numbers mean and how to maintain healthy levels',
    duration: '15 min',
    difficulty: 'Beginner',
    rating: 4.8,
    enrollments: 1250,
    category: 'Heart Health',
    thumbnail: '❤️',
    instructor: 'Dr. Sarah Johnson',
    lessons: 5,
    completed: false,
  },
  {
    id: '2',
    title: 'Diabetes Management Essentials',
    description: 'Comprehensive guide to managing diabetes through diet, exercise, and medication',
    duration: '45 min',
    difficulty: 'Intermediate',
    rating: 4.9,
    enrollments: 890,
    category: 'Chronic Conditions',
    thumbnail: '🩺',
    instructor: 'Dr. Michael Chen',
    lessons: 8,
    completed: false,
  },
  {
    id: '3',
    title: 'Mental Health & Wellness',
    description: 'Strategies for maintaining good mental health and managing stress',
    duration: '30 min',
    difficulty: 'Beginner',
    rating: 4.7,
    enrollments: 2100,
    category: 'Mental Health',
    thumbnail: '🧠',
    instructor: 'Dr. Emily Rodriguez',
    lessons: 6,
    completed: true,
  },
];

const categories = [
  { name: 'Heart Health', icon: Heart, count: 24, color: 'text-red-600' },
  { name: 'Mental Health', icon: Brain, count: 18, color: 'text-purple-600' },
  { name: 'Fitness & Exercise', icon: Activity, count: 32, color: 'text-green-600' },
  { name: 'Nutrition', icon: Target, count: 28, color: 'text-orange-600' },
  { name: 'Chronic Conditions', icon: Stethoscope, count: 15, color: 'text-blue-600' },
  { name: 'Preventive Care', icon: Shield, count: 21, color: 'text-teal-600' },
  { name: 'Medications', icon: Pill, count: 12, color: 'text-indigo-600' },
  { name: 'Vision & Eye Health', icon: Eye, count: 9, color: 'text-pink-600' },
];

const articles = [
  {
    id: '1',
    title: '10 Simple Ways to Lower Your Blood Pressure Naturally',
    excerpt: 'Discover evidence-based lifestyle changes that can help reduce your blood pressure without medication.',
    readTime: '5 min read',
    category: 'Heart Health',
    author: 'Dr. Sarah Johnson',
    publishedAt: '2024-01-15',
    featured: true,
  },
  {
    id: '2',
    title: 'Understanding Your Lab Results: A Patient\'s Guide',
    excerpt: 'Learn how to interpret common blood tests and what the numbers mean for your health.',
    readTime: '8 min read',
    category: 'Health Literacy',
    author: 'Dr. Michael Chen',
    publishedAt: '2024-01-12',
    featured: false,
  },
  {
    id: '3',
    title: 'The Importance of Regular Health Screenings',
    excerpt: 'Why preventive care matters and which screenings you need at different ages.',
    readTime: '6 min read',
    category: 'Preventive Care',
    author: 'Dr. Emily Rodriguez',
    publishedAt: '2024-01-10',
    featured: false,
  },
];

export const Learn: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [activeTab, setActiveTab] = React.useState<'courses' | 'articles' | 'videos'>('courses');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Learn About Your Health
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Access expert-curated educational content to better understand your health, 
          manage conditions, and make informed decisions about your care.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search courses, articles, and health topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'courses', label: 'Courses', icon: BookOpen },
          { id: 'articles', label: 'Articles', icon: FileText },
          { id: 'videos', label: 'Videos', icon: Play },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center`}>
                  <category.icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} resources</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Courses */}
      {activeTab === 'courses' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Featured Courses</h2>
            <Button variant="outline">
              View All Courses
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                      <span className="text-6xl">{course.thumbnail}</span>
                    </div>
                    {course.completed && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="default" size="sm">
                        {course.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        {course.rating}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.enrollments}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">by {course.instructor}</p>
                        <p className="text-xs text-gray-500">{course.lessons} lessons</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button size="sm">
                          {course.completed ? 'Review' : 'Start Course'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Articles */}
      {activeTab === 'articles' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Health Articles</h2>
            <Button variant="outline">
              View All Articles
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-6">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="info" size="sm">{article.category}</Badge>
                        {article.featured && (
                          <Badge variant="warning" size="sm">Featured</Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4">{article.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by {article.author}</span>
                        <span>{article.readTime}</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button size="sm">Read Article</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {activeTab === 'videos' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Educational Videos</h2>
            <Button variant="outline">
              View All Videos
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((video) => (
              <Card key={video} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      5:32
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      How to Take Your Blood Pressure at Home
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Learn the proper technique for accurate home blood pressure monitoring.
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Dr. Sarah Johnson</span>
                      <span>2.1k views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Progress Tracking */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Your Learning Progress</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="font-medium text-gray-900">Courses Completed</h4>
              <p className="text-2xl font-bold text-primary-600">3</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">Certificates Earned</h4>
              <p className="text-2xl font-bold text-green-600">2</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-medium text-gray-900">Learning Streak</h4>
              <p className="text-2xl font-bold text-orange-600">7 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};