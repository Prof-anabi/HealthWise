import React from 'react';
import {
  Search,
  MapPin,
  Star,
  Filter,
  Phone,
  Calendar,
  Globe,
  Award,
  Clock,
  Heart,
  Brain,
  Eye,
  Stethoscope,
  Activity,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

// Mock doctors data
const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Primary Care',
    subSpecialties: ['Internal Medicine', 'Preventive Care'],
    rating: 4.9,
    reviewCount: 127,
    languages: ['English', 'Spanish'],
    location: {
      address: '123 Medical Center Dr, Suite 200',
      city: 'San Francisco',
      state: 'CA',
      distance: '0.8 miles',
    },
    acceptedInsurance: ['Blue Cross', 'Aetna', 'Kaiser', 'United Healthcare'],
    education: [
      { degree: 'MD', school: 'Stanford University', year: 2010 },
      { degree: 'Residency', school: 'UCSF Medical Center', year: 2013 },
    ],
    avatar: '👩‍⚕️',
    bio: 'Dr. Johnson is a board-certified internal medicine physician with over 10 years of experience in primary care. She specializes in preventive medicine and chronic disease management.',
    availability: {
      nextAvailable: '2024-01-26',
      timeSlots: ['9:00 AM', '2:30 PM', '4:00 PM'],
    },
    isAcceptingPatients: true,
    telehealth: true,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    subSpecialties: ['Interventional Cardiology', 'Heart Failure'],
    rating: 4.8,
    reviewCount: 89,
    languages: ['English', 'Mandarin'],
    location: {
      address: '456 Heart Institute Blvd',
      city: 'San Francisco',
      state: 'CA',
      distance: '1.2 miles',
    },
    acceptedInsurance: ['Blue Cross', 'Cigna', 'United Healthcare'],
    education: [
      { degree: 'MD', school: 'Harvard Medical School', year: 2008 },
      { degree: 'Cardiology Fellowship', school: 'Mayo Clinic', year: 2014 },
    ],
    avatar: '👨‍⚕️',
    bio: 'Dr. Chen is a leading cardiologist specializing in minimally invasive cardiac procedures and heart failure management. He has published over 50 research papers.',
    availability: {
      nextAvailable: '2024-02-02',
      timeSlots: ['10:00 AM', '1:00 PM'],
    },
    isAcceptingPatients: true,
    telehealth: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    subSpecialties: ['Cosmetic Dermatology', 'Skin Cancer'],
    rating: 4.7,
    reviewCount: 156,
    languages: ['English', 'Spanish', 'Portuguese'],
    location: {
      address: '789 Skin Care Plaza, Floor 3',
      city: 'San Francisco',
      state: 'CA',
      distance: '2.1 miles',
    },
    acceptedInsurance: ['Blue Cross', 'Aetna', 'Kaiser'],
    education: [
      { degree: 'MD', school: 'UCLA Medical School', year: 2012 },
      { degree: 'Dermatology Residency', school: 'UCSF', year: 2016 },
    ],
    avatar: '👩‍⚕️',
    bio: 'Dr. Rodriguez is a board-certified dermatologist with expertise in both medical and cosmetic dermatology. She is known for her gentle approach and excellent patient care.',
    availability: {
      nextAvailable: '2024-01-30',
      timeSlots: ['11:00 AM', '3:30 PM'],
    },
    isAcceptingPatients: false,
    telehealth: false,
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    subSpecialties: ['Sports Medicine', 'Joint Replacement'],
    rating: 4.9,
    reviewCount: 203,
    languages: ['English'],
    location: {
      address: '321 Sports Medicine Center',
      city: 'San Francisco',
      state: 'CA',
      distance: '1.8 miles',
    },
    acceptedInsurance: ['Blue Cross', 'Aetna', 'United Healthcare', 'Cigna'],
    education: [
      { degree: 'MD', school: 'Johns Hopkins', year: 2005 },
      { degree: 'Orthopedic Surgery Residency', school: 'Hospital for Special Surgery', year: 2010 },
    ],
    avatar: '👨‍⚕️',
    bio: 'Dr. Wilson is a renowned orthopedic surgeon specializing in sports injuries and joint replacement. He has treated professional athletes and is known for innovative surgical techniques.',
    availability: {
      nextAvailable: '2024-02-05',
      timeSlots: ['8:00 AM', '12:00 PM'],
    },
    isAcceptingPatients: true,
    telehealth: false,
  },
];

const specialtyIcons: { [key: string]: React.ReactNode } = {
  'Primary Care': <Stethoscope className="w-5 h-5" />,
  'Cardiology': <Heart className="w-5 h-5" />,
  'Dermatology': <Eye className="w-5 h-5" />,
  'Orthopedics': <Activity className="w-5 h-5" />,
  'Neurology': <Brain className="w-5 h-5" />,
};

export const Doctors: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSpecialty, setSelectedSpecialty] = React.useState('all');
  const [selectedInsurance, setSelectedInsurance] = React.useState('all');
  const [acceptingPatients, setAcceptingPatients] = React.useState(false);
  const [telehealth, setTelehealth] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('rating');

  const specialties = ['Primary Care', 'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology'];
  const insuranceOptions = ['Blue Cross', 'Aetna', 'Kaiser', 'United Healthcare', 'Cigna'];

  const filteredDoctors = mockDoctors
    .filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.subSpecialties.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
      const matchesInsurance = selectedInsurance === 'all' || doctor.acceptedInsurance.includes(selectedInsurance);
      const matchesAccepting = !acceptingPatients || doctor.isAcceptingPatients;
      const matchesTelehealth = !telehealth || doctor.telehealth;
      
      return matchesSearch && matchesSpecialty && matchesInsurance && matchesAccepting && matchesTelehealth;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.location.distance) - parseFloat(b.location.distance);
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
          <p className="text-gray-600 mt-1">
            Search and connect with healthcare providers in your area
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="info" size="sm">
            <Users className="w-3 h-3 mr-1" />
            {filteredDoctors.length} doctors found
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by doctor name, specialty, or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Near me
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Specialties</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance
                </label>
                <select
                  value={selectedInsurance}
                  onChange={(e) => setSelectedInsurance(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Insurance</option>
                  {insuranceOptions.map(insurance => (
                    <option key={insurance} value={insurance}>{insurance}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="distance">Closest</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={acceptingPatients}
                    onChange={(e) => setAcceptingPatients(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Accepting patients</span>
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={telehealth}
                    onChange={(e) => setTelehealth(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Telehealth</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{doctor.avatar}</div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {doctor.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {specialtyIcons[doctor.specialty]}
                        <span className="text-gray-600">{doctor.specialty}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                      <span className="text-sm text-gray-500">({doctor.reviewCount})</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {doctor.location.address} • {doctor.location.distance}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      {doctor.languages.join(', ')}
                    </div>
                    
                    {doctor.availability.nextAvailable && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Next available: {doctor.availability.nextAvailable}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {doctor.subSpecialties.map((sub, index) => (
                      <Badge key={index} variant="default" size="sm">
                        {sub}
                      </Badge>
                    ))}
                    {doctor.isAcceptingPatients && (
                      <Badge variant="success" size="sm">
                        Accepting Patients
                      </Badge>
                    )}
                    {doctor.telehealth && (
                      <Badge variant="info" size="sm">
                        Telehealth
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {doctor.bio}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        {doctor.education[0].school}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        Book
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters to find more doctors.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};