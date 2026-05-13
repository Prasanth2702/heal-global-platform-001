// // // components/dashboard/FacilityLimitDashboard.tsx

// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from '@/components/ui/card';
// // import {
// //   Users,
// //   Building2,
// //   Bed,
// //   Calendar,
// //   Phone,
// //   Activity,
// //   AlertCircle,
// //   CheckCircle2,
// //   TrendingUp,
// //   AlertTriangle,
// //   Clock,
// //   BarChart3,
// //   CreditCard,
// //   Pill,
// //   RefreshCw,
// //   Hospital,
// //   UserCheck,
// //   Stethoscope,
// //   Loader2,
// // } from 'lucide-react';
// // import { Progress } from '@/components/ui/progress';
// // import { Badge } from '@/components/ui/badge';
// // import { Button } from '@/components/ui/button';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import { useToast } from '@/hooks/use-toast';
// // import { supabase } from '@/integrations/supabase/client';

// // // Type definitions based on your Edge Function response
// // interface LimitData {
// //   current: number;
// //   max: number;
// //   allowed: boolean;
// //   remaining: number;
// //   exceeded: boolean;
// //   limitType: 'unlimited' | 'limited';
// //   percentageUsed: number;
// //   used: number;
// // }

// // interface BedUtilizationMetrics {
// //   totalBeds: number;
// //   occupiedBeds: number;
// //   reservedBeds: number;
// //   availableBeds: number;
// //   utilizationRate: number;
// //   upcomingBookings: number;
// // }

// // interface BedBookingsBreakdown {
// //   RESERVED?: number;
// //   ADMITTED?: number;
// //   TRANSFERRED?: number;
// //   DISCHARGED?: number;
// //   CANCELLED?: number;
// // }

// // interface FacilityLimits {
// //   staff: LimitData;
// //   departments: LimitData;
// //   beds: LimitData & { utilizationMetrics: BedUtilizationMetrics };
// //   bedBookings: LimitData & {
// //     breakdown: BedBookingsBreakdown;
// //     activeBookings: number;
// //   };
// //   clinical: LimitData;
// //   tele: LimitData;
// // }

// // interface SubscriptionDetails {
// //   subscriptionId: string;
// //   tierId: string;
// //   tierName: string;
// //   startDate: string;
// //   endDate: string;
// //   daysRemaining: number;
// //   includesBilling: boolean;
// //   includesAnalytics: boolean;
// //   monthlyPrice: number;
// //   totalAppointmentsThisMonth: number;
// //   appointmentStatusBreakdown: Record<string, number>;
// // }

// // interface FacilityInfo {
// //   id: string;
// //   name: string;
// //   adminUserId: string;
// //   currentStaff: number;
// //   currentDepartments: number;
// //   currentBeds: number;
// //   currentBedBookings: number;
// //   isVerified: boolean;
// // }

// // interface EdgeFunctionResponse {
// //   allowed: boolean;
// //   hasActiveSubscription: boolean;
// //   isExpired: boolean;
// //   message: string;
// //   checkType: string;
// //   requesterType: 'admin' | 'staff' | 'direct';
// //   billingFeatureEnabled: boolean;
// //   facility: FacilityInfo;
// //   limits: FacilityLimits;
// //   subscriptionDetails: SubscriptionDetails;
// //   warnings: string[];
// //   recommendations: string[];
// // }

// // interface FacilityLimitDashboardProps {
// //   facility_admin_id?: string;
// //   staff_user_id?: string;
// //   staff_id?: string;
// //   facility_id?: string;
// //   autoRefresh?: boolean;
// //   refreshInterval?: number;
// //   onLimitExceeded?: (exceededLimits: string[]) => void;
// // }

// // export function FacilityLimitDashboard({
// //   facility_admin_id,
// //   staff_user_id,
// //   staff_id,
// //   facility_id,
// //   autoRefresh = true,
// //   refreshInterval = 30000,
// //   onLimitExceeded,
// // }: FacilityLimitDashboardProps) {
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [data, setData] = useState<EdgeFunctionResponse | null>(null);
// //   const [activeTab, setActiveTab] = useState('overview');
// //   const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
// //   const { toast } = useToast();

// //   // Function to fetch data from Edge Function
// //   const fetchFacilityLimits = useCallback(async () => {
// //     // Validate that at least one identifier is provided
// //     if (!facility_admin_id && !staff_user_id && !staff_id && !facility_id) {
// //       setError('Please provide facility_admin_id, staff_user_id, staff_id, or facility_id');
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       setError(null);

// //       console.log('Fetching facility limits with:', {
// //         facility_admin_id,
// //         staff_user_id,
// //         staff_id,
// //         facility_id,
// //       });

// //       // Call the Supabase Edge Function
// //       const { data: responseData, error: functionError } = await supabase.functions.invoke(
// //         'check-facility-limit',
// //         {
// //           body: {
// //             facility_admin_id,
// //             staff_user_id,
// //             staff_id,
// //             facility_id,
// //             check_type: 'all',
// //           },
// //         }
// //       );

// //       if (functionError) {
// //         throw new Error(`Edge Function error: ${functionError.message}`);
// //       }

// //       if (!responseData) {
// //         throw new Error('No data received from edge function');
// //       }

// //       setData(responseData);
// //       setLastRefreshed(new Date());

// //       // Check if any limits are exceeded
// //       if (responseData.limits) {
// //         const exceededLimits = [];
// //         if (responseData.limits.staff?.exceeded) exceededLimits.push('Staff');
// //         if (responseData.limits.departments?.exceeded) exceededLimits.push('Departments');
// //         if (responseData.limits.beds?.exceeded) exceededLimits.push('Beds');
// //         if (responseData.limits.bedBookings?.exceeded) exceededLimits.push('Bed Bookings');
// //         if (responseData.limits.clinical?.exceeded) exceededLimits.push('Clinical Consultations');
// //         if (responseData.limits.tele?.exceeded) exceededLimits.push('Tele Consultations');

// //         if (exceededLimits.length > 0 && onLimitExceeded) {
// //           onLimitExceeded(exceededLimits);
// //         }

// //         // Show warning toast for exceeded limits
// //         if (exceededLimits.length > 0 && !responseData.hasActiveSubscription === false) {
// //           toast({
// //             title: 'Limits Exceeded',
// //             description: `${exceededLimits.join(', ')} ${exceededLimits.length === 1 ? 'has' : 'have'} exceeded subscription limits.`,
// //             variant: 'destructive',
// //           });
// //         }
// //       }

// //       // Show subscription expired warning
// //       if (responseData.isExpired) {
// //         toast({
// //           title: 'Subscription Expired',
// //           description: 'Your facility subscription has expired. Please renew to continue using all features.',
// //           variant: 'destructive',
// //           duration: 10000,
// //         });
// //       }

// //       // Show no subscription warning
// //       if (!responseData.hasActiveSubscription) {
// //         toast({
// //           title: 'No Active Subscription',
// //           description: 'Please contact your facility administrator to activate a subscription.',
// //           variant: 'destructive',
// //           duration: 10000,
// //         });
// //       }
// //     } catch (err) {
// //       console.error('Error fetching facility limits:', err);
// //       const errorMessage = err instanceof Error ? err.message : 'Failed to fetch facility limits';
// //       setError(errorMessage);
// //       toast({
// //         title: 'Error',
// //         description: errorMessage,
// //         variant: 'destructive',
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [facility_admin_id, staff_user_id, staff_id, facility_id, toast, onLimitExceeded]);

// //   // Auto-refresh functionality
// //   useEffect(() => {
// //     fetchFacilityLimits();

// //     let intervalId: NodeJS.Timeout;
// //     if (autoRefresh && refreshInterval > 0 && data?.hasActiveSubscription) {
// //       intervalId = setInterval(fetchFacilityLimits, refreshInterval);
// //     }

// //     return () => {
// //       if (intervalId) clearInterval(intervalId);
// //     };
// //   }, [fetchFacilityLimits, autoRefresh, refreshInterval, data?.hasActiveSubscription]);

// //   // Helper function to get status color for progress bar
// //   const getStatusColor = (percentage: number, exceeded: boolean) => {
// //     if (exceeded) return 'bg-red-500';
// //     if (percentage >= 90) return 'bg-yellow-500';
// //     if (percentage >= 70) return 'bg-orange-500';
// //     if (percentage >= 50) return 'bg-blue-500';
// //     return 'bg-green-500';
// //   };

// //   // Helper function to get status badge
// //   const getStatusBadge = (allowed: boolean, exceeded: boolean, limitType: string) => {
// //     if (limitType === 'unlimited') {
// //       return (
// //         <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
// //           <CheckCircle2 className="w-3 h-3 mr-1" />
// //           Unlimited
// //         </Badge>
// //       );
// //     }
// //     if (!allowed && exceeded) {
// //       return (
// //         <Badge variant="destructive" className="animate-pulse">
// //           <AlertCircle className="w-3 h-3 mr-1" />
// //           Exceeded
// //         </Badge>
// //       );
// //     }
// //     if (!allowed) {
// //       return (
// //         <Badge variant="destructive">
// //           <AlertCircle className="w-3 h-3 mr-1" />
// //           Limit Reached
// //         </Badge>
// //       );
// //     }
// //     return (
// //       <Badge variant="default" className="bg-green-500 hover:bg-green-600">
// //         <CheckCircle2 className="w-3 h-3 mr-1" />
// //         Within Limit
// //       </Badge>
// //     );
// //   };

// //   // Format currency
// //   const formatCurrency = (amount: number) => {
// //     return new Intl.NumberFormat('en-US', {
// //       style: 'currency',
// //       currency: 'USD',
// //     }).format(amount);
// //   };

// //   // Format date
// //   const formatDate = (dateString: string) => {
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'long',
// //       day: 'numeric',
// //     });
// //   };

// //   // Format time ago
// //   const formatTimeAgo = (date: Date) => {
// //     const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
// //     if (seconds < 60) return `${seconds} seconds ago`;
// //     const minutes = Math.floor(seconds / 60);
// //     if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
// //     const hours = Math.floor(minutes / 60);
// //     if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
// //     const days = Math.floor(hours / 24);
// //     return `${days} day${days === 1 ? '' : 's'} ago`;
// //   };

// //   // Loading state
// //   if (loading && !data) {
// //     return <FacilityLimitDashboardSkeleton />;
// //   }

// //   // Error state
// //   if (error && !data) {
// //     return (
// //       <Alert variant="destructive" className="mb-4">
// //         <AlertCircle className="h-4 w-4" />
// //         <AlertTitle>Error Loading Dashboard</AlertTitle>
// //         <AlertDescription className="space-y-2">
// //           <p>{error}</p>
// //           <Button variant="outline" size="sm" onClick={fetchFacilityLimits}>
// //             <RefreshCw className="h-4 w-4 mr-2" />
// //             Retry
// //           </Button>
// //         </AlertDescription>
// //       </Alert>
// //     );
// //   }

// //   if (!data) {
// //     return (
// //       <Alert>
// //         <AlertCircle className="h-4 w-4" />
// //         <AlertTitle>No Data Available</AlertTitle>
// //         <AlertDescription>
// //           Unable to load facility data. Please check your configuration and try again.
// //         </AlertDescription>
// //       </Alert>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       {/* Header with Refresh */}
// //       <div className="flex justify-between items-center">
// //         <div>
// //           <h2 className="text-3xl font-bold tracking-tight">Facility Usage Dashboard</h2>
// //           <p className="text-muted-foreground mt-1">
// //             Monitor resource utilization against your subscription limits
// //           </p>
// //         </div>
// //         <div className="flex items-center gap-3">
// //           {lastRefreshed && (
// //             <span className="text-xs text-muted-foreground">
// //               Last updated: {formatTimeAgo(lastRefreshed)}
// //             </span>
// //           )}
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={fetchFacilityLimits}
// //             disabled={loading}
// //           >
// //             {loading ? (
// //               <Loader2 className="h-4 w-4 animate-spin mr-2" />
// //             ) : (
// //               <RefreshCw className="h-4 w-4 mr-2" />
// //             )}
// //             Refresh
// //           </Button>
// //         </div>
// //       </div>

