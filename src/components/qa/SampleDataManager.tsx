import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Database, 
  Bug, 
  TestTube, 
  Shield,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

const sampleRoles = [
  {
    role: 'patient',
    users: [
      {
        id: 'patient_001',
        name: 'John Smith',
        email: 'john.smith@test.com',
        password: 'Test@123',
        profile: {
          age: 35,
          gender: 'Male',
          phone: '+1-555-0101',
          address: '123 Main St, City, State',
          emergencyContact: 'Jane Smith (+1-555-0102)',
          medicalHistory: ['Hypertension', 'Diabetes Type 2'],
          allergies: ['Penicillin'],
          currentMedications: ['Metformin', 'Lisinopril']
        }
      },
      {
        id: 'patient_002',
        name: 'Maria Garcia',
        email: 'maria.garcia@test.com',
        password: 'Test@123',
        profile: {
          age: 28,
          gender: 'Female',
          phone: '+1-555-0201',
          address: '456 Oak Ave, City, State',
          emergencyContact: 'Carlos Garcia (+1-555-0202)',
          medicalHistory: ['Asthma'],
          allergies: ['Shellfish'],
          currentMedications: ['Albuterol inhaler']
        }
      }
    ]
  },
  {
    role: 'doctor',
    users: [
      {
        id: 'doctor_001',
        name: 'Dr. Sarah Johnson',
        email: 'dr.johnson@test.com',
        password: 'Test@123',
        profile: {
          specialty: 'Internal Medicine',
          licenseNumber: 'MD123456',
          experience: '15 years',
          qualifications: ['MD - Harvard Medical School', 'Board Certified Internal Medicine'],
          availability: {
            monday: '9:00-17:00',
            tuesday: '9:00-17:00',
            wednesday: '9:00-17:00',
            thursday: '9:00-17:00',
            friday: '9:00-15:00'
          },
          consultationFee: 150
        }
      },
      {
        id: 'doctor_002',
        name: 'Dr. Michael Chen',
        email: 'dr.chen@test.com',
        password: 'Test@123',
        profile: {
          specialty: 'Cardiology',
          licenseNumber: 'MD789012',
          experience: '12 years',
          qualifications: ['MD - Johns Hopkins', 'Fellowship in Cardiology'],
          availability: {
            monday: '8:00-16:00',
            tuesday: '8:00-16:00',
            wednesday: '8:00-12:00',
            thursday: '8:00-16:00',
            friday: '8:00-16:00'
          },
          consultationFee: 200
        }
      }
    ]
  },
  {
    role: 'hospital',
    users: [
      {
        id: 'hospital_001',
        name: 'City General Hospital',
        email: 'admin@citygeneral.test.com',
        password: 'Test@123',
        profile: {
          type: 'General Hospital',
          beds: 250,
          accreditation: ['JCI', 'NABH'],
          services: ['Emergency', 'ICU', 'Surgery', 'Cardiology', 'Neurology'],
          address: '789 Hospital Blvd, Medical District',
          phone: '+1-555-HOSPITAL',
          departments: [
            { name: 'Emergency', head: 'Dr. Robert Wilson', beds: 20 },
            { name: 'ICU', head: 'Dr. Lisa Adams', beds: 30 },
            { name: 'Cardiology', head: 'Dr. Michael Chen', beds: 25 }
          ]
        }
      }
    ]
  }
];

const testScenarios = [
  {
    id: 'appointment_booking',
    title: 'Appointment Booking Flow',
    description: 'Test complete appointment booking process',
    steps: [
      'Login as patient',
      'Search for doctors by specialty',
      'Select available time slot',
      'Enter symptoms/reason',
      'Complete payment',
      'Receive confirmation'
    ],
    expectedResult: 'Appointment successfully booked and confirmed',
    priority: 'High'
  },
  {
    id: 'teleconsultation',
    title: 'Video Consultation',
    description: 'Test video call functionality',
    steps: [
      'Join consultation as patient',
      'Join consultation as doctor',
      'Test video/audio quality',
      'Test screen sharing',
      'Test consultation notes',
      'End consultation'
    ],
    expectedResult: 'Smooth video consultation experience',
    priority: 'High'
  },
  {
    id: 'payment_processing',
    title: 'Payment Processing',
    description: 'Test all payment methods',
    steps: [
      'Test Stripe payment',
      'Test Razorpay payment',
      'Test wallet payment',
      'Test insurance claim',
      'Verify payment confirmation',
      'Check invoice generation'
    ],
    expectedResult: 'All payment methods work correctly',
    priority: 'Critical'
  }
];

const SampleDataManager = () => {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState('patient');
  const [isLoading, setIsLoading] = useState(false);

  const generateSampleData = async (role: string) => {
    setIsLoading(true);
    try {
      // Simulate API call to generate sample data
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: 'Sample Data Generated',
        description: `${role} sample data has been created successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate sample data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearSampleData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Sample Data Cleared',
        description: 'All test data has been removed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Sample Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {sampleRoles.map((roleData) => (
              <Card 
                key={roleData.role} 
                className={`cursor-pointer transition-all ${
                  selectedRole === roleData.role ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedRole(roleData.role)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg capitalize">{roleData.role}</CardTitle>
                  <Badge variant="secondary">{roleData.users.length} test users</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {roleData.users.map((user, index) => (
                      <div key={user.id} className="text-sm">
                        <span className="font-medium">{user.name}</span>
                        <div className="text-muted-foreground">{user.email}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex space-x-4">
            <Button 
              onClick={() => generateSampleData(selectedRole)}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
              <span>Generate {selectedRole} Data</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={clearSampleData}
              disabled={isLoading}
            >
              Clear All Test Data
            </Button>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Test Data
            </Button>
            
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Test Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="h-5 w-5" />
            <span>Test Scenarios</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testScenarios.map((scenario) => (
              <Card key={scenario.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{scenario.title}</CardTitle>
                    <Badge variant={scenario.priority === 'Critical' ? 'destructive' : scenario.priority === 'High' ? 'default' : 'secondary'}>
                      {scenario.priority}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{scenario.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Test Steps:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {scenario.steps.map((step, index) => (
                          <li key={index} className="text-muted-foreground">{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Expected Result:</h4>
                      <p className="text-sm text-muted-foreground">{scenario.expectedResult}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Run Test
                      </Button>
                      <Button size="sm" variant="outline">
                        View Results
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SampleDataManager;