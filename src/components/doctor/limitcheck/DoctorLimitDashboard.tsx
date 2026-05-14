import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  Calendar,
  Phone,
  Activity,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Clock,
  BarChart3,
  CreditCard,
  Pill,
  RefreshCw,
  Stethoscope,
  Loader2,
  UserRound,
  HeartPulse,
  Video,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Type definitions based on the Edge Function response
interface ConsultationLimit {
  used: number;
  max: number;
  remaining: number;
  percentageUsed: number;
}

interface ProfessionalInfo {
  id: string;
  medical_speciality: string;
  consultation_fee: number;
}

interface AlertItem {
  type: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  percentageUsed: number;
}

interface EdgeFunctionResponse {
  allowed?: boolean;
  hasActiveSubscription?: boolean;
  isExpired?: boolean;
  multipleSubscriptions?: boolean;
  activeSubscriptionCount?: number;
  expiredCount?: number;
  message?: string;
  subscriptionEndDate?: string;
  professional?: ProfessionalInfo;
  limits?: {
    in_person?: ConsultationLimit;
    teleconsultation?: ConsultationLimit;
  };
  appointments?: {
    total?: number;
    in_person?: number;
    teleconsultation?: number;
    status_breakdown?: Record<string, number>;
    type_breakdown?: Record<string, number>;
  };
  alerts?: {
    hasAlerts?: boolean;
    alerts?: AlertItem[];
  };
}

interface DoctorLimitDashboardProps {
  doctor_id: string; // The user_auth_id for the doctor
  autoRefresh?: boolean;
  refreshInterval?: number;
  onLimitExceeded?: (exceededTypes: string[]) => void;
}

