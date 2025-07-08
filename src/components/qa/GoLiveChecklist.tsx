import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Database,
  Lock,
  FileText,
  Users,
  Settings,
  Globe,
  Zap,
  Download
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'in-progress' | 'not-started';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  evidence?: string[];
  notes?: string;
}

const goLiveChecklist: ChecklistItem[] = [
  // Security & Compliance
  {
    id: 'sec-001',
    category: 'Security',
    title: 'SSL/TLS Certificate Configuration',
    description: 'Ensure all communications are encrypted with valid SSL certificates',
    status: 'completed',
    priority: 'critical',
    assignee: 'DevOps Team',
    evidence: ['ssl-cert-validation.pdf', 'security-scan-results.pdf']
  },
  {
    id: 'sec-002',
    category: 'Security',
    title: 'HIPAA Compliance Audit',
    description: 'Complete HIPAA compliance assessment and documentation',
    status: 'in-progress',
    priority: 'critical',
    assignee: 'Compliance Officer',
    dueDate: '2024-01-20'
  },
  {
    id: 'sec-003',
    category: 'Security',
    title: 'Penetration Testing',
    description: 'Third-party security assessment and vulnerability testing',
    status: 'completed',
    priority: 'critical',
    assignee: 'Security Consultant',
    evidence: ['pentest-report-2024.pdf']
  },
  {
    id: 'sec-004',
    category: 'Security',
    title: 'Data Encryption at Rest',
    description: 'Verify all sensitive data is encrypted in database and storage',
    status: 'completed',
    priority: 'critical',
    assignee: 'Backend Team'
  },
  {
    id: 'sec-005',
    category: 'Security',
    title: 'Access Control & Authentication',
    description: 'Implement role-based access control and multi-factor authentication',
    status: 'completed',
    priority: 'critical',
    assignee: 'Backend Team'
  },
  
  // Data & Privacy
  {
    id: 'data-001',
    category: 'Data Privacy',
    title: 'Privacy Policy & Terms of Service',
    description: 'Legal review and approval of privacy policy and terms',
    status: 'completed',
    priority: 'high',
    assignee: 'Legal Team',
    evidence: ['privacy-policy-v2.pdf', 'terms-of-service-v2.pdf']
  },
  {
    id: 'data-002',
    category: 'Data Privacy',
    title: 'Data Backup & Recovery Procedures',
    description: 'Implement automated backups and test recovery procedures',
    status: 'completed',
    priority: 'high',
    assignee: 'DevOps Team'
  },
  {
    id: 'data-003',
    category: 'Data Privacy',
    title: 'GDPR Compliance (EU Operations)',
    description: 'Ensure GDPR compliance for European users',
    status: 'pending',
    priority: 'high',
    assignee: 'Legal Team',
    dueDate: '2024-01-25'
  },
  
  // Performance & Scalability
  {
    id: 'perf-001',
    category: 'Performance',
    title: 'Load Testing',
    description: 'Conduct load testing for expected user volume',
    status: 'completed',
    priority: 'high',
    assignee: 'QA Team',
    evidence: ['load-test-results.pdf']
  },
  {
    id: 'perf-002',
    category: 'Performance',
    title: 'CDN Configuration',
    description: 'Configure Content Delivery Network for global performance',
    status: 'completed',
    priority: 'medium',
    assignee: 'DevOps Team'
  },
  {
    id: 'perf-003',
    category: 'Performance',
    title: 'Database Optimization',
    description: 'Optimize database queries and implement caching strategies',
    status: 'completed',
    priority: 'high',
    assignee: 'Backend Team'
  },
  
  // Monitoring & Alerts
  {
    id: 'mon-001',
    category: 'Monitoring',
    title: 'Application Performance Monitoring',
    description: 'Setup APM tools and alerting for application health',
    status: 'completed',
    priority: 'high',
    assignee: 'DevOps Team'
  },
  {
    id: 'mon-002',
    category: 'Monitoring',
    title: 'Error Tracking & Logging',
    description: 'Implement comprehensive error tracking and logging',
    status: 'completed',
    priority: 'high',
    assignee: 'Development Team'
  },
  {
    id: 'mon-003',
    category: 'Monitoring',
    title: '24/7 Support Setup',
    description: 'Establish on-call procedures and support escalation',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Operations Team',
    dueDate: '2024-01-18'
  },
  
  // Documentation & Training
  {
    id: 'doc-001',
    category: 'Documentation',
    title: 'User Documentation',
    description: 'Complete user guides and help documentation',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Technical Writing Team',
    dueDate: '2024-01-22'
  },
  {
    id: 'doc-002',
    category: 'Documentation',
    title: 'API Documentation',
    description: 'Comprehensive API documentation for integrations',
    status: 'completed',
    priority: 'medium',
    assignee: 'Backend Team'
  },
  {
    id: 'doc-003',
    category: 'Documentation',
    title: 'Staff Training Materials',
    description: 'Training materials for healthcare staff onboarding',
    status: 'pending',
    priority: 'medium',
    assignee: 'Training Team',
    dueDate: '2024-01-30'
  },
  
  // Legal & Regulatory
  {
    id: 'legal-001',
    category: 'Legal',
    title: 'Medical Device Registration (if applicable)',
    description: 'Register with relevant medical device authorities',
    status: 'not-started',
    priority: 'critical',
    assignee: 'Regulatory Affairs',
    dueDate: '2024-02-15'
  },
  {
    id: 'legal-002',
    category: 'Legal',
    title: 'Professional Liability Insurance',
    description: 'Secure appropriate insurance coverage',
    status: 'completed',
    priority: 'critical',
    assignee: 'Legal Team'
  },
  {
    id: 'legal-003',
    category: 'Legal',
    title: 'Data Processing Agreements',
    description: 'Execute DPAs with all third-party processors',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Legal Team',
    dueDate: '2024-01-25'
  }
];

