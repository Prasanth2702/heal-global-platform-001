import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Bug, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User,
  Calendar,
  Filter,
  Plus,
  MessageSquare,
  Paperclip
} from 'lucide-react';

interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Testing' | 'Closed';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  reporter: string;
  assignee?: string;
  component: string;
  environment: 'Development' | 'Staging' | 'Production';
  createdAt: string;
  updatedAt: string;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  attachments?: string[];
  comments: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
  }>;
}

const mockBugs: BugReport[] = [
  {
    id: 'BUG-001',
    title: 'Payment form validation fails on mobile Safari',
    description: 'The payment form does not validate properly on iOS Safari, allowing invalid credit card numbers to be submitted.',
    severity: 'High',
    status: 'Open',
    priority: 'P1',
    reporter: 'QA Team',
    assignee: 'Frontend Developer',
    component: 'Payment System',
    environment: 'Production',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:22:00Z',
    stepsToReproduce: [
      'Open payment form on iOS Safari',
      'Enter invalid credit card number (e.g., 1234)',
      'Attempt to submit form',
      'Observe validation behavior'
    ],
    expectedBehavior: 'Form should show validation error and prevent submission',
    actualBehavior: 'Form submits with invalid data',
    attachments: ['screenshot_safari_bug.png', 'console_logs.txt'],
    comments: [
      {
        id: 'c1',
        author: 'Frontend Developer',
        content: 'Investigating the Safari-specific validation issue. Seems to be related to input type=number handling.',
        timestamp: '2024-01-15T11:00:00Z'
      }
    ]
  },
  {
    id: 'BUG-002',
    title: 'Video consultation audio cuts out intermittently',
    description: 'During video consultations, audio cuts out for 2-3 seconds every few minutes.',
    severity: 'Critical',
    status: 'In Progress',
    priority: 'P1',
    reporter: 'Dr. Sarah Johnson',
    assignee: 'Backend Developer',
    component: 'Video SDK',
    environment: 'Production',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    stepsToReproduce: [
      'Start video consultation',
      'Continue conversation for 10+ minutes',
      'Observe audio quality',
      'Note any interruptions'
    ],
    expectedBehavior: 'Continuous, clear audio throughout consultation',
    actualBehavior: 'Audio cuts out intermittently, disrupting consultation',
    comments: [
      {
        id: 'c2',
        author: 'Backend Developer',
        content: 'Working with VideoSDK support team to investigate. May be related to bandwidth optimization.',
        timestamp: '2024-01-15T12:30:00Z'
      }
    ]
  }
];

const BugTracker = () => {
  const { toast } = useToast();
  const [bugs, setBugs] = useState<BugReport[]>(mockBugs);
  const [showNewBugForm, setShowNewBugForm] = useState(false);
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const [newBug, setNewBug] = useState({
    title: '',
    description: '',
    severity: 'Medium' as const,
    component: '',
    environment: 'Development' as const,
    stepsToReproduce: [''],
    expectedBehavior: '',
    actualBehavior: ''
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'High':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'Medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'Low':
        return <AlertTriangle className="h-4 w-4 text-green-600" />;
      default:
        return <Bug className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Bug className="h-4 w-4 text-red-600" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Testing':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'Closed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Bug className="h-4 w-4" />;
    }
  };

  const filteredBugs = bugs.filter(bug => {
    const statusMatch = filterStatus === 'all' || bug.status === filterStatus;
    const severityMatch = filterSeverity === 'all' || bug.severity === filterSeverity;
    return statusMatch && severityMatch;
  });

  const addStepToReproduce = () => {
    setNewBug(prev => ({
      ...prev,
      stepsToReproduce: [...prev.stepsToReproduce, '']
    }));
  };

  const updateStep = (index: number, value: string) => {
    setNewBug(prev => ({
      ...prev,
      stepsToReproduce: prev.stepsToReproduce.map((step, i) => i === index ? value : step)
    }));
  };

  const submitBug = () => {
    const bugReport: BugReport = {
      id: `BUG-${String(bugs.length + 1).padStart(3, '0')}`,
      ...newBug,
      status: 'Open',
      priority: 'P2',
      reporter: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };

    setBugs(prev => [bugReport, ...prev]);
    setShowNewBugForm(false);
    setNewBug({
      title: '',
      description: '',
      severity: 'Medium',
      component: '',
      environment: 'Development',
      stepsToReproduce: [''],
      expectedBehavior: '',
      actualBehavior: ''
    });

    toast({
      title: 'Bug Report Submitted',
      description: `Bug ${bugReport.id} has been created successfully`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="status-filter">Status:</Label>
            <select 
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Testing">Testing</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="severity-filter">Severity:</Label>
            <select 
              id="severity-filter"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        
        <Button onClick={() => setShowNewBugForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Report Bug
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Bug List</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          {showNewBugForm && <TabsTrigger value="new">New Bug</TabsTrigger>}
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredBugs.map((bug) => (
            <Card 
              key={bug.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedBug(bug)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(bug.severity)}
                    <div>
                      <CardTitle className="text-lg">{bug.id}: {bug.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{bug.component}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={bug.severity === 'Critical' ? 'destructive' : 'secondary'}>
                      {bug.severity}
                    </Badge>
                    <Badge variant="outline">{bug.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {bug.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {bug.reporter}
                    </span>
                    {bug.assignee && (
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        Assigned to {bug.assignee}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(bug.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Bugs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bugs.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Open</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {bugs.filter(b => b.status === 'Open').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {bugs.filter(b => b.status === 'In Progress').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Critical</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {bugs.filter(b => b.severity === 'Critical').length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {showNewBugForm && (
          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>Report New Bug</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Bug Title</Label>
                  <Input
                    id="title"
                    value={newBug.title}
                    onChange={(e) => setNewBug(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of the bug"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newBug.description}
                    onChange={(e) => setNewBug(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the bug"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="severity">Severity</Label>
                    <select 
                      id="severity"
                      value={newBug.severity}
                      onChange={(e) => setNewBug(prev => ({ ...prev, severity: e.target.value as any }))}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="component">Component</Label>
                    <Input
                      id="component"
                      value={newBug.component}
                      onChange={(e) => setNewBug(prev => ({ ...prev, component: e.target.value }))}
                      placeholder="e.g., Payment System"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="environment">Environment</Label>
                    <select 
                      id="environment"
                      value={newBug.environment}
                      onChange={(e) => setNewBug(prev => ({ ...prev, environment: e.target.value as any }))}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="Development">Development</option>
                      <option value="Staging">Staging</option>
                      <option value="Production">Production</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label>Steps to Reproduce</Label>
                  {newBug.stepsToReproduce.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-2">
                      <span className="text-sm font-medium">{index + 1}.</span>
                      <Input
                        value={step}
                        onChange={(e) => updateStep(index, e.target.value)}
                        placeholder="Describe the step"
                        className="flex-1"
                      />
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addStepToReproduce}
                    className="mt-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Step
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="expected">Expected Behavior</Label>
                  <Textarea
                    id="expected"
                    value={newBug.expectedBehavior}
                    onChange={(e) => setNewBug(prev => ({ ...prev, expectedBehavior: e.target.value }))}
                    placeholder="What should happen"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="actual">Actual Behavior</Label>
                  <Textarea
                    id="actual"
                    value={newBug.actualBehavior}
                    onChange={(e) => setNewBug(prev => ({ ...prev, actualBehavior: e.target.value }))}
                    placeholder="What actually happens"
                    rows={2}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={submitBug}>Submit Bug Report</Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewBugForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Bug Detail Modal/Sidebar would go here */}
    </div>
  );
};

export default BugTracker;