// //       {/* Facility Information Card */}
// //       <Card>
// //         <CardHeader>
// //           <div className="flex justify-between items-start">
// //             <div>
// //               <CardTitle className="text-2xl flex items-center gap-2">
// //                 <Hospital className="h-6 w-6" />
// //                 {data.facility.name}
// //               </CardTitle>
// //               <CardDescription>
// //                 Facility ID: {data.facility.id} | Admin ID: {data.facility.adminUserId}
// //               </CardDescription>
// //             </div>
// //             <div className="text-right">
// //               <Badge variant="outline" className="text-lg px-4 py-1">
// //                 {data.subscriptionDetails.tierName} Plan
// //               </Badge>
// //               <p className="text-sm text-muted-foreground mt-1">
// //                 {data.subscriptionDetails.daysRemaining} days remaining
// //               </p>
// //             </div>
// //           </div>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //             <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
// //               <CreditCard className="h-5 w-5 text-muted-foreground" />
// //               <div>
// //                 <p className="text-sm font-medium">Monthly Price</p>
// //                 <p className="text-xl font-bold">{formatCurrency(data.subscriptionDetails.monthlyPrice)}</p>
// //               </div>
// //             </div>
// //             <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
// //               <Calendar className="h-5 w-5 text-muted-foreground" />
// //               <div>
// //                 <p className="text-sm font-medium">Subscription Period</p>
// //                 <p className="text-sm">
// //                   {formatDate(data.subscriptionDetails.startDate)} - {formatDate(data.subscriptionDetails.endDate)}
// //                 </p>
// //               </div>
// //             </div>
// //             <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
// //               <BarChart3 className="h-5 w-5 text-muted-foreground" />
// //               <div>
// //                 <p className="text-sm font-medium">Billing Feature</p>
// //                 <Badge variant={data.billingFeatureEnabled ? 'default' : 'secondary'}>
// //                   {data.billingFeatureEnabled ? 'Enabled' : 'Disabled'}
// //                 </Badge>
// //               </div>
// //             </div>
// //             <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
// //               <Activity className="h-5 w-5 text-muted-foreground" />
// //               <div>
// //                 <p className="text-sm font-medium">Subscription Status</p>
// //                 <Badge variant={data.hasActiveSubscription && !data.isExpired ? 'default' : 'destructive'}>
// //                   {!data.hasActiveSubscription
// //                     ? 'No Subscription'
// //                     : data.isExpired
// //                     ? 'Expired'
// //                     : 'Active'}
// //                 </Badge>
// //               </div>
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Warnings and Alerts */}
// //       {(data.warnings.length > 0 || !data.hasActiveSubscription || data.isExpired) && (
// //         <Alert variant={data.warnings.length > 0 || data.isExpired || !data.hasActiveSubscription ? 'destructive' : 'default'}>
// //           {data.warnings.length > 0 ? (
// //             <>
// //               <AlertTriangle className="h-4 w-4" />
// //               <AlertTitle>Limit Warnings</AlertTitle>
// //               <AlertDescription>
// //                 <ul className="list-disc list-inside mt-2 space-y-1">
// //                   {data.warnings.map((warning, idx) => (
// //                     <li key={idx}>{warning}</li>
// //                   ))}
// //                 </ul>
// //                 {data.recommendations.length > 0 && (
// //                   <div className="mt-3 pt-2 border-t">
// //                     <p className="font-semibold flex items-center gap-2">
// //                       <TrendingUp className="h-4 w-4" />
// //                       Recommendations:
// //                     </p>
// //                     <ul className="list-disc list-inside mt-1">
// //                       {data.recommendations.map((rec, idx) => (
// //                         <li key={idx}>{rec}</li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 )}
// //               </AlertDescription>
// //             </>
// //           ) : !data.hasActiveSubscription ? (
// //             <>
// //               <AlertCircle className="h-4 w-4" />
// //               <AlertTitle>No Active Subscription</AlertTitle>
// //               <AlertDescription>
// //                 {data.message || 'Please contact facility administrator to subscribe.'}
// //               </AlertDescription>
// //             </>
// //           ) : data.isExpired ? (
// //             <>
// //               <AlertCircle className="h-4 w-4" />
// //               <AlertTitle>Subscription Expired</AlertTitle>
// //               <AlertDescription>
// //                 {data.message || 'Your subscription has expired. Please renew to continue using all features.'}
// //               </AlertDescription>
// //             </>
// //           ) : (
// //             <>
// //               <CheckCircle2 className="h-4 w-4 text-green-500" />
// //               <AlertTitle>All Systems Operational</AlertTitle>
// //               <AlertDescription>
// //                 Your facility is within all subscription limits. Great job!
// //               </AlertDescription>
// //             </>
// //           )}
// //         </Alert>
// //       )}

// //       {/* Main Tabs */}
// //       <Tabs value={activeTab} onValueChange={setActiveTab}>
// //         <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
// //           <TabsTrigger value="overview" className="flex items-center gap-2">
// //             <Activity className="h-4 w-4" />
// //             Overview
// //           </TabsTrigger>
// //           <TabsTrigger value="staff-depts" className="flex items-center gap-2">
// //             <Users className="h-4 w-4" />
// //             Staff & Depts
// //           </TabsTrigger>
// //           <TabsTrigger value="beds" className="flex items-center gap-2">
// //             <Bed className="h-4 w-4" />
// //             Bed Management
// //           </TabsTrigger>
// //           <TabsTrigger value="consultations" className="flex items-center gap-2">
// //             <Stethoscope className="h-4 w-4" />
// //             Consultations
// //           </TabsTrigger>
// //         </TabsList>

// //         {/* Overview Tab */}
// //         <TabsContent value="overview" className="space-y-6 mt-6">
// //           {/* Key Metrics Grid */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {/* Staff Card */}
// //             <Card>
// //               <CardHeader className="pb-2">
// //                 <div className="flex justify-between items-start">
// //                   <CardTitle className="flex items-center gap-2 text-lg">
// //                     <Users className="h-5 w-5" />
// //                     Staff Members
// //                   </CardTitle>
// //                   {getStatusBadge(data.limits.staff.allowed, data.limits.staff.exceeded, data.limits.staff.limitType)}
// //                 </div>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-3">
// //                   <div className="flex justify-between items-baseline">
// //                     <span className="text-3xl font-bold">{data.limits.staff.current}</span>
// //                     <span className="text-muted-foreground">
// //                       / {data.limits.staff.limitType === 'unlimited' ? '8' : data.limits.staff.max}
// //                     </span>
// //                   </div>
// //                   <Progress
// //                     value={data.limits.staff.percentageUsed}
// //                     className={getStatusColor(data.limits.staff.percentageUsed, data.limits.staff.exceeded)}
// //                   />
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-muted-foreground">
// //                       {data.limits.staff.remaining} remaining
// //                     </span>
// //                     <span className="font-medium">{data.limits.staff.percentageUsed}% used</span>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Departments Card */}
// //             <Card>
// //               <CardHeader className="pb-2">
// //                 <div className="flex justify-between items-start">
// //                   <CardTitle className="flex items-center gap-2 text-lg">
// //                     <Building2 className="h-5 w-5" />
// //                     Departments
// //                   </CardTitle>
// //                   {getStatusBadge(data.limits.departments.allowed, data.limits.departments.exceeded, data.limits.departments.limitType)}
// //                 </div>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-3">
// //                   <div className="flex justify-between items-baseline">
// //                     <span className="text-3xl font-bold">{data.limits.departments.current}</span>
// //                     <span className="text-muted-foreground">
// //                       / {data.limits.departments.limitType === 'unlimited' ? '8' : data.limits.departments.max}
// //                     </span>
// //                   </div>
// //                   <Progress
// //                     value={data.limits.departments.percentageUsed}
// //                     className={getStatusColor(data.limits.departments.percentageUsed, data.limits.departments.exceeded)}
// //                   />
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-muted-foreground">
// //                       {data.limits.departments.remaining} remaining
// //                     </span>
// //                     <span className="font-medium">{data.limits.departments.percentageUsed}% used</span>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Beds Overview Card */}
// //             <Card>
// //               <CardHeader className="pb-2">
// //                 <div className="flex justify-between items-start">
// //                   <CardTitle className="flex items-center gap-2 text-lg">
// //                     <Bed className="h-5 w-5" />
// //                     Total Beds
// //                   </CardTitle>
// //                   {getStatusBadge(data.limits.beds.allowed, data.limits.beds.exceeded, data.limits.beds.limitType)}
// //                 </div>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-3">
// //                   <div className="flex justify-between items-baseline">
// //                     <span className="text-3xl font-bold">{data.limits.beds.current}</span>
// //                     <span className="text-muted-foreground">
// //                       / {data.limits.beds.limitType === 'unlimited' ? '8' : data.limits.beds.max}
// //                     </span>
// //                   </div>
// //                   <Progress
// //                     value={data.limits.beds.percentageUsed}
// //                     className={getStatusColor(data.limits.beds.percentageUsed, data.limits.beds.exceeded)}
// //                   />
// //                   <div className="grid grid-cols-3 gap-2 text-center text-sm pt-2">
// //                     <div>
// //                       <p className="text-muted-foreground">Available</p>
// //                       <p className="font-bold text-green-600">{data.limits.beds.utilizationMetrics.availableBeds}</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-muted-foreground">Occupied</p>
// //                       <p className="font-bold text-blue-600">{data.limits.beds.utilizationMetrics.occupiedBeds}</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-muted-foreground">Utilization</p>
// //                       <p className="font-bold">{data.limits.beds.utilizationMetrics.utilizationRate}%</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Clinical Consults Card */}
// //             <Card>
// //               <CardHeader className="pb-2">
// //                 <div className="flex justify-between items-start">
// //                   <CardTitle className="flex items-center gap-2 text-lg">
// //                     <Pill className="h-5 w-5" />
// //                     Clinical Consults
// //                   </CardTitle>
// //                   {getStatusBadge(data.limits.clinical.allowed, data.limits.clinical.exceeded, data.limits.clinical.limitType)}
// //                 </div>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-3">
// //                   <div className="flex justify-between items-baseline">
// //                     <span className="text-3xl font-bold">{data.limits.clinical.used}</span>
// //                     <span className="text-muted-foreground">
// //                       / {data.limits.clinical.limitType === 'unlimited' ? '8' : data.limits.clinical.max}
// //                     </span>
// //                   </div>
// //                   <Progress
// //                     value={data.limits.clinical.percentageUsed}
// //                     className={getStatusColor(data.limits.clinical.percentageUsed, data.limits.clinical.exceeded)}
// //                   />
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-muted-foreground">
// //                       {data.limits.clinical.remaining} remaining
// //                     </span>
// //                     <span className="font-medium">{data.limits.clinical.percentageUsed}% used</span>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Tele Consults Card */}
// //             <Card>
// //               <CardHeader className="pb-2">
// //                 <div className="flex justify-between items-start">
// //                   <CardTitle className="flex items-center gap-2 text-lg">
// //                     <Phone className="h-5 w-5" />
// //                     Tele Consults
// //                   </CardTitle>
// //                   {getStatusBadge(data.limits.tele.allowed, data.limits.tele.exceeded, data.limits.tele.limitType)}
// //                 </div>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-3">
// //                   <div className="flex justify-between items-baseline">
// //                     <span className="text-3xl font-bold">{data.limits.tele.used}</span>
// //                     <span className="text-muted-foreground">
// //                       / {data.limits.tele.limitType === 'unlimited' ? '8' : data.limits.tele.max}
// //                     </span>
// //                   </div>
// //                   <Progress
// //                     value={data.limits.tele.percentageUsed}
// //                     className={getStatusColor(data.limits.tele.percentageUsed, data.limits.tele.exceeded)}
// //                   />
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-muted-foreground">
// //                       {data.limits.tele.remaining} remaining
// //                     </span>
// //                     <span className="font-medium">{data.limits.tele.percentageUsed}% used</span>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Appointments Card */}
// //             <Card>
// //               <CardHeader className="pb-2">
// //                 <CardTitle className="flex items-center gap-2 text-lg">
// //                   <Calendar className="h-5 w-5" />
// //                   Appointments (This Month)
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="text-3xl font-bold mb-3">
// //                   {data.subscriptionDetails.totalAppointmentsThisMonth}
// //                 </div>
// //                 <div className="space-y-1 max-h-32 overflow-y-auto">
// //                   {Object.entries(data.subscriptionDetails.appointmentStatusBreakdown).map(([status, count]) => (
// //                     <div key={status} className="flex justify-between text-sm">
// //                       <span className="capitalize text-muted-foreground">{status.toLowerCase()}</span>
// //                       <Badge variant="outline">{count}</Badge>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </TabsContent>

// //         {/* Staff & Departments Tab */}
// //         <TabsContent value="staff-depts" className="space-y-6 mt-6">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             {/* Detailed Staff Card */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="flex items-center gap-2">
// //                   <UserCheck className="h-5 w-5" />
// //                   Staff Details
// //                 </CardTitle>
// //                 <CardDescription>Current staff allocation against plan limits</CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div>
// //                   <div className="flex justify-between mb-2">
// //                     <span className="font-medium">Usage</span>
// //                     <span className={data.limits.staff.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
// //                       {data.limits.staff.current} / {data.limits.staff.max}
// //                     </span>
// //                   </div>
// //                   <Progress 
// //                     value={data.limits.staff.percentageUsed} 
// //                     className={getStatusColor(data.limits.staff.percentageUsed, data.limits.staff.exceeded)}
// //                   />
// //                   <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
// //                     <div className="grid grid-cols-2 gap-2 text-sm">
// //                       <div>
// //                         <p className="text-muted-foreground">Remaining Slots</p>
// //                         <p className="text-xl font-bold">{data.limits.staff.remaining}</p>
// //                       </div>
// //                       <div>
// //                         <p className="text-muted-foreground">Limit Type</p>
// //                         <Badge variant="outline">{data.limits.staff.limitType}</Badge>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Detailed Departments Card */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="flex items-center gap-2">
// //                   <Building2 className="h-5 w-5" />
// //                   Departments Details
// //                 </CardTitle>
// //                 <CardDescription>Current department allocation against plan limits</CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div>
// //                   <div className="flex justify-between mb-2">
// //                     <span className="font-medium">Usage</span>
// //                     <span className={data.limits.departments.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
// //                       {data.limits.departments.current} / {data.limits.departments.max}
// //                     </span>
// //                   </div>
// //                   <Progress 
// //                     value={data.limits.departments.percentageUsed} 
// //                     className={getStatusColor(data.limits.departments.percentageUsed, data.limits.departments.exceeded)}
// //                   />
// //                   <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
// //                     <div className="grid grid-cols-2 gap-2 text-sm">
// //                       <div>
// //                         <p className="text-muted-foreground">Remaining Departments</p>
// //                         <p className="text-xl font-bold">{data.limits.departments.remaining}</p>
// //                       </div>
// //                       <div>
// //                         <p className="text-muted-foreground">Limit Type</p>
// //                         <Badge variant="outline">{data.limits.departments.limitType}</Badge>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </TabsContent>

// //         {/* Bed Management Tab */}
// //         <TabsContent value="beds" className="space-y-6 mt-6">
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //             {/* Bed Inventory Card */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="flex items-center gap-2">
// //                   <Bed className="h-5 w-5" />
// //                   Bed Inventory & Utilization
// //                 </CardTitle>
// //                 <CardDescription>Current bed usage and availability status</CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div>
// //                   <div className="flex justify-between mb-2">
// //                     <span className="font-medium">Total Beds Usage</span>
// //                     <span className={data.limits.beds.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
// //                       {data.limits.beds.current} / {data.limits.beds.max}
// //                     </span>
// //                   </div>
// //                   <Progress 
// //                     value={data.limits.beds.percentageUsed} 
// //                     className={getStatusColor(data.limits.beds.percentageUsed, data.limits.beds.exceeded)}
// //                   />
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-3 pt-2">
// //                   <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
// //                     <p className="text-2xl font-bold text-green-600">
// //                       {data.limits.beds.utilizationMetrics.availableBeds}
// //                     </p>
// //                     <p className="text-xs text-muted-foreground mt-1">Available Beds</p>
// //                   </div>
// //                   <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
// //                     <p className="text-2xl font-bold text-blue-600">
// //                       {data.limits.beds.utilizationMetrics.occupiedBeds}
// //                     </p>
// //                     <p className="text-xs text-muted-foreground mt-1">Occupied Beds</p>
// //                   </div>
// //                   <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
// //                     <p className="text-2xl font-bold text-yellow-600">
// //                       {data.limits.beds.utilizationMetrics.reservedBeds}
// //                     </p>
// //                     <p className="text-xs text-muted-foreground mt-1">Reserved Beds</p>
// //                   </div>
// //                   <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
// //                     <p className="text-2xl font-bold text-purple-600">
// //                       {data.limits.beds.utilizationMetrics.upcomingBookings}
// //                     </p>
// //                     <p className="text-xs text-muted-foreground mt-1">Upcoming (7 days)</p>
// //                   </div>
// //                 </div>

// //                 <div className="pt-2">
// //                   <div className="flex justify-between text-sm mb-1">
// //                     <span>Bed Utilization Rate</span>
// //                     <span className="font-bold">{data.limits.beds.utilizationMetrics.utilizationRate}%</span>
// //                   </div>
// //                   <Progress value={data.limits.beds.utilizationMetrics.utilizationRate} />
// //                   <p className="text-xs text-muted-foreground mt-2">
// //                     {data.limits.beds.utilizationMetrics.utilizationRate > 85 
// //                       ? '?? High utilization - consider adding more beds' 
// //                       : data.limits.beds.utilizationMetrics.utilizationRate > 70
// //                       ? '?? Moderate utilization'
// //                       : '? Good utilization rate'}
// //                   </p>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Bed Bookings Status Card */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="flex items-center gap-2">
// //                   <Calendar className="h-5 w-5" />
// //                   Bed Bookings Status
// //                 </CardTitle>
// //                 <CardDescription>Active and upcoming bed bookings</CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
// //                   <div>
// //                     <p className="text-sm text-muted-foreground">Active Bookings</p>
// //                     <p className="text-3xl font-bold">{data.limits.bedBookings.activeBookings}</p>
// //                   </div>
// //                   <div className="text-right">
// //                     <p className="text-sm text-muted-foreground">Against Limit</p>
// //                     <p className="text-lg font-medium">
// //                       {data.limits.bedBookings.current} / {data.limits.bedBookings.max}
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="space-y-2">
// //                   <p className="font-medium text-sm">Breakdown by Status</p>
// //                   {Object.entries(data.limits.bedBookings.breakdown).map(([status, count]) => (
// //                     <div key={status} className="flex justify-between items-center p-2 hover:bg-secondary/50 rounded">
// //                       <span className="capitalize text-sm">
// //                         {status.toLowerCase().replace('_', ' ')}
// //                       </span>
// //                       <Badge variant={status === 'ADMITTED' ? 'default' : 'outline'}>
// //                         {count}
// //                       </Badge>
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {data.limits.bedBookings.exceeded && (
// //                   <Alert variant="destructive" className="mt-2">
// //                     <AlertTriangle className="h-4 w-4" />
// //                     <AlertTitle>Bed Bookings Limit Exceeded</AlertTitle>
// //                     <AlertDescription>
// //                       You have {data.limits.bedBookings.current} active bookings but your plan only allows {data.limits.bedBookings.max}.
// //                       Consider upgrading your plan or discharging patients.
// //                     </AlertDescription>
// //                   </Alert>
// //                 )}
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </TabsContent>

// //         {/* Consultations Tab */}
// //         <TabsContent value="consultations" className="space-y-6 mt-6">
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //             {/* Clinical Consultations Detailed Card */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="flex items-center gap-2">
// //                   <Pill className="h-5 w-5" />
// //                   Clinical Consultations
// //                 </CardTitle>
// //                 <CardDescription>Track your clinical consultation usage</CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div>
// //                   <div className="flex justify-between mb-2">
// //                     <span className="font-medium">Usage</span>
// //                     <span className={data.limits.clinical.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
// //                       {data.limits.clinical.used} / {data.limits.clinical.max}
// //                     </span>
// //                   </div>
// //                   <Progress 
// //                     value={data.limits.clinical.percentageUsed} 
// //                     className={getStatusColor(data.limits.clinical.percentageUsed, data.limits.clinical.exceeded)}
// //                   />
// //                 </div>
// //                 <div className="grid grid-cols-2 gap-3">
// //                   <div className="p-3 bg-secondary/50 rounded-lg">
// //                     <p className="text-sm text-muted-foreground">Remaining</p>
// //                     <p className="text-2xl font-bold">{data.limits.clinical.remaining}</p>
// //                   </div>
// //                   <div className="p-3 bg-secondary/50 rounded-lg">
// //                     <p className="text-sm text-muted-foreground">Percentage Used</p>
// //                     <p className="text-2xl font-bold">{data.limits.clinical.percentageUsed}%</p>
// //                   </div>
// //                 </div>
// //                 {data.limits.clinical.percentageUsed >= 80 && !data.limits.clinical.exceeded && (
// //                   <Alert>
// //                     <AlertTriangle className="h-4 w-4" />
// //                     <AlertTitle>Approaching Limit</AlertTitle>
// //                     <AlertDescription>
// //                       You've used {data.limits.clinical.percentageUsed}% of your clinical consultation limit.
// //                       Consider upgrading your plan to avoid interruptions.
// //                     </AlertDescription>
// //                   </Alert>
// //                 )}
// //               </CardContent>
// //             </Card>

// //             {/* Tele Consultations Detailed Card */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="flex items-center gap-2">
// //                   <Phone className="h-5 w-5" />
// //                   Tele Consultations
// //                 </CardTitle>
// //                 <CardDescription>Track your tele-consultation usage</CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div>
// //                   <div className="flex justify-between mb-2">
// //                     <span className="font-medium">Usage</span>
// //                     <span className={data.limits.tele.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
// //                       {data.limits.tele.used} / {data.limits.tele.max}
// //                     </span>
// //                   </div>
// //                   <Progress 
// //                     value={data.limits.tele.percentageUsed} 
// //                     className={getStatusColor(data.limits.tele.percentageUsed, data.limits.tele.exceeded)}
// //                   />
// //                 </div>
// //                 <div className="grid grid-cols-2 gap-3">
// //                   <div className="p-3 bg-secondary/50 rounded-lg">
// //                     <p className="text-sm text-muted-foreground">Remaining</p>
// //                     <p className="text-2xl font-bold">{data.limits.tele.remaining}</p>
// //                   </div>
// //                   <div className="p-3 bg-secondary/50 rounded-lg">
// //                     <p className="text-sm text-muted-foreground">Percentage Used</p>
// //                     <p className="text-2xl font-bold">{data.limits.tele.percentageUsed}%</p>
// //                   </div>
// //                 </div>
// //                 {data.limits.tele.percentageUsed >= 80 && !data.limits.tele.exceeded && (
// //                   <Alert>
// //                     <AlertTriangle className="h-4 w-4" />
// //                     <AlertTitle>Approaching Limit</AlertTitle>
// //                     <AlertDescription>
// //                       You've used {data.limits.tele.percentageUsed}% of your tele-consultation limit.
// //                       Consider upgrading your plan to avoid interruptions.
// //                     </AlertDescription>
// //                   </Alert>
// //                 )}
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* Analytics Feature Alert */}
// //           {data.subscriptionDetails.includesAnalytics && (
// //             <Alert>
// //               <TrendingUp className="h-4 w-4" />
// //               <AlertTitle>Analytics Available</AlertTitle>
// //               <AlertDescription>
// //                 Your plan includes advanced analytics. Visit the Analytics Dashboard for detailed insights 
// //                 on consultation trends, patient outcomes, and operational efficiency.
// //               </AlertDescription>
// //             </Alert>
// //           )}
// //         </TabsContent>
// //       </Tabs>

// //       {/* Footer with last updated info */}
// //       <div className="text-center text-xs text-muted-foreground pt-4">
// //         Data refreshes automatically every {refreshInterval / 1000} seconds
// //         {lastRefreshed && ` • Last updated: ${lastRefreshed.toLocaleTimeString()}`}
// //       </div>
// //     </div>
// //   );
// // }

// // // Loading Skeleton Component
// // function FacilityLimitDashboardSkeleton() {
// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <div>
// //           <Skeleton className="h-8 w-64 mb-2" />
// //           <Skeleton className="h-4 w-96" />
// //         </div>
// //         <Skeleton className="h-10 w-24" />
// //       </div>
      
// //       <Skeleton className="h-32 w-full" />
// //       <Skeleton className="h-12 w-full" />
      
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //         <Skeleton className="h-48" />
// //         <Skeleton className="h-48" />
// //         <Skeleton className="h-48" />
// //       </div>
// //     </div>
// //   );
// // }

// // components/dashboard/FacilityLimitDashboard.tsx

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Users,
//   Building2,
//   Bed,
//   Calendar,
//   Phone,
//   Activity,
//   AlertCircle,
//   CheckCircle2,
//   TrendingUp,
//   AlertTriangle,
//   Clock,
//   BarChart3,
//   CreditCard,
//   Pill,
//   RefreshCw,
//   Hospital,
//   UserCheck,
//   Stethoscope,
//   Loader2,
//   BookOpen,
//   UserRound,
//   HeartPulse,
//   Syringe,
//   Video,
//   Ambulance,
// } from 'lucide-react';
// import { Progress } from '@/components/ui/progress';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useToast } from '@/hooks/use-toast';
// import { supabase } from '@/integrations/supabase/client';

// // Type definitions based on your Edge Function response
// interface LimitData {
//   current: number;
//   max: number;
//   allowed: boolean;
//   remaining: number;
//   exceeded: boolean;
//   limitType: 'unlimited' | 'limited';
//   percentageUsed: number;
// }

// interface BedUtilizationMetrics {
//   totalBeds: number;
//   occupiedBeds: number;
//   reservedBeds: number;
//   availableBeds: number;
//   utilizationRate: number;
//   upcomingBookings: number;
// }

// interface BedBookingsBreakdown {
//   RESERVED?: number;
//   ADMITTED?: number;
//   OCCUPIED?: number;
//   TRANSFERRED?: number;
//   DISCHARGED?: number;
//   CANCELLED?: number;
// }

// interface FacilityLimits {
//   staff: LimitData;
//   departments: LimitData;
//   beds: LimitData & { 
//     utilizationMetrics: BedUtilizationMetrics;
//     occupiedBeds?: number;
//     reservedBeds?: number;
//     availableBeds?: number;
//   };
//   bedBookings: LimitData & {
//     breakdown: BedBookingsBreakdown;
//     activeBookings: number;
//   };
//   clinical: LimitData;
//   tele: LimitData;
// }

// interface SubscriptionDetails {
//   subscriptionId: string;
//   tierId: string;
//   tierName: string;
//   startDate: string;
//   endDate: string;
//   daysRemaining: number;
//   includesBilling: boolean;
//   includesAnalytics: boolean;
//   monthlyPrice: number;
//   totalAppointmentsThisMonth: number;
//   appointmentStatusBreakdown: Record<string, number>;
//   appointmentTypeBreakdown?: Record<string, number>;
//   clinicalConsultations?: number;
//   teleConsultations?: number;
//   inPersonAppointments?: number;
//   teleconsultationAppointments?: number;
// }

// interface FacilityInfo {
//   id: string;
//   name: string;
//   adminUserId: string;
//   currentStaff: number;
//   currentDepartments: number;
//   currentBeds: number;
//   currentBedBookings: number;
//   isVerified: boolean;
// }

// interface AppointmentMetrics {
//   totalThisMonth: number;
//   clinical: number;
//   tele: number;
//   statusBreakdown: Record<string, number>;
//   typeBreakdown: Record<string, number>;
// }

// interface EdgeFunctionResponse {
//   allowed: boolean;
//   hasActiveSubscription: boolean;
//   isExpired: boolean;
//   message: string;
//   checkType: string;
//   requesterType: 'admin' | 'staff' | 'direct';
//   billingFeatureEnabled: boolean;
//   facility: FacilityInfo;
//   limits: FacilityLimits;
//   subscriptionDetails: SubscriptionDetails;
//   appointmentMetrics: AppointmentMetrics;
//   warnings: string[];
//   recommendations: string[];
// }

// interface FacilityLimitDashboardProps {
//   facility_admin_id?: string;
//   staff_user_id?: string;
//   staff_id?: string;
//   facility_id?: string;
//   autoRefresh?: boolean;
//   refreshInterval?: number;
//   onLimitExceeded?: (exceededLimits: string[]) => void;
// }

// export function FacilityLimitDashboard({
//   facility_admin_id,
//   staff_user_id,
//   staff_id,
//   facility_id,
//   autoRefresh = true,
//   refreshInterval = 30000,
//   onLimitExceeded,
// }: FacilityLimitDashboardProps) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [data, setData] = useState<EdgeFunctionResponse | null>(null);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
//   const { toast } = useToast();

//   // Function to fetch data from Edge Function
//   const fetchFacilityLimits = useCallback(async () => {
//     if (!facility_admin_id && !staff_user_id && !staff_id && !facility_id) {
//       setError('Please provide facility_admin_id, staff_user_id, staff_id, or facility_id');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       console.log('Fetching facility limits with:', {
//         facility_admin_id,
//         staff_user_id,
//         staff_id,
//         facility_id,
//       });

//       // Call the Supabase Edge Function
//       const { data: responseData, error: functionError } = await supabase.functions.invoke(
//         'check-facility-limit',
//         {
//           body: {
//             facility_admin_id,
//             staff_user_id,
//             staff_id,
//             facility_id,
//             check_type: 'all',
//           },
//         }
//       );

//       if (functionError) {
//         throw new Error(`Edge Function error: ${functionError.message}`);
//       }

//       if (!responseData) {
//         throw new Error('No data received from edge function');
//       }

//       setData(responseData);
//       setLastRefreshed(new Date());

//       // Check if any limits are exceeded
//       if (responseData.limits) {
//         const exceededLimits = [];
//         if (responseData.limits.staff?.exceeded) exceededLimits.push('Staff');
//         if (responseData.limits.departments?.exceeded) exceededLimits.push('Departments');
//         if (responseData.limits.beds?.exceeded) exceededLimits.push('Beds');
//         if (responseData.limits.bedBookings?.exceeded) exceededLimits.push('Bed Bookings');
//         if (responseData.limits.clinical?.exceeded) exceededLimits.push('Clinical Consultations');
//         if (responseData.limits.tele?.exceeded) exceededLimits.push('Tele Consultations');

//         if (exceededLimits.length > 0 && onLimitExceeded) {
//           onLimitExceeded(exceededLimits);
//         }

//         // Show warning toast for exceeded limits
//         if (exceededLimits.length > 0 && responseData.hasActiveSubscription) {
//           toast({
//             title: '?? Limits Exceeded',
//             description: `${exceededLimits.join(', ')} ${exceededLimits.length === 1 ? 'has' : 'have'} exceeded subscription limits.`,
//             variant: 'destructive',
//           });
//         }
//       }

//       // Show subscription expired warning
//       if (responseData.isExpired) {
//         toast({
//           title: 'Subscription Expired',
//           description: 'Your facility subscription has expired. Please renew to continue using all features.',
//           variant: 'destructive',
//           duration: 10000,
//         });
//       }

//       // Show no subscription warning
//       if (!responseData.hasActiveSubscription) {
//         toast({
//           title: 'No Active Subscription',
//           description: 'Please contact your facility administrator to activate a subscription.',
//           variant: 'destructive',
//           duration: 10000,
//         });
//       }
//     } catch (err) {
//       console.error('Error fetching facility limits:', err);
//       const errorMessage = err instanceof Error ? err.message : 'Failed to fetch facility limits';
//       setError(errorMessage);
//       toast({
//         title: 'Error',
//         description: errorMessage,
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [facility_admin_id, staff_user_id, staff_id, facility_id, toast, onLimitExceeded]);

//   // Auto-refresh functionality
//   useEffect(() => {
//     fetchFacilityLimits();

//     let intervalId: NodeJS.Timeout;
//     if (autoRefresh && refreshInterval > 0 && data?.hasActiveSubscription) {
//       intervalId = setInterval(fetchFacilityLimits, refreshInterval);
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [fetchFacilityLimits, autoRefresh, refreshInterval, data?.hasActiveSubscription]);

//   // Helper function to get status color for progress bar
//   const getStatusColor = (percentage: number, exceeded: boolean) => {
//     if (exceeded) return 'bg-gradient-to-r from-red-500 to-red-600';
//     if (percentage >= 90) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
//     if (percentage >= 70) return 'bg-gradient-to-r from-orange-500 to-orange-400';
//     if (percentage >= 50) return 'bg-gradient-to-r from-blue-500 to-blue-400';
//     return 'bg-gradient-to-r from-green-500 to-emerald-500';
//   };

//   // Helper function to get status badge
//   const getStatusBadge = (allowed: boolean, exceeded: boolean, limitType: string) => {
//     if (limitType === 'unlimited') {
//       return (
//         <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
//           <CheckCircle2 className="w-3 h-3 mr-1" />
//           Unlimited
//         </Badge>
//       );
//     }
//     if (!allowed && exceeded) {
//       return (
//         <Badge variant="destructive" className="animate-pulse bg-gradient-to-r from-red-600 to-red-700">
//           <AlertCircle className="w-3 h-3 mr-1" />
//           Exceeded
//         </Badge>
//       );
//     }
//     if (!allowed) {
//       return (
//         <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-red-600">
//           <AlertCircle className="w-3 h-3 mr-1" />
//           Limit Reached
//         </Badge>
//       );
//     }
//     return (
//       <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
//         <CheckCircle2 className="w-3 h-3 mr-1" />
//         Within Limit
//       </Badge>
//     );
//   };

//   // Get status icon for bed bookings
//   const getStatusIcon = (status: string) => {
//     switch(status) {
//       case 'RESERVED': return <Clock className="h-3 w-3 text-yellow-600" />;
//       case 'ADMITTED': return <UserRound className="h-3 w-3 text-green-600" />;
//       case 'OCCUPIED': return <HeartPulse className="h-3 w-3 text-red-600" />;
//       case 'DISCHARGED': return <CheckCircle2 className="h-3 w-3 text-blue-600" />;
//       case 'CANCELLED': return <AlertCircle className="h-3 w-3 text-gray-600" />;
//       default: return <Activity className="h-3 w-3" />;
//     }
//   };

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(amount);
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   // Format time ago
//   const formatTimeAgo = (date: Date) => {
//     const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
//     if (seconds < 60) return `${seconds} seconds ago`;
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
//     const days = Math.floor(hours / 24);
//     return `${days} day${days === 1 ? '' : 's'} ago`;
//   };

//   // Loading state
//   if (loading && !data) {
//     return <FacilityLimitDashboardSkeleton />;
//   }

//   // Error state
//   if (error && !data) {
//     return (
//       <Alert variant="destructive" className="mb-4 border-l-4 border-l-red-500">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Error Loading Dashboard</AlertTitle>
//         <AlertDescription className="space-y-2">
//           <p>{error}</p>
//           <Button variant="outline" size="sm" onClick={fetchFacilityLimits}>
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Retry
//           </Button>
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   if (!data) {
//     return (
//       <Alert className="border-l-4 border-l-yellow-500">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>No Data Available</AlertTitle>
//         <AlertDescription>
//           Unable to load facility data. Please check your configuration and try again.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with Refresh */}
//       <div className="flex justify-between items-center flex-wrap gap-4">
//         <div>
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
//             {/* Facility Usage Dashboard */}
//             Subscription dashboard
//           </h2>
//           <p className="text-muted-foreground mt-1">
//             Monitor resource utilization against your subscription limits
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           {lastRefreshed && (
//             <span className="text-xs text-muted-foreground">
//               Last updated: {formatTimeAgo(lastRefreshed)}
//             </span>
//           )}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={fetchFacilityLimits}
//             disabled={loading}
//             className="border-gray-300 hover:bg-gray-100"
//           >
//             {loading ? (
//               <Loader2 className="h-4 w-4 animate-spin mr-2" />
//             ) : (
//               <RefreshCw className="h-4 w-4 mr-2" />
//             )}
//             Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Facility Information Card */}
//       <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
//         <CardHeader>
//           <div className="flex justify-between items-start flex-wrap gap-4">
//             <div>
//               <CardTitle className="text-2xl flex items-center gap-2">
//                 <Hospital className="h-6 w-6 text-blue-600" />
//                 {data.facility.name}
//               </CardTitle>
//               <CardDescription>
//                 Facility ID: {data.facility.id.substring(0, 8)}... | Admin ID: {data.facility.adminUserId.substring(0, 8)}...
//               </CardDescription>
//             </div>
//             <div className="text-right">
//               <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
//                 {data.subscriptionDetails.tierName} Plan
//               </Badge>
//               <p className="text-sm text-muted-foreground mt-1">
//                 {data.subscriptionDetails.daysRemaining} days remaining
//               </p>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm">
//               <CreditCard className="h-5 w-5 text-emerald-600" />
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Monthly Price</p>
//                 <p className="text-xl font-bold">{formatCurrency(data.subscriptionDetails.monthlyPrice)}</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm">
//               <Calendar className="h-5 w-5 text-blue-600" />
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Subscription Period</p>
//                 <p className="text-sm">
//                   {formatDate(data.subscriptionDetails.startDate)} - {formatDate(data.subscriptionDetails.endDate)}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm">
//               <BarChart3 className="h-5 w-5 text-purple-600" />
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Billing Feature</p>
//                 <Badge className={data.billingFeatureEnabled ? 'bg-green-500' : 'bg-gray-500'}>
//                   {data.billingFeatureEnabled ? 'Enabled' : 'Disabled'}
//                 </Badge>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm">
//               <Activity className="h-5 w-5 text-orange-600" />
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Subscription Status</p>
//                 <Badge className={data.hasActiveSubscription && !data.isExpired ? 'bg-green-500' : 'bg-red-500'}>
//                   {!data.hasActiveSubscription
//                     ? 'No Subscription'
//                     : data.isExpired
//                     ? 'Expired'
//                     : 'Active'}
//                 </Badge>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Warnings and Alerts */}
//       {(data.warnings.length > 0 || !data.hasActiveSubscription || data.isExpired) && (
//         <Alert variant={data.warnings.length > 0 || data.isExpired || !data.hasActiveSubscription ? 'destructive' : 'default'} className="border-l-4 border-l-red-500">
//           {data.warnings.length > 0 ? (
//             <>
//               <AlertTriangle className="h-4 w-4" />
//               <AlertTitle>?? Limit Warnings</AlertTitle>
//               <AlertDescription>
//                 <ul className="list-disc list-inside mt-2 space-y-1">
//                   {data.warnings.map((warning, idx) => (
//                     <li key={idx}>{warning}</li>
//                   ))}
//                 </ul>
//                 {data.recommendations.length > 0 && (
//                   <div className="mt-3 pt-2 border-t">
//                     <p className="font-semibold flex items-center gap-2">
//                       <TrendingUp className="h-4 w-4" />
//                       Recommendations:
//                     </p>
//                     <ul className="list-disc list-inside mt-1">
//                       {data.recommendations.map((rec, idx) => (
//                         <li key={idx}>{rec}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </AlertDescription>
//             </>
//           ) : !data.hasActiveSubscription ? (
//             <>
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>No Active Subscription</AlertTitle>
//               <AlertDescription>
//                 {data.message || 'Please contact facility administrator to subscribe.'}
//               </AlertDescription>
//             </>
//           ) : data.isExpired ? (
//             <>
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Subscription Expired</AlertTitle>
//               <AlertDescription>
//                 {data.message || 'Your subscription has expired. Please renew to continue using all features.'}
//               </AlertDescription>
//             </>
//           ) : (
//             <>
//               <CheckCircle2 className="h-4 w-4 text-green-500" />
//               <AlertTitle>All Systems Operational</AlertTitle>
//               <AlertDescription>
//                 Your facility is within all subscription limits. Great job!
//               </AlertDescription>
//             </>
//           )}
//         </Alert>
//       )}

//       {/* Main Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex bg-gray-100 dark:bg-gray-800">
//           <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
//             <Activity className="h-4 w-4" />
//             Overview
//           </TabsTrigger>
//           <TabsTrigger value="staff-depts" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
//             <Users className="h-4 w-4" />
//             Staff & Depts
//           </TabsTrigger>
//           <TabsTrigger value="beds" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
//             <Bed className="h-4 w-4" />
//             Bed Management
//           </TabsTrigger>
//           <TabsTrigger value="consultations" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
//             <Stethoscope className="h-4 w-4" />
//             Consultations
//           </TabsTrigger>
//         </TabsList>

//         {/* Overview Tab */}
//         <TabsContent value="overview" className="space-y-6 mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Staff Card */}
//             <Card className="hover:shadow-lg transition-all duration-300">
//               <CardHeader className="pb-2">
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="flex items-center gap-2 text-lg text-blue-600">
//                     <Users className="h-5 w-5" />
//                     Staff Members
//                   </CardTitle>
//                   {getStatusBadge(data.limits.staff.allowed, data.limits.staff.exceeded, data.limits.staff.limitType)}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-baseline">
//                     <span className="text-3xl font-bold">{data.limits.staff.current}</span>
//                     <span className="text-muted-foreground">
//                       / {data.limits.staff.limitType === 'unlimited' ? '8' : data.limits.staff.max}
//                     </span>
//                   </div>
//                   <Progress
//                     value={data.limits.staff.percentageUsed}
//                     className={getStatusColor(data.limits.staff.percentageUsed, data.limits.staff.exceeded)}
//                   />
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">
//                       {data.limits.staff.remaining} remaining
//                     </span>
//                     <span className="font-medium">{data.limits.staff.percentageUsed}% used</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Departments Card */}
//             <Card className="hover:shadow-lg transition-all duration-300">
//               <CardHeader className="pb-2">
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="flex items-center gap-2 text-lg text-purple-600">
//                     <Building2 className="h-5 w-5" />
//                     Departments
//                   </CardTitle>
//                   {getStatusBadge(data.limits.departments.allowed, data.limits.departments.exceeded, data.limits.departments.limitType)}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-baseline">
//                     <span className="text-3xl font-bold">{data.limits.departments.current}</span>
//                     <span className="text-muted-foreground">
//                       / {data.limits.departments.limitType === 'unlimited' ? '8' : data.limits.departments.max}
//                     </span>
//                   </div>
//                   <Progress
//                     value={data.limits.departments.percentageUsed}
//                     className={getStatusColor(data.limits.departments.percentageUsed, data.limits.departments.exceeded)}
//                   />
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">
//                       {data.limits.departments.remaining} remaining
//                     </span>
//                     <span className="font-medium">{data.limits.departments.percentageUsed}% used</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Beds Overview Card */}
//             <Card className="hover:shadow-lg transition-all duration-300">
//               <CardHeader className="pb-2">
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="flex items-center gap-2 text-lg text-green-600">
//                     <Bed className="h-5 w-5" />
//                     Total Beds
//                   </CardTitle>
//                   {getStatusBadge(data.limits.beds.allowed, data.limits.beds.exceeded, data.limits.beds.limitType)}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-baseline">
//                     <span className="text-3xl font-bold">{data.limits.beds.current}</span>
//                     <span className="text-muted-foreground">
//                       / {data.limits.beds.limitType === 'unlimited' ? '8' : data.limits.beds.max}
//                     </span>
//                   </div>
//                   <Progress
//                     value={data.limits.beds.percentageUsed}
//                     className={getStatusColor(data.limits.beds.percentageUsed, data.limits.beds.exceeded)}
//                   />
//                   <div className="grid grid-cols-3 gap-2 text-center text-sm pt-2">
//                     <div>
//                       <p className="text-muted-foreground">Available</p>
//                       <p className="font-bold text-green-600">{data.limits.beds.utilizationMetrics.availableBeds}</p>
//                     </div>
//                     <div>
//                       <p className="text-muted-foreground">Occupied</p>
//                       <p className="font-bold text-blue-600">{data.limits.beds.utilizationMetrics.occupiedBeds}</p>
//                     </div>
//                     <div>
//                       <p className="text-muted-foreground">Utilization</p>
//                       <p className="font-bold">{data.limits.beds.utilizationMetrics.utilizationRate}%</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Clinical Consults Card */}
//             <Card className="hover:shadow-lg transition-all duration-300">
//               <CardHeader className="pb-2">
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="flex items-center gap-2 text-lg text-orange-600">
//                     <Pill className="h-5 w-5" />
//                     Clinical Consults
//                   </CardTitle>
//                   {getStatusBadge(data.limits.clinical.allowed, data.limits.clinical.exceeded, data.limits.clinical.limitType)}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-baseline">
//                     <span className="text-3xl font-bold">{data.limits.clinical.current}</span>
//                     <span className="text-muted-foreground">
//                       / {data.limits.clinical.limitType === 'unlimited' ? '8' : data.limits.clinical.max}
//                     </span>
//                   </div>
//                   <Progress
//                     value={data.limits.clinical.percentageUsed}
//                     className={getStatusColor(data.limits.clinical.percentageUsed, data.limits.clinical.exceeded)}
//                   />
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">
//                       {data.limits.clinical.remaining} remaining
//                     </span>
//                     <span className="font-medium">{data.limits.clinical.percentageUsed}% used</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Tele Consults Card */}
//             <Card className="hover:shadow-lg transition-all duration-300">
//               <CardHeader className="pb-2">
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="flex items-center gap-2 text-lg text-teal-600">
//                     <Phone className="h-5 w-5" />
//                     Tele Consults
//                   </CardTitle>
//                   {getStatusBadge(data.limits.tele.allowed, data.limits.tele.exceeded, data.limits.tele.limitType)}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-baseline">
//                     <span className="text-3xl font-bold">{data.limits.tele.current}</span>
//                     <span className="text-muted-foreground">
//                       / {data.limits.tele.limitType === 'unlimited' ? '8' : data.limits.tele.max}
//                     </span>
//                   </div>
//                   <Progress
//                     value={data.limits.tele.percentageUsed}
//                     className={getStatusColor(data.limits.tele.percentageUsed, data.limits.tele.exceeded)}
//                   />
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">
//                       {data.limits.tele.remaining} remaining
//                     </span>
//                     <span className="font-medium">{data.limits.tele.percentageUsed}% used</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Appointments Card */}
//             <Card className="hover:shadow-lg transition-all duration-300">
//               <CardHeader className="pb-2">
//                 <CardTitle className="flex items-center gap-2 text-lg text-pink-600">
//                   <Calendar className="h-5 w-5" />
//                   Appointments (This Month)
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-4xl font-bold mb-3 text-pink-600">
//                   {data.subscriptionDetails.totalAppointmentsThisMonth}
//                 </div>
//                 <div className="space-y-1 max-h-32 overflow-y-auto">
//                   {Object.entries(data.subscriptionDetails.appointmentStatusBreakdown).map(([status, count]) => (
//                     <div key={status} className="flex justify-between text-sm">
//                       <span className="capitalize text-muted-foreground">{status.toLowerCase()}</span>
//                       <Badge variant="outline" className="border-pink-200 text-pink-700">
//                         {count as number}
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Staff & Departments Tab */}
//         <TabsContent value="staff-depts" className="space-y-6 mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Detailed Staff Card */}
//             <Card className="hover:shadow-lg transition-all duration-300">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-blue-600">
//                   <UserCheck className="h-5 w-5" />
//                   Staff Details
//                 </CardTitle>
//                 <CardDescription>Current staff allocation against plan limits</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <div className="flex justify-between mb-2">
//                     <span className="font-medium">Usage</span>
//                     <span className={data.limits.staff.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
//                       {data.limits.staff.current} / {data.limits.staff.max}
//                     </span>
//                   </div>
//                   <Progress 
//                     value={data.limits.staff.percentageUsed} 
//                     className={getStatusColor(data.limits.staff.percentageUsed, data.limits.staff.exceeded)}
//                   />
//                   <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div>
//                         <p className="text-muted-foreground">Remaining Slots</p>
//                         <p className="text-2xl font-bold">{data.limits.staff.remaining}</p>
//                       </div>
//                       <div>
//                         <p className="text-muted-foreground">Limit Type</p>
//                         <Badge variant="outline" className="border-blue-200">
//                           {data.limits.staff.limitType}
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Detailed Departments Card */}
//             <Card className="hover:shadow-lg transition-all duration-300">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-purple-600">
//                   <Building2 className="h-5 w-5" />
//                   Departments Details
//                 </CardTitle>
//                 <CardDescription>Current department allocation against plan limits</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <div className="flex justify-between mb-2">
//                     <span className="font-medium">Usage</span>
//                     <span className={data.limits.departments.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
//                       {data.limits.departments.current} / {data.limits.departments.max}
//                     </span>
//                   </div>
//                   <Progress 
//                     value={data.limits.departments.percentageUsed} 
//                     className={getStatusColor(data.limits.departments.percentageUsed, data.limits.departments.exceeded)}
//                   />
//                   <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div>
//                         <p className="text-muted-foreground">Remaining Departments</p>
//                         <p className="text-2xl font-bold">{data.limits.departments.remaining}</p>
//                       </div>
//                       <div>
//                         <p className="text-muted-foreground">Limit Type</p>
//                         <Badge variant="outline" className="border-purple-200">
//                           {data.limits.departments.limitType}
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Bed Management Tab */}
//         <TabsContent value="beds" className="space-y-6 mt-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Bed Inventory Card */}
//             <Card className="hover:shadow-lg transition-all duration-300">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-green-600">
//                   <Bed className="h-5 w-5" />
//                   Bed Inventory & Utilization
//                 </CardTitle>
//                 <CardDescription>Current bed usage and availability status</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <div className="flex justify-between mb-2">
//                     <span className="font-medium">Total Beds Usage</span>
//                     <span className={data.limits.beds.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
//                       {data.limits.beds.current} / {data.limits.beds.max}
//                     </span>
//                   </div>
//                   <Progress 
//                     value={data.limits.beds.percentageUsed} 
//                     className={getStatusColor(data.limits.beds.percentageUsed, data.limits.beds.exceeded)}
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-3 pt-2">
//                   <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl">
//                     <p className="text-3xl font-bold text-green-600">
//                       {data.limits.beds.utilizationMetrics.availableBeds}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Available Beds</p>
//                   </div>
//                   <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl">
//                     <p className="text-3xl font-bold text-blue-600">
//                       {data.limits.beds.utilizationMetrics.occupiedBeds}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Occupied Beds</p>
//                   </div>
//                   <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-xl">
//                     <p className="text-3xl font-bold text-yellow-600">
//                       {data.limits.beds.utilizationMetrics.reservedBeds}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Reserved Beds</p>
//                   </div>
//                   <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl">
//                     <p className="text-3xl font-bold text-purple-600">
//                       {data.limits.beds.utilizationMetrics.upcomingBookings}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Upcoming (7 days)</p>
//                   </div>
//                 </div>

//                 <div className="pt-2">
//                   <div className="flex justify-between text-sm mb-1">
//                     <span>Bed Utilization Rate</span>
//                     <span className="font-bold">{data.limits.beds.utilizationMetrics.utilizationRate}%</span>
//                   </div>
//                   <Progress value={data.limits.beds.utilizationMetrics.utilizationRate} className="bg-gray-200" />
//                   <p className="text-xs text-muted-foreground mt-2">
//                     {data.limits.beds.utilizationMetrics.utilizationRate > 85 
//                       ? '?? High utilization - consider adding more beds' 
//                       : data.limits.beds.utilizationMetrics.utilizationRate > 70
//                       ? '?? Moderate utilization'
//                       : '? Good utilization rate'}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Bed Bookings Status Card */}
//             <Card className="hover:shadow-lg transition-all duration-300">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-indigo-600">
//                   <BookOpen className="h-5 w-5" />
//                   Bed Bookings Status
//                 </CardTitle>
//                 <CardDescription>Active and upcoming bed bookings</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Active Bookings</p>
//                     <p className="text-4xl font-bold text-indigo-600">{data.limits.bedBookings.activeBookings}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-muted-foreground">Against Limit</p>
//                     <p className="text-xl font-medium">
//                       {data.limits.bedBookings.current} / {data.limits.beds.max}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <p className="font-medium text-sm">Breakdown by Status</p>
//                   {Object.entries(data.limits.bedBookings.breakdown).map(([status, count]) => (
//                     <div key={status} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
//                       <span className="capitalize text-sm flex items-center gap-2">
//                         {getStatusIcon(status)} {status.toLowerCase().replace('_', ' ')}
//                       </span>
//                       <Badge className={
//                         status === 'ADMITTED' || status === 'OCCUPIED' 
//                           ? 'bg-green-500' 
//                           : status === 'RESERVED' 
//                           ? 'bg-yellow-500' 
//                           : 'bg-gray-500'
//                       }>
//                         {count as number}
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>

//                 {data.limits.bedBookings.exceeded && (
//                   <Alert variant="destructive" className="mt-2">
//                     <AlertTriangle className="h-4 w-4" />
//                     <AlertTitle>Bed Bookings Limit Exceeded</AlertTitle>
//                     <AlertDescription>
//                       You have {data.limits.bedBookings.current} active bookings but your plan only allows {data.limits.beds.max}.
//                       Consider upgrading your plan or discharging patients.
//                     </AlertDescription>
//                   </Alert>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Consultations Tab */}
//         <TabsContent value="consultations" className="space-y-6 mt-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Clinical Consultations Detailed Card */}
//             <Card className="hover:shadow-lg transition-all duration-300">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-orange-600">
//                   <Pill className="h-5 w-5" />
//                   Clinical Consultations
//                 </CardTitle>
//                 <CardDescription>Track your clinical consultation usage</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <div className="flex justify-between mb-2">
//                     <span className="font-medium">Usage</span>
//                     <span className={data.limits.clinical.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
//                       {data.limits.clinical.current} / {data.limits.clinical.max}
//                     </span>
//                   </div>
//                   <Progress 
//                     value={data.limits.clinical.percentageUsed} 
//                     className={getStatusColor(data.limits.clinical.percentageUsed, data.limits.clinical.exceeded)}
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <p className="text-sm text-muted-foreground">Remaining</p>
//                     <p className="text-2xl font-bold">{data.limits.clinical.remaining}</p>
//                   </div>
//                   <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <p className="text-sm text-muted-foreground">Percentage Used</p>
//                     <p className="text-2xl font-bold">{data.limits.clinical.percentageUsed}%</p>
//                   </div>
//                 </div>
//                 {data.limits.clinical.percentageUsed >= 80 && !data.limits.clinical.exceeded && (
//                   <Alert>
//                     <AlertTriangle className="h-4 w-4" />
//                     <AlertTitle>Approaching Limit</AlertTitle>
//                     <AlertDescription>
//                       You've used {data.limits.clinical.percentageUsed}% of your clinical consultation limit.
//                       Consider upgrading your plan to avoid interruptions.
//                     </AlertDescription>
//                   </Alert>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Tele Consultations Detailed Card */}
//             <Card className="hover:shadow-lg transition-all duration-300">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-teal-600">
//                   <Phone className="h-5 w-5" />
//                   Tele Consultations
//                 </CardTitle>
//                 <CardDescription>Track your tele-consultation usage</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <div className="flex justify-between mb-2">
//                     <span className="font-medium">Usage</span>
//                     <span className={data.limits.tele.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
//                       {data.limits.tele.current} / {data.limits.tele.max}
//                     </span>
//                   </div>
//                   <Progress 
//                     value={data.limits.tele.percentageUsed} 
//                     className={getStatusColor(data.limits.tele.percentageUsed, data.limits.tele.exceeded)}
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <p className="text-sm text-muted-foreground">Remaining</p>
//                     <p className="text-2xl font-bold">{data.limits.tele.remaining}</p>
//                   </div>
//                   <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <p className="text-sm text-muted-foreground">Percentage Used</p>
//                     <p className="text-2xl font-bold">{data.limits.tele.percentageUsed}%</p>
//                   </div>
//                 </div>
//                 {data.limits.tele.percentageUsed >= 80 && !data.limits.tele.exceeded && (
//                   <Alert>
//                     <AlertTriangle className="h-4 w-4" />
//                     <AlertTitle>Approaching Limit</AlertTitle>
//                     <AlertDescription>
//                       You've used {data.limits.tele.percentageUsed}% of your tele-consultation limit.
//                       Consider upgrading your plan to avoid interruptions.
//                     </AlertDescription>
//                   </Alert>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Analytics Feature Alert */}
//           {data.subscriptionDetails.includesAnalytics && (
//             <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
//               <TrendingUp className="h-4 w-4 text-purple-600" />
//               <AlertTitle className="text-purple-800">Analytics Available</AlertTitle>
//               <AlertDescription className="text-purple-700">
//                 Your plan includes advanced analytics. Visit the Analytics Dashboard for detailed insights 
//                 on consultation trends, patient outcomes, and operational efficiency.
//               </AlertDescription>
//             </Alert>
//           )}
//         </TabsContent>
//       </Tabs>

//       {/* Footer with last updated info */}
//       <div className="text-center text-xs text-muted-foreground pt-4">
//         Data refreshes automatically every {refreshInterval / 1000} seconds
//         {lastRefreshed && ` • Last updated: ${lastRefreshed.toLocaleTimeString()}`}
//       </div>
//     </div>
//   );
// }

// // Loading Skeleton Component
// function FacilityLimitDashboardSkeleton() {
//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <Skeleton className="h-8 w-64 mb-2" />
//           <Skeleton className="h-4 w-96" />
//         </div>
//         <Skeleton className="h-10 w-24" />
//       </div>
      
//       <Skeleton className="h-32 w-full" />
//       <Skeleton className="h-12 w-full" />
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Skeleton className="h-48" />
//         <Skeleton className="h-48" />
//         <Skeleton className="h-48" />
//       </div>
//     </div>
//   );
// }


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
  Building2,
  Bed,
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
  Hospital,
  UserCheck,
  Stethoscope,
  Loader2,
  BookOpen,
  UserRound,
  HeartPulse,
  Syringe,
  Video,
  Ambulance,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Type definitions based on your Edge Function response
interface LimitData {
  current: number;
  max: number;
  allowed: boolean;
  remaining: number;
  exceeded: boolean;
  limitType: 'unlimited' | 'limited';
  percentageUsed: number;
}

interface BedUtilizationMetrics {
  totalBeds: number;
  occupiedBeds: number;
  reservedBeds: number;
  availableBeds: number;
  utilizationRate: number;
  upcomingBookings: number;
}

interface BedBookingsBreakdown {
  RESERVED?: number;
  ADMITTED?: number;
  OCCUPIED?: number;
  TRANSFERRED?: number;
  DISCHARGED?: number;
  CANCELLED?: number;
}

interface FacilityLimits {
  staff: LimitData;
  departments: LimitData;
  beds: LimitData & { 
    utilizationMetrics: BedUtilizationMetrics;
    occupiedBeds?: number;
    reservedBeds?: number;
    availableBeds?: number;
  };
  bedBookings: LimitData & {
    breakdown: BedBookingsBreakdown;
    activeBookings: number;
  };
  clinical: LimitData;
  tele: LimitData;
}