export function DoctorLimitDashboard({
  doctor_id,
  autoRefresh = true,
  refreshInterval = 30000,
  onLimitExceeded,
}: DoctorLimitDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EdgeFunctionResponse | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const { toast } = useToast();

  // Fetch doctor limits
  const fetchDoctorLimits = useCallback(async () => {
    if (!doctor_id) {
      setError('Doctor ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: responseData, error: functionError } = await supabase.functions.invoke(
        'check-professional-limit',
        {
          body: {
            user_auth_id: doctor_id,
          },
        }
      );

      if (functionError) {
        throw new Error(`Edge Function error: ${functionError.message}`);
      }

      if (!responseData) {
        throw new Error('No data received from edge function');
      }

      setData(responseData);
      setLastRefreshed(new Date());

      // Check exceeded limits
      const exceededLimits = [];
      if (responseData.limits?.in_person && responseData.limits.in_person.remaining <= 0) {
        exceededLimits.push('In-Person Consultations');
      }
      if (responseData.limits?.teleconsultation && responseData.limits.teleconsultation.remaining <= 0) {
        exceededLimits.push('Teleconsultations');
      }

      if (exceededLimits.length > 0 && onLimitExceeded) {
        onLimitExceeded(exceededLimits);
      }

      // Show toast for subscription expired
      if (responseData.isExpired) {
        toast({
          title: 'Subscription Expired',
          description: responseData.message || 'Your subscription has expired. Please renew to continue.',
          variant: 'destructive',
          duration: 10000,
        });
      }

      // Show toast for limit warnings (non-critical)
      if (responseData.alerts?.hasAlerts) {
        const criticalAlert = responseData.alerts?.alerts?.find(
  (a: AlertItem) => a.level === 'critical'
);
        if (criticalAlert) {
          toast({
            title: 'Critical Alert',
            description: criticalAlert.message,
            variant: 'destructive',
            duration: 10000,
          });
        } else {
          const warningAlert = responseData.alerts?.alerts?.find(
  (a: AlertItem) => a.level === 'warning'
);
          if (warningAlert) {
            toast({
              title: 'Warning',
              description: warningAlert.message,
              variant: 'default',
            });
          }
        }
      }
    } catch (err) {
      console.error('Error fetching doctor limits:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctor limits';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [doctor_id, toast, onLimitExceeded]);

  // Auto-refresh
  useEffect(() => {
    fetchDoctorLimits();

    let intervalId: ReturnType<typeof setInterval>;
    if (autoRefresh && refreshInterval > 0 && data?.hasActiveSubscription) {
      intervalId = setInterval(fetchDoctorLimits, refreshInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
 }, [
  fetchDoctorLimits,
  autoRefresh,
  refreshInterval,
  data?.hasActiveSubscription,
]);
  // Helper for progress bar color
  const getStatusColor = (percentage: number, isExpired: boolean) => {
    if (isExpired) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (percentage >= 90) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    if (percentage >= 70) return 'bg-gradient-to-r from-orange-500 to-orange-400';
    if (percentage >= 50) return 'bg-gradient-to-r from-blue-500 to-blue-400';
    return 'bg-gradient-to-r from-green-500 to-emerald-500';
  };

  // Status badge
  const getStatusBadge = (remaining: number, max: number, isExpired: boolean) => {
    if (isExpired) {
      return (
        <Badge variant="destructive" className="animate-pulse bg-gradient-to-r from-red-600 to-red-700">
          <AlertCircle className="w-3 h-3 mr-1" />
          Expired
        </Badge>
      );
    }
    if (remaining <= 0) {
      return (
        <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-red-600">
          <AlertCircle className="w-3 h-3 mr-1" />
          Exceeded
        </Badge>
      );
    }
    if (max === 0) {
      return (
        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Unlimited
        </Badge>
      );
    }
    return (
      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  // Loading state
  if (loading && !data) {
    return <DoctorLimitDashboardSkeleton />;
  }

  // Error state
  if (error && !data) {
    return (
      <Alert variant="destructive" className="mb-4 border-l-4 border-l-red-500">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Dashboard</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={fetchDoctorLimits}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert className="border-l-4 border-l-yellow-500">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          Unable to load doctor subscription data. Please check your doctor ID and try again.
        </AlertDescription>
      </Alert>
    );
  }

  // ============================================================
  // CONDITION: If subscription expired or not active
  // Show "Subscription Required" UI instead of full dashboard
  // ============================================================
  if (!data.hasActiveSubscription || data.isExpired) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Subscription Dashboard
            </h2>
            <p className="text-muted-foreground mt-1">
              Monitor your consultation limits and subscription status
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <span className="text-xs text-muted-foreground">
                Last updated: {formatTimeAgo(lastRefreshed)}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDoctorLimits}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Professional Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                  Dr. {data.professional.id.substring(0, 8)}...
                </CardTitle>
                <CardDescription>
                  Specialty: {data.professional.medical_speciality} | Consultation Fee: ₹{data.professional.consultation_fee || 0}
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white">
                  {data.isExpired ? 'Expired' : 'No Active Plan'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subscription Status</p>
                  <p className="text-sm font-semibold text-red-600">Not Active</p>
                </div>
              </div>
              {data.subscriptionEndDate && (
                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Active Until</p>
                    <p className="text-sm">{formatDate(data.subscriptionEndDate)}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Consultations This Month</p>
                  <p className="text-xl font-bold">{data.appointments?.total || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Required Message */}
        <Card className="border-2 border-dashed border-amber-300 bg-amber-50 dark:bg-amber-950/20 shadow-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl text-amber-800">
              {data.isExpired ? 'Subscription Expired' : 'Subscription Required'}
            </CardTitle>
            <CardDescription className="text-amber-700">
              {data.message || 'Please renew your subscription to continue providing consultations.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-amber-700">
              {data.isExpired
                ? 'Your subscription has expired. Renew now to avoid service interruption and continue seeing patients.'
                : 'You don\'t have an active subscription. Subscribe to a plan to start offering consultations.'}
            </p>
            <div className="flex justify-center gap-3">
              <Button 
                variant="outline" 
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={fetchDoctorLimits}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
              <Button 
                variant="default" 
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => {
                  toast({
                    title: "Contact Support",
                    description: "Please reach out to support to renew your subscription.",
                  });
                }}
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        {data.alerts?.hasAlerts && (
          <Alert variant="destructive" className="border-l-4 border-l-red-500">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Critical Alerts</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {data.alerts?.alerts?.map((alert, idx) => (
                  <li key={idx} className={alert.level === 'critical' ? 'font-bold' : ''}>
                    {alert.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // ============================================================
  // ACTIVE SUBSCRIPTION: Full dashboard
  // ============================================================
  const inPerson = data?.limits?.in_person ?? {
  used: 0,
  max: 0,
  remaining: 0,
  percentageUsed: 0,
};

const tele = data?.limits?.teleconsultation ?? {
  used: 0,
  max: 0,
  remaining: 0,
  percentageUsed: 0,
};
  const isExpired = data.isExpired ?? false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Subscription Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor your consultation limits and subscription status
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefreshed && (
            <span className="text-xs text-muted-foreground">
              Last updated: {formatTimeAgo(lastRefreshed)}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDoctorLimits}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Professional Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-blue-600" />
Dr. {data.professional?.id?.substring(0, 8) || 'Unknown'}...              </CardTitle>
              <CardDescription>
                Specialty: {data.professional?.medical_speciality || 'N/A'} | Consultation Fee: ₹{data.professional?.consultation_fee || 0}
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                Active Plan
              </Badge>
              {data.subscriptionEndDate && (
                <p className="text-sm text-muted-foreground mt-1">
                  Valid until {formatDate(data.subscriptionEndDate)}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Consultations</p>
                <p className="text-xl font-bold">{data.appointments?.total || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">In-Person</p>
                <p className="text-xl font-bold">{data.appointments?.in_person || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
              <Video className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teleconsultations</p>
                <p className="text-xl font-bold">{data.appointments?.teleconsultation || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscription Status</p>
                <Badge className="bg-green-500">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {data.alerts?.hasAlerts && (
        <Alert variant="default" className="border-l-4 border-l-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Important Notices</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2 space-y-1 text-yellow-700">
              {data.alerts.alerts.map((alert, idx) => (
                <li key={idx}>{alert.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex bg-gray-100">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
            <Calendar className="h-4 w-4" />
            Appointments
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* In-Person Consultations Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-600">
                    <Users className="h-5 w-5" />
                    In-Person Consultations
                  </CardTitle>
                  {getStatusBadge(inPerson.remaining, inPerson.max, isExpired)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold">{inPerson.used}</span>
                    <span className="text-muted-foreground">
                      / {inPerson.max === 0 ? '∞' : inPerson.max}
                    </span>
                  </div>
                  <Progress
                    value={inPerson.percentageUsed}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {inPerson.remaining} remaining
                    </span>
                    <span className="font-medium">{inPerson.percentageUsed}% used</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teleconsultations Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2 text-lg text-purple-600">
                    <Video className="h-5 w-5" />
                    Teleconsultations
                  </CardTitle>
                  {getStatusBadge(tele.remaining, tele.max, isExpired)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold">{tele.used}</span>
                    <span className="text-muted-foreground">
                      / {tele.max === 0 ? '∞' : tele.max}
                    </span>
                  </div>
                  <Progress
                    value={tele.percentageUsed}
                 />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {tele.remaining} remaining
                    </span>
                    <span className="font-medium">{tele.percentageUsed}% used</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Summary Card */}
            <Card className="hover:shadow-lg transition-all duration-300 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-600">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Summary
                </CardTitle>
                <CardDescription>Consultation breakdown and usage trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Status Breakdown</p>
                    <div className="space-y-2">
                      {Object.entries(data.appointments?.status_breakdown || {}).map(([status, count]) => (
                        <div key={status} className="flex justify-between items-center">
                          <span className="capitalize text-sm">{status}</span>
                          <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                            {count as number}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Type Breakdown</p>
                    <div className="space-y-2">
                      {Object.entries(data.appointments?.type_breakdown || {}).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="capitalize text-sm">{type.replace('_', ' ')}</span>
                          <Badge variant="outline" className="border-blue-200 text-blue-700">
                            {count as number}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-600">
                  <Calendar className="h-5 w-5" />
                  Appointment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(data.appointments?.status_breakdown || {}).map(([status, count]) => (
                    <div key={status}>
                      <div className="flex justify-between mb-1">
                        <span className="capitalize text-sm">{status}</span>
                        <span className="text-sm font-medium">{count as number}</span>
                      </div>
                      <Progress 
                      value={
  data.appointments?.total > 0
    ? ((count as number) / data.appointments.total) * 100
    : 0
} className="bg-gray-100"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-600">
                  <HeartPulse className="h-5 w-5" />
                  Consultation Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">In-Person</span>
                      <span className="text-sm font-medium">{data.appointments?.in_person}</span>
                    </div>
                    <Progress 
                    value={
  data.appointments?.total > 0
    ? (data.appointments.in_person / data.appointments.total) * 100
    : 0
} className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Teleconsultation</span>
                      <span className="text-sm font-medium">{data.appointments?.teleconsultation}</span>
                    </div>
                    <Progress 
                     value={
  data.appointments?.total > 0
    ? (data.appointments.teleconsultation / data.appointments.total) * 100
    : 0
} className="bg-gray-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4">
        Data refreshes automatically every {refreshInterval / 1000} seconds
        {lastRefreshed && ` • Last updated: ${lastRefreshed.toLocaleTimeString()}`}
      </div>
    </div>
  );
}

// Loading Skeleton
function DoctorLimitDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}