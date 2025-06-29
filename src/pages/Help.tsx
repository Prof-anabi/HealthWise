import React from 'react';
import {
  HelpCircle,
  Search,
  MessageSquare,
  Phone,
  Mail,
  Book,
  Video,
  FileText,
  Users,
  Clock,
  Star,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Download,
  Send,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  Shield,
  Heart,
  Calendar,
  Pill,
  Activity,
  Settings,
  User,
  Lock,
  Globe,
  Smartphone,
  Headphones,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Plus,
  Minus,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

// Mock data for help content
const faqCategories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: Zap,
    count: 12,
    description: 'Learn the basics of using HealthWise',
  },
  {
    id: 'account-security',
    name: 'Account & Security',
    icon: Shield,
    count: 8,
    description: 'Manage your account and security settings',
  },
  {
    id: 'health-data',
    name: 'Health Data',
    icon: Heart,
    count: 15,
    description: 'Understanding and managing your health information',
  },
  {
    id: 'appointments',
    name: 'Appointments',
    icon: Calendar,
    count: 10,
    description: 'Scheduling and managing healthcare appointments',
  },
  {
    id: 'medications',
    name: 'Medications',
    icon: Pill,
    count: 7,
    description: 'Tracking medications and prescriptions',
  },
  {
    id: 'privacy',
    name: 'Privacy & Sharing',
    icon: Lock,
    count: 9,
    description: 'Control your privacy and data sharing preferences',
  },
];

const popularFaqs = [
  {
    id: '1',
    question: 'How do I schedule an appointment with my doctor?',
    answer: 'You can schedule appointments through the Appointments page. Click "Book Appointment", select your preferred doctor, choose an available time slot, and confirm your booking. You\'ll receive a confirmation email and reminder notifications.',
    category: 'appointments',
    helpful: 45,
    notHelpful: 3,
    lastUpdated: '2024-01-15',
  },
  {
    id: '2',
    question: 'How can I view my test results?',
    answer: 'Test results are available in the Test Results section. Once your healthcare provider releases results, you\'ll receive a notification. Results include both the raw data and plain-language explanations to help you understand what they mean.',
    category: 'health-data',
    helpful: 38,
    notHelpful: 2,
    lastUpdated: '2024-01-12',
  },
  {
    id: '3',
    question: 'Is my health information secure and private?',
    answer: 'Yes, HealthWise is fully HIPAA compliant. Your health information is encrypted both in transit and at rest. We never sell your personal health data, and you have complete control over who can access your information.',
    category: 'privacy',
    helpful: 52,
    notHelpful: 1,
    lastUpdated: '2024-01-10',
  },
  {
    id: '4',
    question: 'How do I add medications to my profile?',
    answer: 'Go to the Health Tracking page and select the Medications tab. Click "Add Medication" and enter the medication name, dosage, frequency, and any special instructions. You can also set up reminders to help you remember to take your medications.',
    category: 'medications',
    helpful: 29,
    notHelpful: 4,
    lastUpdated: '2024-01-08',
  },
  {
    id: '5',
    question: 'Can I share my health data with family members?',
    answer: 'Yes, you can share specific health information with designated family members or caregivers. Go to Privacy & Data Control settings to manage who has access to different types of your health data.',
    category: 'privacy',
    helpful: 33,
    notHelpful: 2,
    lastUpdated: '2024-01-05',
  },
];

const supportChannels = [
  {
    id: 'live-chat',
    name: 'Live Chat',
    description: 'Get instant help from our support team',
    availability: '24/7',
    responseTime: 'Immediate',
    icon: MessageCircle,
    status: 'online',
  },
  {
    id: 'phone',
    name: 'Phone Support',
    description: 'Speak directly with a support specialist',
    availability: 'Mon-Fri 8AM-8PM EST',
    responseTime: 'Immediate',
    icon: Phone,
    status: 'available',
    phone: '1-800-HEALTH-1',
  },
  {
    id: 'email',
    name: 'Email Support',
    description: 'Send us a detailed message about your issue',
    availability: '24/7',
    responseTime: 'Within 4 hours',
    icon: Mail,
    status: 'available',
    email: 'support@healthwise.com',
  },
  {
    id: 'video-call',
    name: 'Video Support',
    description: 'Schedule a video call for complex issues',
    availability: 'Mon-Fri 9AM-5PM EST',
    responseTime: 'Same day',
    icon: Video,
    status: 'available',
  },
];

const tutorials = [
  {
    id: '1',
    title: 'Getting Started with HealthWise',
    description: 'A comprehensive overview of all HealthWise features',
    duration: '8 min',
    type: 'video',
    difficulty: 'Beginner',
    views: 1250,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Managing Your Health Data',
    description: 'Learn how to input, track, and understand your health information',
    duration: '12 min',
    type: 'video',
    difficulty: 'Beginner',
    views: 890,
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Privacy Settings Deep Dive',
    description: 'Complete guide to controlling your privacy and data sharing',
    duration: '15 min',
    type: 'video',
    difficulty: 'Intermediate',
    views: 567,
    rating: 4.7,
  },
  {
    id: '4',
    title: 'Appointment Scheduling Guide',
    description: 'Step-by-step guide to booking and managing appointments',
    duration: '6 min',
    type: 'interactive',
    difficulty: 'Beginner',
    views: 1100,
    rating: 4.6,
  },
];

export const Help: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'faq' | 'contact' | 'tutorials' | 'status'>('faq');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [expandedFaq, setExpandedFaq] = React.useState<string | null>(null);
  const [showContactModal, setShowContactModal] = React.useState(false);

  const ContactModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Contact Support</h3>
            <button
              onClick={() => setShowContactModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How can we help you?
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Select a topic...</option>
              <option>Account Issues</option>
              <option>Technical Problems</option>
              <option>Billing Questions</option>
              <option>Privacy Concerns</option>
              <option>Feature Requests</option>
              <option>Other</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" placeholder="Your first name" />
            <Input label="Last Name" placeholder="Your last name" />
          </div>
          
          <Input label="Email" type="email" placeholder="your.email@example.com" />
          <Input label="Subject" placeholder="Brief description of your issue" />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Please describe your issue in detail..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="priority" value="low" defaultChecked className="mr-2" />
                <span className="text-sm">Low</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="priority" value="medium" className="mr-2" />
                <span className="text-sm">Medium</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="priority" value="high" className="mr-2" />
                <span className="text-sm">High</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="priority" value="urgent" className="mr-2" />
                <span className="text-sm">Urgent</span>
              </label>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium">Response Time</p>
                <p className="text-sm text-blue-800">
                  We typically respond to support requests within 4 hours during business hours. 
                  Urgent issues are prioritized and handled immediately.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowContactModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowContactModal(false)}>
              <Send className="w-4 h-4 mr-2" />
              Send Message
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
          Help & Support Center
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions, access tutorials, and get support 
          from our team to make the most of your HealthWise experience.
        </p>
      </div>

      {/* Quick Search */}
      <Card>
        <CardContent className="p-6">
          <div className="max-w-2xl mx-auto">
            <Input
              placeholder="Search for help articles, tutorials, or common questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              className="text-lg py-4"
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'faq', label: 'FAQ', icon: HelpCircle },
          { id: 'contact', label: 'Contact Support', icon: MessageSquare },
          { id: 'tutorials', label: 'Tutorials', icon: Video },
          { id: 'status', label: 'System Status', icon: Activity },
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

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* FAQ Categories */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {faqCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <category.icon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.count} articles</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular FAQs */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Questions</h2>
            <div className="space-y-4">
              {popularFaqs.map((faq) => (
                <Card key={faq.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{faq.question}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <Badge variant="info" size="sm">
                            {faqCategories.find(c => c.id === faq.category)?.name}
                          </Badge>
                          <span>Updated {new Date(faq.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {expandedFaq === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedFaq === faq.id && (
                      <div className="px-6 pb-6 border-t border-gray-200">
                        <div className="pt-4">
                          <p className="text-gray-700 mb-4">{faq.answer}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-500">Was this helpful?</span>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  {faq.helpful}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <ThumbsDown className="w-4 h-4 mr-1" />
                                  {faq.notHelpful}
                                </Button>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Flag className="w-4 h-4 mr-1" />
                              Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* Support Channels */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportChannels.map((channel) => (
                <Card key={channel.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <channel.icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                          <Badge 
                            variant={channel.status === 'online' ? 'success' : 'info'} 
                            size="sm"
                          >
                            {channel.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{channel.description}</p>
                        <div className="space-y-1 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {channel.availability}
                          </div>
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-2" />
                            Response: {channel.responseTime}
                          </div>
                          {channel.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {channel.phone}
                            </div>
                          )}
                          {channel.email && (
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              {channel.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button 
                        className="w-full" 
                        onClick={() => channel.id === 'email' && setShowContactModal(true)}
                      >
                        {channel.id === 'live-chat' && 'Start Chat'}
                        {channel.id === 'phone' && 'Call Now'}
                        {channel.id === 'email' && 'Send Email'}
                        {channel.id === 'video-call' && 'Schedule Call'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Medical Emergency</h3>
                  <p className="text-red-800 mb-4">
                    If you're experiencing a medical emergency, do not use this support system. 
                    Call 911 immediately or go to your nearest emergency room.
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                      <Phone className="w-4 h-4 mr-2" />
                      Call 911
                    </Button>
                    <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Find ER
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tutorials Tab */}
      {activeTab === 'tutorials' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Video Tutorials & Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutorials.map((tutorial) => (
                <Card key={tutorial.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                        <Video className="w-12 h-12 text-primary-600" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {tutorial.duration}
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge variant={tutorial.type === 'video' ? 'info' : 'success'} size="sm">
                          {tutorial.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                      <p className="text-gray-600 mb-4">{tutorial.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span>{tutorial.difficulty}</span>
                          <span>{tutorial.views} views</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          {tutorial.rating}
                        </div>
                      </div>
                      <Button className="w-full">
                        <Video className="w-4 h-4 mr-2" />
                        Watch Tutorial
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Start Guide */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Quick Start Guide</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Complete Your Profile</h4>
                    <p className="text-sm text-gray-600">Add your basic information, emergency contacts, and health preferences.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Connect with Healthcare Providers</h4>
                    <p className="text-sm text-gray-600">Find and connect with your doctors to enable data sharing and communication.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Start Tracking Your Health</h4>
                    <p className="text-sm text-gray-600">Begin logging vital signs, medications, and symptoms to build your health history.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Status Tab */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          {/* Overall Status */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-900">All Systems Operational</h3>
                  <p className="text-green-800">All HealthWise services are running normally</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Status */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Service Status</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Web Application', status: 'operational', uptime: '99.9%' },
                  { name: 'Mobile App', status: 'operational', uptime: '99.8%' },
                  { name: 'Appointment Booking', status: 'operational', uptime: '99.9%' },
                  { name: 'Messaging System', status: 'operational', uptime: '99.7%' },
                  { name: 'Data Sync', status: 'operational', uptime: '99.9%' },
                  { name: 'Notifications', status: 'operational', uptime: '99.8%' },
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">{service.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">Uptime: {service.uptime}</span>
                      <Badge variant="success" size="sm">Operational</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Recent Updates</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">System Maintenance Completed</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Scheduled maintenance for improved performance was completed successfully.
                    </p>
                    <p className="text-xs text-blue-700 mt-2">January 20, 2024 at 2:00 AM EST</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">New Feature: Enhanced Privacy Controls</h4>
                    <p className="text-sm text-green-800 mt-1">
                      We've added more granular privacy controls to help you manage your data sharing preferences.
                    </p>
                    <p className="text-xs text-green-700 mt-2">January 15, 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Additional Resources</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">User Guide</h4>
              <p className="text-sm text-gray-600 mb-3">
                Comprehensive documentation covering all HealthWise features
              </p>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Community Forum</h4>
              <p className="text-sm text-gray-600 mb-3">
                Connect with other users and share experiences
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Forum
              </Button>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Headphones className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Webinars</h4>
              <p className="text-sm text-gray-600 mb-3">
                Join live sessions to learn about new features and best practices
              </p>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                View Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showContactModal && <ContactModal />}
    </div>
  );
};