interface SubscriptionDetails {
  subscriptionId: string;
  tierId: string;
  tierName: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  includesBilling: boolean;
  includesAnalytics: boolean;
  monthlyPrice: number;
  totalAppointmentsThisMonth: number;
  appointmentStatusBreakdown: Record<string, number>;
  appointmentTypeBreakdown?: Record<string, number>;
  clinicalConsultations?: number;
  teleConsultations?: number;
  inPersonAppointments?: number;
  teleconsultationAppointments?: number;
}

interface FacilityInfo {
  id: string;
  name: string;
  adminUserId: string;
  currentStaff: number;
  currentDepartments: number;
  currentBeds: number;
  currentBedBookings: number;
  isVerified: boolean;
}

interface AppointmentMetrics {
  totalThisMonth: number;
  clinical: number;
  tele: number;
  statusBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
}

interface EdgeFunctionResponse {
  allowed: boolean;
  hasActiveSubscription: boolean;
  isExpired: boolean;
  message: string;
  checkType: string;
  requesterType: 'admin' | 'staff' | 'direct';
  billingFeatureEnabled: boolean;
  facility: FacilityInfo;
  limits: FacilityLimits;
  subscriptionDetails: SubscriptionDetails;
  appointmentMetrics: AppointmentMetrics;
  warnings: string[];
  recommendations: string[];
}

interface FacilityLimitDashboardProps {
  facility_admin_id?: string;
  staff_user_id?: string;
  staff_id?: string;
  facility_id?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onLimitExceeded?: (exceededLimits: string[]) => void;
}

export function FacilityLimitDashboard({
  facility_admin_id,
  staff_user_id,
  staff_id,
  facility_id,
  autoRefresh = true,
  refreshInterval = 30000,
  onLimitExceeded,
}: FacilityLimitDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EdgeFunctionResponse | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const { toast } = useToast();

  // Function to fetch data from Edge Function
  const fetchFacilityLimits = useCallback(async () => {
    if (!facility_admin_id && !staff_user_id && !staff_id && !facility_id) {
      setError('Please provide facility_admin_id, staff_user_id, staff_id, or facility_id');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching facility limits with:', {
        facility_admin_id,
        staff_user_id,
        staff_id,
        facility_id,
      });

      // Call the Supabase Edge Function
      const { data: responseData, error: functionError } = await supabase.functions.invoke(
        'check-facility-limit',
        {
          body: {
            facility_admin_id,
            staff_user_id,
            staff_id,
            facility_id,
            check_type: 'all',
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

      // Check if any limits are exceeded (only if subscription is active)
      if (responseData.hasActiveSubscription && responseData.limits) {
        const exceededLimits = [];
        if (responseData.limits.staff?.exceeded) exceededLimits.push('Staff');
        if (responseData.limits.departments?.exceeded) exceededLimits.push('Departments');
        if (responseData.limits.beds?.exceeded) exceededLimits.push('Beds');
        if (responseData.limits.bedBookings?.exceeded) exceededLimits.push('Bed Bookings');
        if (responseData.limits.clinical?.exceeded) exceededLimits.push('Clinical Consultations');
        if (responseData.limits.tele?.exceeded) exceededLimits.push('Tele Consultations');

        if (exceededLimits.length > 0 && onLimitExceeded) {
          onLimitExceeded(exceededLimits);
        }

        // Show warning toast for exceeded limits
        if (exceededLimits.length > 0) {
          toast({
            title: '⚠️ Limits Exceeded',
            description: `${exceededLimits.join(', ')} ${exceededLimits.length === 1 ? 'has' : 'have'} exceeded subscription limits.`,
            variant: 'destructive',
          });
        }
      }

      // Show subscription expired warning
      if (responseData.isExpired) {
        toast({
          title: 'Subscription Expired',
          description: 'Your facility subscription has expired. Please renew to continue using all features.',
          variant: 'destructive',
          duration: 10000,
        });
      }

      // Show no subscription warning
      if (!responseData.hasActiveSubscription) {
        toast({
          title: 'No Active Subscription',
          description: 'Please contact your facility administrator to activate a subscription.',
          variant: 'destructive',
          duration: 10000,
        });
      }
    } catch (err) {
      console.error('Error fetching facility limits:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch facility limits';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [facility_admin_id, staff_user_id, staff_id, facility_id, toast, onLimitExceeded]);

  // Auto-refresh functionality
  useEffect(() => {
    fetchFacilityLimits();

    let intervalId: NodeJS.Timeout;
    if (autoRefresh && refreshInterval > 0 && data?.hasActiveSubscription) {
      intervalId = setInterval(fetchFacilityLimits, refreshInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchFacilityLimits, autoRefresh, refreshInterval, data?.hasActiveSubscription]);

  // Helper function to get status color for progress bar
  const getStatusColor = (percentage: number, exceeded: boolean) => {
    if (exceeded) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (percentage >= 90) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    if (percentage >= 70) return 'bg-gradient-to-r from-orange-500 to-orange-400';
    if (percentage >= 50) return 'bg-gradient-to-r from-blue-500 to-blue-400';
    return 'bg-gradient-to-r from-green-500 to-emerald-500';
  };

  // Helper function to get status badge
  const getStatusBadge = (allowed: boolean, exceeded: boolean, limitType: string) => {
    if (limitType === 'unlimited') {
      return (
        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Unlimited
        </Badge>
      );
    }
    if (!allowed && exceeded) {
      return (
        <Badge variant="destructive" className="animate-pulse bg-gradient-to-r from-red-600 to-red-700">
          <AlertCircle className="w-3 h-3 mr-1" />
          Exceeded
        </Badge>
      );
    }
    if (!allowed) {
      return (
        <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-red-600">
          <AlertCircle className="w-3 h-3 mr-1" />
          Limit Reached
        </Badge>
      );
    }
    return (
      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Within Limit
      </Badge>
    );
  };

  // Get status icon for bed bookings
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'RESERVED': return <Clock className="h-3 w-3 text-yellow-600" />;
      case 'ADMITTED': return <UserRound className="h-3 w-3 text-green-600" />;
      case 'OCCUPIED': return <HeartPulse className="h-3 w-3 text-red-600" />;
      case 'DISCHARGED': return <CheckCircle2 className="h-3 w-3 text-blue-600" />;
      case 'CANCELLED': return <AlertCircle className="h-3 w-3 text-gray-600" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
    return <FacilityLimitDashboardSkeleton />;
  }

  // Error state
  if (error && !data) {
    return (
      <Alert variant="destructive" className="mb-4 border-l-4 border-l-red-500">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Dashboard</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={fetchFacilityLimits}>
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
          Unable to load facility data. Please check your configuration and try again.
        </AlertDescription>
      </Alert>
    );
  }

  // ============================================================
  // CONDITION: If no active subscription or subscription details missing
  // Show "Subscription Required" UI instead of the full dashboard
  // ============================================================
  const hasValidSubscription = data.hasActiveSubscription === true && 
    data.subscriptionDetails && 
    data.subscriptionDetails.tierName;

  if (!hasValidSubscription) {
    return (
      <div className="space-y-6">
        {/* Header with Refresh - keep consistent */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Subscription dashboard
            </h2>
            <p className="text-muted-foreground mt-1">
              Monitor resource utilization against your subscription limits
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
              onClick={fetchFacilityLimits}
              disabled={loading}
              className="border-gray-300 hover:bg-gray-100"
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

        {/* Facility Information Card - always show */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Hospital className="h-6 w-6 text-blue-600" />
                  {data.facility.name}
                </CardTitle>
                <CardDescription>
                  Facility ID: {data.facility.id.substring(0, 8)}... | Admin ID: {data.facility.adminUserId.substring(0, 8)}...
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                  No Active Plan
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Price</p>
                  <p className="text-xl font-bold">—</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subscription Period</p>
                  <p className="text-sm">No active subscription</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Billing Feature</p>
                  <Badge className="bg-gray-500">Disabled</Badge>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm">
                <Activity className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subscription Status</p>
                  <Badge className="bg-red-500">No Subscription</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Required Message */}
        <Card className="border-2 border-dashed border-amber-300 bg-amber-50 dark:bg-amber-950/20 shadow-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-3">
              <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-2xl text-amber-800 dark:text-amber-300">Subscription Required</CardTitle>
            <CardDescription className="text-amber-700 dark:text-amber-400">
              {data.message || "No active subscription found. Please contact facility administrator to subscribe."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Once a subscription is activated, this dashboard will automatically display resource utilization metrics including staff limits, bed management, consultation tracking, and more.
            </p>
            <div className="flex justify-center gap-3">
              <Button 
                variant="outline" 
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={fetchFacilityLimits}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
              {data.facility.adminUserId && (
                <Button 
                  variant="default" 
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() => {
                    // You can redirect to subscription management page
                    toast({
                      title: "Contact Administrator",
                      description: "Please reach out to your facility administrator to activate a subscription.",
                    });
                  }}
                >
                  Contact Admin
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations from Edge Function */}
        {data.recommendations && data.recommendations.length > 0 && (
          <Alert className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800 dark:text-blue-300">Recommendations</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1 text-blue-700 dark:text-blue-400">
                {data.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // ============================================================
  // ACTIVE SUBSCRIPTION: Full dashboard as originally designed
  // ============================================================
  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Subscription dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor resource utilization against your subscription limits
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
            onClick={fetchFacilityLimits}
            disabled={loading}
            className="border-gray-300 hover:bg-gray-100"
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

      {/* Facility Information Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Hospital className="h-6 w-6 text-blue-600" />
                {data.facility.name}
              </CardTitle>
              <CardDescription>
                Facility ID: {data.facility.id.substring(0, 8)}... | Admin ID: {data.facility.adminUserId.substring(0, 8)}...
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                {data.subscriptionDetails.tierName} Plan
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                {data.subscriptionDetails.daysRemaining} days remaining
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Price</p>
                <p className="text-xl font-bold">{formatCurrency(data.subscriptionDetails.monthlyPrice)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscription Period</p>
                <p className="text-sm">
                  {formatDate(data.subscriptionDetails.startDate)} - {formatDate(data.subscriptionDetails.endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Billing Feature</p>
                <Badge className={data.billingFeatureEnabled ? 'bg-green-500' : 'bg-gray-500'}>
                  {data.billingFeatureEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm">
              <Activity className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscription Status</p>
                <Badge className={data.hasActiveSubscription && !data.isExpired ? 'bg-green-500' : 'bg-red-500'}>
                  {!data.hasActiveSubscription
                    ? 'No Subscription'
                    : data.isExpired
                    ? 'Expired'
                    : 'Active'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnings and Alerts */}
      {(data.warnings.length > 0 || !data.hasActiveSubscription || data.isExpired) && (
        <Alert variant={data.warnings.length > 0 || data.isExpired || !data.hasActiveSubscription ? 'destructive' : 'default'} className="border-l-4 border-l-red-500">
          {data.warnings.length > 0 ? (
            <>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>⚠️ Limit Warnings</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {data.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
                {data.recommendations.length > 0 && (
                  <div className="mt-3 pt-2 border-t">
                    <p className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Recommendations:
                    </p>
                    <ul className="list-disc list-inside mt-1">
                      {data.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </>
          ) : !data.hasActiveSubscription ? (
            <>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Active Subscription</AlertTitle>
              <AlertDescription>
                {data.message || 'Please contact facility administrator to subscribe.'}
              </AlertDescription>
            </>
          ) : data.isExpired ? (
            <>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Subscription Expired</AlertTitle>
              <AlertDescription>
                {data.message || 'Your subscription has expired. Please renew to continue using all features.'}
              </AlertDescription>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>All Systems Operational</AlertTitle>
              <AlertDescription>
                Your facility is within all subscription limits. Great job!
              </AlertDescription>
            </>
          )}
        </Alert>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="staff-depts" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
            <Users className="h-4 w-4" />
            Staff & Depts
          </TabsTrigger>
          <TabsTrigger value="beds" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
            <Bed className="h-4 w-4" />
            Bed Management
          </TabsTrigger>
          <TabsTrigger value="consultations" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
            <Stethoscope className="h-4 w-4" />
            Consultations
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Staff Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-600">
                    <Users className="h-5 w-5" />
                    Staff Members
                  </CardTitle>
                  {getStatusBadge(data.limits.staff.allowed, data.limits.staff.exceeded, data.limits.staff.limitType)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold">{data.limits.staff.current}</span>
                    <span className="text-muted-foreground">
                      / {data.limits.staff.limitType === 'unlimited' ? '∞' : data.limits.staff.max}
                    </span>
                  </div>
                  <Progress
                    value={data.limits.staff.percentageUsed}
                    className={getStatusColor(data.limits.staff.percentageUsed, data.limits.staff.exceeded)}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {data.limits.staff.remaining} remaining
                    </span>
                    <span className="font-medium">{data.limits.staff.percentageUsed}% used</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Departments Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2 text-lg text-purple-600">
                    <Building2 className="h-5 w-5" />
                    Departments
                  </CardTitle>
                  {getStatusBadge(data.limits.departments.allowed, data.limits.departments.exceeded, data.limits.departments.limitType)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold">{data.limits.departments.current}</span>
                    <span className="text-muted-foreground">
                      / {data.limits.departments.limitType === 'unlimited' ? '∞' : data.limits.departments.max}
                    </span>
                  </div>
                  <Progress
                    value={data.limits.departments.percentageUsed}
                    className={getStatusColor(data.limits.departments.percentageUsed, data.limits.departments.exceeded)}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {data.limits.departments.remaining} remaining
                    </span>
                    <span className="font-medium">{data.limits.departments.percentageUsed}% used</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Beds Overview Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2 text-lg text-green-600">
                    <Bed className="h-5 w-5" />
                    Total Beds
                  </CardTitle>
                  {getStatusBadge(data.limits.beds.allowed, data.limits.beds.exceeded, data.limits.beds.limitType)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold">{data.limits.beds.current}</span>
                    <span className="text-muted-foreground">
                      / {data.limits.beds.limitType === 'unlimited' ? '∞' : data.limits.beds.max}
                    </span>
                  </div>
                  <Progress
                    value={data.limits.beds.percentageUsed}
                    className={getStatusColor(data.limits.beds.percentageUsed, data.limits.beds.exceeded)}
                  />
                  <div className="grid grid-cols-3 gap-2 text-center text-sm pt-2">
                    <div>
                      <p className="text-muted-foreground">Available</p>
                      <p className="font-bold text-green-600">{data.limits.beds.utilizationMetrics.availableBeds}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Occupied</p>
                      <p className="font-bold text-blue-600">{data.limits.beds.utilizationMetrics.occupiedBeds}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Utilization</p>
                      <p className="font-bold">{data.limits.beds.utilizationMetrics.utilizationRate}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Consults Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2 text-lg text-orange-600">
                    <Pill className="h-5 w-5" />
                    Clinical Consults
                  </CardTitle>
                  {getStatusBadge(data.limits.clinical.allowed, data.limits.clinical.exceeded, data.limits.clinical.limitType)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold">{data.limits.clinical.current}</span>
                    <span className="text-muted-foreground">
                      / {data.limits.clinical.limitType === 'unlimited' ? '∞' : data.limits.clinical.max}
                    </span>
                  </div>
                  <Progress
                    value={data.limits.clinical.percentageUsed}
                    className={getStatusColor(data.limits.clinical.percentageUsed, data.limits.clinical.exceeded)}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {data.limits.clinical.remaining} remaining
                    </span>
                    <span className="font-medium">{data.limits.clinical.percentageUsed}% used</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tele Consults Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2 text-lg text-teal-600">
                    <Phone className="h-5 w-5" />
                    Tele Consults
                  </CardTitle>
                  {getStatusBadge(data.limits.tele.allowed, data.limits.tele.exceeded, data.limits.tele.limitType)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold">{data.limits.tele.current}</span>
                    <span className="text-muted-foreground">
                      / {data.limits.tele.limitType === 'unlimited' ? '∞' : data.limits.tele.max}
                    </span>
                  </div>
                  <Progress
                    value={data.limits.tele.percentageUsed}
                    className={getStatusColor(data.limits.tele.percentageUsed, data.limits.tele.exceeded)}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {data.limits.tele.remaining} remaining
                    </span>
                    <span className="font-medium">{data.limits.tele.percentageUsed}% used</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointments Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-pink-600">
                  <Calendar className="h-5 w-5" />
                  Appointments (This Month)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-3 text-pink-600">
                  {data.subscriptionDetails.totalAppointmentsThisMonth}
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {Object.entries(data.subscriptionDetails.appointmentStatusBreakdown).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-sm">
                      <span className="capitalize text-muted-foreground">{status.toLowerCase()}</span>
                      <Badge variant="outline" className="border-pink-200 text-pink-700">
                        {count as number}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Staff & Departments Tab */}
        <TabsContent value="staff-depts" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detailed Staff Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <UserCheck className="h-5 w-5" />
                  Staff Details
                </CardTitle>
                <CardDescription>Current staff allocation against plan limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Usage</span>
                    <span className={data.limits.staff.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {data.limits.staff.current} / {data.limits.staff.max}
                    </span>
                  </div>
                  <Progress 
                    value={data.limits.staff.percentageUsed} 
                    className={getStatusColor(data.limits.staff.percentageUsed, data.limits.staff.exceeded)}
                  />
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Remaining Slots</p>
                        <p className="text-2xl font-bold">{data.limits.staff.remaining}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Limit Type</p>
                        <Badge variant="outline" className="border-blue-200">
                          {data.limits.staff.limitType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Departments Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Building2 className="h-5 w-5" />
                  Departments Details
                </CardTitle>
                <CardDescription>Current department allocation against plan limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Usage</span>
                    <span className={data.limits.departments.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {data.limits.departments.current} / {data.limits.departments.max}
                    </span>
                  </div>
                  <Progress 
                    value={data.limits.departments.percentageUsed} 
                    className={getStatusColor(data.limits.departments.percentageUsed, data.limits.departments.exceeded)}
                  />
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Remaining Departments</p>
                        <p className="text-2xl font-bold">{data.limits.departments.remaining}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Limit Type</p>
                        <Badge variant="outline" className="border-purple-200">
                          {data.limits.departments.limitType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bed Management Tab */}
        <TabsContent value="beds" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bed Inventory Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Bed className="h-5 w-5" />
                  Bed Inventory & Utilization
                </CardTitle>
                <CardDescription>Current bed usage and availability status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Total Beds Usage</span>
                    <span className={data.limits.beds.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {data.limits.beds.current} / {data.limits.beds.max}
                    </span>
                  </div>
                  <Progress 
                    value={data.limits.beds.percentageUsed} 
                    className={getStatusColor(data.limits.beds.percentageUsed, data.limits.beds.exceeded)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl">
                    <p className="text-3xl font-bold text-green-600">
                      {data.limits.beds.utilizationMetrics.availableBeds}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Available Beds</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl">
                    <p className="text-3xl font-bold text-blue-600">
                      {data.limits.beds.utilizationMetrics.occupiedBeds}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Occupied Beds</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-xl">
                    <p className="text-3xl font-bold text-yellow-600">
                      {data.limits.beds.utilizationMetrics.reservedBeds}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Reserved Beds</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl">
                    <p className="text-3xl font-bold text-purple-600">
                      {data.limits.beds.utilizationMetrics.upcomingBookings}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Upcoming (7 days)</p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Bed Utilization Rate</span>
                    <span className="font-bold">{data.limits.beds.utilizationMetrics.utilizationRate}%</span>
                  </div>
                  <Progress value={data.limits.beds.utilizationMetrics.utilizationRate} className="bg-gray-200" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {data.limits.beds.utilizationMetrics.utilizationRate > 85 
                      ? '⚠️ High utilization - consider adding more beds' 
                      : data.limits.beds.utilizationMetrics.utilizationRate > 70
                      ? '📊 Moderate utilization'
                      : '✅ Good utilization rate'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bed Bookings Status Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-600">
                  <BookOpen className="h-5 w-5" />
                  Bed Bookings Status
                </CardTitle>
                <CardDescription>Active and upcoming bed bookings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Bookings</p>
                    <p className="text-4xl font-bold text-indigo-600">{data.limits.bedBookings.activeBookings}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Against Limit</p>
                    <p className="text-xl font-medium">
                      {data.limits.bedBookings.current} / {data.limits.beds.max}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-sm">Breakdown by Status</p>
                  {Object.entries(data.limits.bedBookings.breakdown).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <span className="capitalize text-sm flex items-center gap-2">
                        {getStatusIcon(status)} {status.toLowerCase().replace('_', ' ')}
                      </span>
                      <Badge className={
                        status === 'ADMITTED' || status === 'OCCUPIED' 
                          ? 'bg-green-500' 
                          : status === 'RESERVED' 
                          ? 'bg-yellow-500' 
                          : 'bg-gray-500'
                      }>
                        {count as number}
                      </Badge>
                    </div>
                  ))}
                </div>

                {data.limits.bedBookings.exceeded && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Bed Bookings Limit Exceeded</AlertTitle>
                    <AlertDescription>
                      You have {data.limits.bedBookings.current} active bookings but your plan only allows {data.limits.beds.max}.
                      Consider upgrading your plan or discharging patients.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Consultations Tab */}
        <TabsContent value="consultations" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clinical Consultations Detailed Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Pill className="h-5 w-5" />
                  Clinical Consultations
                </CardTitle>
                <CardDescription>Track your clinical consultation usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Usage</span>
                    <span className={data.limits.clinical.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {data.limits.clinical.current} / {data.limits.clinical.max}
                    </span>
                  </div>
                  <Progress 
                    value={data.limits.clinical.percentageUsed} 
                    className={getStatusColor(data.limits.clinical.percentageUsed, data.limits.clinical.exceeded)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-2xl font-bold">{data.limits.clinical.remaining}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-muted-foreground">Percentage Used</p>
                    <p className="text-2xl font-bold">{data.limits.clinical.percentageUsed}%</p>
                  </div>
                </div>
                {data.limits.clinical.percentageUsed >= 80 && !data.limits.clinical.exceeded && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Approaching Limit</AlertTitle>
                    <AlertDescription>
                      You've used {data.limits.clinical.percentageUsed}% of your clinical consultation limit.
                      Consider upgrading your plan to avoid interruptions.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Tele Consultations Detailed Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-600">
                  <Phone className="h-5 w-5" />
                  Tele Consultations
                </CardTitle>
                <CardDescription>Track your tele-consultation usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Usage</span>
                    <span className={data.limits.tele.exceeded ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {data.limits.tele.current} / {data.limits.tele.max}
                    </span>
                  </div>
                  <Progress 
                    value={data.limits.tele.percentageUsed} 
                    className={getStatusColor(data.limits.tele.percentageUsed, data.limits.tele.exceeded)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-2xl font-bold">{data.limits.tele.remaining}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-muted-foreground">Percentage Used</p>
                    <p className="text-2xl font-bold">{data.limits.tele.percentageUsed}%</p>
                  </div>
                </div>
                {data.limits.tele.percentageUsed >= 80 && !data.limits.tele.exceeded && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Approaching Limit</AlertTitle>
                    <AlertDescription>
                      You've used {data.limits.tele.percentageUsed}% of your tele-consultation limit.
                      Consider upgrading your plan to avoid interruptions.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analytics Feature Alert */}
          {data.subscriptionDetails.includesAnalytics && (
            <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <AlertTitle className="text-purple-800">Analytics Available</AlertTitle>
              <AlertDescription className="text-purple-700">
                Your plan includes advanced analytics. Visit the Analytics Dashboard for detailed insights 
                on consultation trends, patient outcomes, and operational efficiency.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer with last updated info */}
      <div className="text-center text-xs text-muted-foreground pt-4">
        Data refreshes automatically every {refreshInterval / 1000} seconds
        {lastRefreshed && ` • Last updated: ${lastRefreshed.toLocaleTimeString()}`}
      </div>
    </div>
  );
}

// Loading Skeleton Component
function FacilityLimitDashboardSkeleton() {
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
      <Skeleton className="h-12 w-full" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}