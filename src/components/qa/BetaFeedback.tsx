import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Send,
  Users,
  TrendingUp,
  Download
} from 'lucide-react';

interface Feedback {
  id: string;
  user: {
    name: string;
    role: 'patient' | 'doctor' | 'hospital' | 'admin';
    email: string;
  };
  rating: number;
  category: 'UI/UX' | 'Performance' | 'Feature Request' | 'Bug Report' | 'General';
  title: string;
  description: string;
  timestamp: string;
  status: 'New' | 'Reviewing' | 'Planned' | 'In Progress' | 'Completed' | 'Declined';
  votes: {
    upvotes: number;
    downvotes: number;
  };
  priority: 'Low' | 'Medium' | 'High';
}

const mockFeedback: Feedback[] = [
  {
    id: 'FB-001',
    user: {
      name: 'Dr. Sarah Johnson',
      role: 'doctor',
      email: 'dr.johnson@test.com'
    },
    rating: 4,
    category: 'Feature Request',
    title: 'Add bulk patient scheduling feature',
    description: 'Would love to be able to schedule multiple patients at once, especially for routine check-ups or follow-up appointments.',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'Planned',
    votes: { upvotes: 12, downvotes: 1 },
    priority: 'High'
  },
  {
    id: 'FB-002',
    user: {
      name: 'John Smith',
      role: 'patient',
      email: 'john.smith@test.com'
    },
    rating: 5,
    category: 'UI/UX',
    title: 'Love the new appointment booking flow!',
    description: 'The redesigned appointment booking is so much easier to use. The calendar view is intuitive and the confirmation process is smooth.',
    timestamp: '2024-01-14T15:22:00Z',
    status: 'Completed',
    votes: { upvotes: 8, downvotes: 0 },
    priority: 'Medium'
  },
  {
    id: 'FB-003',
    user: {
      name: 'City General Hospital',
      role: 'hospital',
      email: 'admin@citygeneral.test.com'
    },
    rating: 3,
    category: 'Performance',
    title: 'Dashboard loading times could be improved',
    description: 'The analytics dashboard takes 5-7 seconds to load with our patient volume. Would be great to optimize this for larger facilities.',
    timestamp: '2024-01-13T09:45:00Z',
    status: 'In Progress',
    votes: { upvotes: 6, downvotes: 2 },
    priority: 'High'
  }
];

const BetaFeedback = () => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  
  const [newFeedback, setNewFeedback] = useState({
    rating: 5,
    category: 'General' as const,
    title: '',
    description: ''
  });

  const categories = ['UI/UX', 'Performance', 'Feature Request', 'Bug Report', 'General'];
  const statuses = ['New', 'Reviewing', 'Planned', 'In Progress', 'Completed', 'Declined'];

  const filteredFeedback = feedback.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'patient': return 'bg-green-100 text-green-800';
      case 'hospital': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'Planned': return 'bg-purple-100 text-purple-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVote = (feedbackId: string, type: 'up' | 'down') => {
    setFeedback(prev => prev.map(item => {
      if (item.id === feedbackId) {
        return {
          ...item,
          votes: {
            upvotes: type === 'up' ? item.votes.upvotes + 1 : item.votes.upvotes,
            downvotes: type === 'down' ? item.votes.downvotes + 1 : item.votes.downvotes
          }
        };
      }
      return item;
    }));
  };

  const submitFeedback = () => {
    const feedback: Feedback = {
      id: `FB-${String(mockFeedback.length + 1).padStart(3, '0')}`,
      user: {
        name: 'Current User',
        role: 'patient',
        email: 'current.user@test.com'
      },
      ...newFeedback,
      timestamp: new Date().toISOString(),
      status: 'New',
      votes: { upvotes: 0, downvotes: 0 },
      priority: 'Medium'
    };

    setFeedback(prev => [feedback, ...prev]);
    setShowFeedbackForm(false);
    setNewFeedback({
      rating: 5,
      category: 'General',
      title: '',
      description: ''
    });

    toast({
      title: 'Feedback Submitted',
      description: 'Thank you for your feedback! We\'ll review it soon.',
    });
  };

  const averageRating = feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedback.length}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% this week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex">
                {getRatingStars(Math.round(averageRating))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Feature Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedback.filter(f => f.category === 'Feature Request').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Beta Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              Across all roles
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="category-filter">Category:</Label>
            <select 
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="status-filter">Status:</Label>
            <select 
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setShowFeedbackForm(!showFeedbackForm)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Feedback
          </Button>
        </div>
      </div>

      {/* New Feedback Form */}
      {showFeedbackForm && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Beta Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="feedback-category">Category</Label>
                <select 
                  id="feedback-category"
                  value={newFeedback.category}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full border rounded px-3 py-2"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="feedback-rating">Rating</Label>
                <select 
                  id="feedback-rating"
                  value={newFeedback.rating}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="feedback-title">Title</Label>
              <Input
                id="feedback-title"
                value={newFeedback.title}
                onChange={(e) => setNewFeedback(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief summary of your feedback"
              />
            </div>
            
            <div>
              <Label htmlFor="feedback-description">Description</Label>
              <Textarea
                id="feedback-description"
                value={newFeedback.description}
                onChange={(e) => setNewFeedback(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed feedback, suggestions, or issues you've encountered"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={submitFeedback}>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowFeedbackForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(item.user.role)}>
                      {item.user.role}
                    </Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{item.user.name}</span>
                    <span>•</span>
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      {getRatingStars(item.rating)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleVote(item.id, 'up')}
                    className="flex items-center space-x-1"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>{item.votes.upvotes}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleVote(item.id, 'down')}
                    className="flex items-center space-x-1"
                  >
                    <ThumbsDown className="h-3 w-3" />
                    <span>{item.votes.downvotes}</span>
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Priority: {item.priority}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BetaFeedback;