const GoLiveChecklist = () => {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(goLiveChecklist);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['Security', 'Data Privacy', 'Performance', 'Monitoring', 'Documentation', 'Legal'];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'not-started':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-started':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredChecklist = checklist.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const updateItemStatus = (itemId: string, newStatus: ChecklistItem['status']) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
    
    toast({
      title: 'Status Updated',
      description: `Checklist item status updated to ${newStatus}`,
    });
  };

  const completionPercentage = Math.round(
    (checklist.filter(item => item.status === 'completed').length / checklist.length) * 100
  );

  const criticalPendingItems = checklist.filter(
    item => item.priority === 'critical' && item.status !== 'completed'
  ).length;

  const overdueTasks = checklist.filter(item => {
    if (!item.dueDate) return false;
    return new Date(item.dueDate) < new Date() && item.status !== 'completed';
  }).length;

  const generateComplianceReport = () => {
    toast({
      title: 'Generating Report',
      description: 'Compliance report is being generated and will be emailed to stakeholders',
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalPendingItems}</div>
            <div className="text-xs text-muted-foreground">Items requiring immediate attention</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{overdueTasks}</div>
            <div className="text-xs text-muted-foreground">Past due date</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ready for Launch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {criticalPendingItems === 0 ? (
                <span className="text-green-600">✓</span>
              ) : (
                <span className="text-red-600">✗</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {criticalPendingItems === 0 ? 'All critical items complete' : 'Critical items pending'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="category-filter" className="text-sm font-medium">Category:</label>
            <select 
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateComplianceReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            Security Audit
          </Button>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {filteredChecklist.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    checked={item.status === 'completed'}
                    onCheckedChange={(checked) => 
                      updateItemStatus(item.id, checked ? 'completed' : 'pending')
                    }
                    className="mt-1"
                  />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-wrap">
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    
                    <p className="text-muted-foreground">{item.description}</p>
                    
                    {item.assignee && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        Assigned to: {item.assignee}
                      </div>
                    )}
                    
                    {item.dueDate && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                        {new Date(item.dueDate) < new Date() && item.status !== 'completed' && (
                          <Badge variant="destructive" className="ml-2">Overdue</Badge>
                        )}
                      </div>
                    )}
                    
                    {item.evidence && item.evidence.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Evidence:</div>
                        <div className="flex flex-wrap gap-1">
                          {item.evidence.map((doc, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {item.status !== 'completed' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateItemStatus(item.id, 'completed')}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Launch Readiness Assessment */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Launch Readiness Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Security & Compliance</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Critical Security Items</span>
                    <span className={checklist.filter(i => i.category === 'Security' && i.priority === 'critical' && i.status !== 'completed').length === 0 ? 'text-green-600' : 'text-red-600'}>
                      {checklist.filter(i => i.category === 'Security' && i.priority === 'critical' && i.status !== 'completed').length === 0 ? '✓ Complete' : '✗ Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>HIPAA Compliance</span>
                    <span className={checklist.find(i => i.id === 'sec-002')?.status === 'completed' ? 'text-green-600' : 'text-orange-600'}>
                      {checklist.find(i => i.id === 'sec-002')?.status === 'completed' ? '✓ Complete' : '⚠ In Progress'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Operations</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Performance Testing</span>
                    <span className="text-green-600">✓ Complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24/7 Support</span>
                    <span className="text-orange-600">⚠ In Progress</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Overall Launch Readiness</h4>
                  <p className="text-sm text-muted-foreground">
                    {criticalPendingItems === 0 
                      ? 'Ready for production launch' 
                      : `${criticalPendingItems} critical items must be completed before launch`}
                  </p>
                </div>
                <Badge 
                  className={criticalPendingItems === 0 ? 'bg-green-600' : 'bg-red-600'}
                  variant={criticalPendingItems === 0 ? 'default' : 'destructive'}
                >
                  {criticalPendingItems === 0 ? 'GO' : 'NO-GO'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoLiveChecklist;