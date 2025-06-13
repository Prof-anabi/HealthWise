import React from 'react';
import { format } from 'date-fns';
import {
  FileText,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

// Mock test results data
const mockTestResults = [
  {
    id: '1',
    testName: 'Complete Blood Count (CBC)',
    testType: 'blood',
    date: '2024-01-15',
    orderingPhysician: 'Dr. Sarah Johnson',
    values: [
      { name: 'White Blood Cells', value: 7.2, unit: 'K/uL', normalRange: '4.0-10.0', status: 'normal' },
      { name: 'Red Blood Cells', value: 4.5, unit: 'M/uL', normalRange: '4.2-5.8', status: 'normal' },
      { name: 'Hemoglobin', value: 14.2, unit: 'g/dL', normalRange: '12.0-16.0', status: 'normal' },
      { name: 'Hematocrit', value: 42.1, unit: '%', normalRange: '36.0-48.0', status: 'normal' },
    ],
    interpretation: {
      summary: 'All blood count values are within normal limits',
      plainLanguage: 'Your blood test shows that all your blood cells are at healthy levels. This means your body is making the right amount of red blood cells to carry oxygen, white blood cells to fight infection, and your blood can clot properly.',
      recommendations: [
        'Continue maintaining a healthy diet rich in iron and vitamins',
        'Keep up with regular exercise',
        'Follow up in 6 months for routine monitoring'
      ]
    }
  },
  {
    id: '2',
    testName: 'Lipid Panel',
    testType: 'blood',
    date: '2024-01-10',
    orderingPhysician: 'Dr. Sarah Johnson',
    values: [
      { name: 'Total Cholesterol', value: 195, unit: 'mg/dL', normalRange: '<200', status: 'normal' },
      { name: 'LDL Cholesterol', value: 125, unit: 'mg/dL', normalRange: '<100', status: 'high' },
      { name: 'HDL Cholesterol', value: 55, unit: 'mg/dL', normalRange: '>40', status: 'normal' },
      { name: 'Triglycerides', value: 88, unit: 'mg/dL', normalRange: '<150', status: 'normal' },
    ],
    interpretation: {
      summary: 'LDL cholesterol slightly elevated, other lipid values normal',
      plainLanguage: 'Your cholesterol test shows mostly good results. However, your "bad" cholesterol (LDL) is a bit higher than ideal. The "good" cholesterol (HDL) and triglycerides are at healthy levels.',
      concerns: [
        'Elevated LDL cholesterol increases risk of heart disease over time'
      ],
      recommendations: [
        'Reduce saturated fat in your diet',
        'Increase physical activity to 150 minutes per week',
        'Consider adding more fiber-rich foods like oats and beans',
        'Recheck lipid levels in 3 months'
      ]
    }
  },
  {
    id: '3',
    testName: 'Glucose (Fasting)',
    testType: 'blood',
    date: '2024-01-05',
    orderingPhysician: 'Dr. Michael Chen',
    values: [
      { name: 'Glucose', value: 92, unit: 'mg/dL', normalRange: '70-100', status: 'normal' },
    ],
    interpretation: {
      summary: 'Fasting glucose within normal range',
      plainLanguage: 'Your blood sugar level after fasting is excellent. This means your body is processing sugar normally and you have a low risk of diabetes.',
      recommendations: [
        'Continue current diet and exercise habits',
        'Annual glucose screening recommended'
      ]
    }
  }
];

export const TestResults: React.FC = () => {
  const [selectedResult, setSelectedResult] = React.useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'success';
      case 'high': return 'warning';
      case 'low': return 'info';
      case 'critical': return 'danger';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-4 h-4" />;
      case 'high': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <TrendingDown className="w-4 h-4" />;
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getTestTypeIcon = (type: string) => {
    switch (type) {
      case 'blood': return '🩸';
      case 'urine': return '🧪';
      case 'imaging': return '📷';
      default: return '📋';
    }
  };

  const selectedTestResult = selectedResult 
    ? mockTestResults.find(result => result.id === selectedResult)
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
          <p className="text-gray-600 mt-1">
            View and understand your medical test results in plain language
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Request New Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Recent Results</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {mockTestResults.map((result) => {
                  const hasAbnormal = result.values.some(v => v.status !== 'normal');
                  
                  return (
                    <button
                      key={result.id}
                      onClick={() => setSelectedResult(result.id)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                        selectedResult === result.id 
                          ? 'bg-primary-50 border-primary-500' 
                          : hasAbnormal 
                            ? 'border-warning-400' 
                            : 'border-success-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-lg mr-2">{getTestTypeIcon(result.testType)}</span>
                            <h4 className="font-medium text-gray-900 text-sm">{result.testName}</h4>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(result.date), 'MMM d, yyyy')}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <User className="w-3 h-3 mr-1" />
                            {result.orderingPhysician}
                          </div>
                        </div>
                        <div className="ml-2">
                          {hasAbnormal ? (
                            <Badge variant="warning" size="sm">
                              Review
                            </Badge>
                          ) : (
                            <Badge variant="success" size="sm">
                              Normal
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed View */}
        <div className="lg:col-span-2">
          {selectedTestResult ? (
            <div className="space-y-6">
              {/* Test Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">{getTestTypeIcon(selectedTestResult.testType)}</span>
                        <h2 className="text-xl font-bold text-gray-900">{selectedTestResult.testName}</h2>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(new Date(selectedTestResult.date), 'MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {selectedTestResult.orderingPhysician}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Plain Language Summary */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    What This Means for You
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">Summary</h4>
                        <p className="text-blue-800 text-sm leading-relaxed">
                          {selectedTestResult.interpretation.plainLanguage}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedTestResult.interpretation.concerns && (
                    <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-warning-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-warning-900 mb-2">Areas to Watch</h4>
                          <ul className="text-warning-800 text-sm space-y-1">
                            {selectedTestResult.interpretation.concerns.map((concern, index) => (
                              <li key={index}>• {concern}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedTestResult.interpretation.recommendations && (
                    <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-success-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-success-900 mb-2">Recommended Actions</h4>
                          <ul className="text-success-800 text-sm space-y-1">
                            {selectedTestResult.interpretation.recommendations.map((rec, index) => (
                              <li key={index}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Detailed Values */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Detailed Results</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedTestResult.values.map((value, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">{value.name}</h4>
                            <div className="ml-2">
                              {getStatusIcon(value.status)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Normal range: {value.normalRange} {value.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {value.value} {value.unit}
                          </p>
                          <Badge variant={getStatusColor(value.status) as any} size="sm">
                            {value.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-64 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Test Result</h3>
                <p className="text-gray-600">
                  Choose a test from the list to view detailed results and explanations
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};