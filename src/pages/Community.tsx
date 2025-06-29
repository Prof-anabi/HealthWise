import React from 'react';
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  Calendar,
  User,
  ThumbsUp,
  MessageCircle,
  Eye,
  Award,
  Shield,
  Flag,
  MoreHorizontal,
  Send,
  Image,
  Paperclip,
  Smile,
  ChevronRight,
  Activity,
  Target,
  BookOpen,
  Coffee,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

// Mock data for community content
const supportGroups = [
  {
    id: '1',
    name: 'Diabetes Support Network',
    description: 'A supportive community for people managing diabetes and their families',
    members: 1247,
    posts: 3421,
    category: 'Chronic Conditions',
    isJoined: true,
    lastActivity: '2 hours ago',
    moderators: ['Dr. Sarah Johnson', 'Emily R.'],
    privacy: 'Public',
    image: '🩺',
  },
  {
    id: '2',
    name: 'Heart Health Warriors',
    description: 'Share experiences, tips, and encouragement for heart health management',
    members: 892,
    posts: 2156,
    category: 'Heart Health',
    isJoined: false,
    lastActivity: '1 hour ago',
    moderators: ['Dr. Michael Chen'],
    privacy: 'Public',
    image: '❤️',
  },
  {
    id: '3',
    name: 'Mental Wellness Circle',
    description: 'A safe space to discuss mental health, share coping strategies, and find support',
    members: 2103,
    posts: 5678,
    category: 'Mental Health',
    isJoined: true,
    lastActivity: '30 minutes ago',
    moderators: ['Dr. Emily Rodriguez', 'Sarah M.'],
    privacy: 'Private',
    image: '🧠',
  },
  {
    id: '4',
    name: 'New Parents Support',
    description: 'Connect with other new parents, share experiences, and get advice',
    members: 567,
    posts: 1234,
    category: 'Family Health',
    isJoined: false,
    lastActivity: '4 hours ago',
    moderators: ['Dr. Lisa Wang'],
    privacy: 'Public',
    image: '👶',
  },
];

const forumPosts = [
  {
    id: '1',
    title: 'Tips for managing blood sugar during the holidays',
    content: 'The holiday season can be challenging for diabetes management. Here are some strategies that have worked for me...',
    author: {
      name: 'Sarah M.',
      avatar: '👩',
      role: 'Community Member',
      joinDate: '2023-06-15',
      posts: 47,
    },
    group: 'Diabetes Support Network',
    timestamp: '2 hours ago',
    likes: 23,
    replies: 8,
    views: 156,
    tags: ['diabetes', 'holidays', 'tips'],
    isPinned: false,
    isHelpful: true,
  },
  {
    id: '2',
    title: 'Question about new blood pressure medication side effects',
    content: 'I recently started taking Lisinopril and have been experiencing some dizziness. Has anyone else had this experience?',
    author: {
      name: 'John D.',
      avatar: '👨',
      role: 'Community Member',
      joinDate: '2023-11-20',
      posts: 12,
    },
    group: 'Heart Health Warriors',
    timestamp: '4 hours ago',
    likes: 15,
    replies: 12,
    views: 89,
    tags: ['medication', 'side-effects', 'blood-pressure'],
    isPinned: false,
    isHelpful: false,
  },
  {
    id: '3',
    title: 'Celebrating 6 months of consistent exercise!',
    content: 'Just wanted to share that I\'ve maintained a regular exercise routine for 6 months now. It\'s made such a difference in my energy levels and mood.',
    author: {
      name: 'Maria L.',
      avatar: '👩',
      role: 'Community Champion',
      joinDate: '2023-01-10',
      posts: 134,
    },
    group: 'Mental Wellness Circle',
    timestamp: '6 hours ago',
    likes: 45,
    replies: 18,
    views: 234,
    tags: ['exercise', 'milestone', 'motivation'],
    isPinned: true,
    isHelpful: true,
  },
];

const upcomingEvents = [
  {
    id: '1',
    title: 'Virtual Diabetes Education Workshop',
    description: 'Learn about the latest in diabetes management and technology',
    date: '2024-02-15',
    time: '2:00 PM EST',
    type: 'Virtual',
    organizer: 'Dr. Sarah Johnson',
    attendees: 45,
    maxAttendees: 100,
    isRegistered: false,
  },
  {
    id: '2',
    title: 'Heart Health Support Group Meeting',
    description: 'Monthly in-person meeting for heart health support group members',
    date: '2024-02-20',
    time: '6:00 PM EST',
    type: 'In-Person',
    location: 'Community Center, Room 204',
    organizer: 'Dr. Michael Chen',
    attendees: 23,
    maxAttendees: 30,
    isRegistered: true,
  },
  {
    id: '3',
    title: 'Mindfulness and Stress Reduction Workshop',
    description: 'Learn practical mindfulness techniques for managing stress and anxiety',
    date: '2024-02-25',
    time: '10:00 AM EST',
    type: 'Virtual',
    organizer: 'Dr. Emily Rodriguez',
    attendees: 67,
    maxAttendees: 50,
    isRegistered: false,
  },
];

export const Community: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'groups' | 'forum' | 'events'>('groups');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [showNewPostModal, setShowNewPostModal] = React.useState(false);

  const NewPostModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Create New Post</h3>
            <button
              onClick={() => setShowNewPostModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post to Group
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Select a group...</option>
              {supportGroups.filter(g => g.isJoined).map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
          
          <Input label="Post Title" placeholder="What would you like to discuss?" />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Share your thoughts, questions, or experiences..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <Input placeholder="Add tags separated by commas" />
          </div>
          
          <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
            <Button variant="outline" size="sm">
              <Image className="w-4 h-4 mr-2" />
              Add Image
            </Button>
            <Button variant="outline" size="sm">
              <Paperclip className="w-4 h-4 mr-2" />
              Attach File
            </Button>
            <Button variant="outline" size="sm">
              <Smile className="w-4 h-4 mr-2" />
              Emoji
            </Button>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowNewPostModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewPostModal(false)}>
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Health Community
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Connect with others on similar health journeys, share experiences, 
          get support, and learn from a caring community of patients and healthcare professionals.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">5,247</h3>
            <p className="text-sm text-gray-600">Community Members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">12,489</h3>
            <p className="text-sm text-gray-600">Posts & Discussions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">24</h3>
            <p className="text-sm text-gray-600">Support Groups</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">8</h3>
            <p className="text-sm text-gray-600">Upcoming Events</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'groups', label: 'Support Groups', icon: Users },
          { id: 'forum', label: 'Forum', icon: MessageSquare },
          { id: 'events', label: 'Events', icon: Calendar },
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

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search groups, posts, or events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setShowNewPostModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Support Groups Tab */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {supportGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{group.image}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{group.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="info" size="sm">{group.category}</Badge>
                          <Badge variant={group.privacy === 'Private' ? 'warning' : 'default'} size="sm">
                            {group.privacy}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={group.isJoined ? 'outline' : 'primary'}
                      size="sm"
                    >
                      {group.isJoined ? 'Joined' : 'Join Group'}
                    </Button>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{group.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <p className="font-semibold text-gray-900">{group.members.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Members</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{group.posts.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Posts</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{group.lastActivity}</p>
                      <p className="text-xs text-gray-500">Last Activity</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Moderated by:</p>
                        <p className="text-sm text-gray-700">{group.moderators.join(', ')}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Group
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Forum Tab */}
      {activeTab === 'forum' && (
        <div className="space-y-6">
          <div className="space-y-4">
            {forumPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{post.author.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {post.isPinned && (
                            <Badge variant="warning" size="sm">Pinned</Badge>
                          )}
                          {post.isHelpful && (
                            <Badge variant="success" size="sm">Helpful</Badge>
                          )}
                          <Badge variant="info" size="sm">{post.group}</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-3">{post.content}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-xl">{post.author.avatar}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                          <p className="text-xs text-gray-500">{post.author.role}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{post.timestamp}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replies}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                    </div>
                    <Badge variant={event.type === 'Virtual' ? 'info' : 'success'} size="sm">
                      {event.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      Organized by {event.organizer}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {event.attendees}/{event.maxAttendees} attendees
                    </div>
                    <Button
                      variant={event.isRegistered ? 'outline' : 'primary'}
                      size="sm"
                    >
                      {event.isRegistered ? 'Registered' : 'Register'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Community Guidelines */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Community Guidelines</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Be Respectful</h4>
              <p className="text-sm text-gray-600">
                Treat all community members with kindness and respect. We're all here to support each other.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Share Safely</h4>
              <p className="text-sm text-gray-600">
                Share your experiences while protecting your privacy. Avoid sharing personal medical details.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Stay On Topic</h4>
              <p className="text-sm text-gray-600">
                Keep discussions relevant to health and wellness. Help maintain a focused, helpful environment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showNewPostModal && <NewPostModal />}
    </div>
  );
};