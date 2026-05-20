
// import { useState, useEffect } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// import { TrendingUp, TrendingDown, IndianRupee, Building2, User, Calendar, DollarSign, Clock, Eye } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";

// // Mock data for earnings/expenses (keep as is)
// interface EarningsData {
//   period: string;
//   facility: number;
//   departments: {
//     opd: number;
//     diagnostics: number;
//     pharmacy: number;
//     lab: number;
//     emergency: number;
//   };
//   individual: number;
//   total: number;
// }

// interface ExpenseData {
//   period: string;
//   category: string;
//   amount: number;
//   department?: string;
// }

// // New types for time spent analytics
// interface TimeSpentDoctorStats {
//   doctor_id: string;
//   doctor_name: string;
//   specialty: string;
//   total_seconds: number;
//   total_sessions: number;
//   avg_seconds_per_session: number;
// }

// interface TimeSpentFacilityStats {
//   facility_id: string;
//   facility_name: string;
//   facility_type: string;
//   total_seconds: number;
//   total_sessions: number;
//   avg_seconds_per_session: number;
// }

// const AnalyticsReportsPageView = () => {
//   const [timePeriod, setTimePeriod] = useState<"daily" | "weekly" | "monthly" | "quarterly" | "annually">("monthly");
//   const [activeView, setActiveView] = useState<"earnings" | "expenses" | "time_spent">("time_spent");
  
//   // Earnings/Expenses mock data
//   const earningsData: EarningsData[] = [
//     { period: "Jan 2024", facility: 2850000, departments: { opd: 850000, diagnostics: 650000, pharmacy: 450000, lab: 550000, emergency: 350000 }, individual: 1200000, total: 4050000 },
//     { period: "Feb 2024", facility: 3100000, departments: { opd: 920000, diagnostics: 720000, pharmacy: 480000, lab: 600000, emergency: 380000 }, individual: 1350000, total: 4450000 },
//     { period: "Mar 2024", facility: 3350000, departments: { opd: 1000000, diagnostics: 780000, pharmacy: 520000, lab: 650000, emergency: 400000 }, individual: 1450000, total: 4800000 }
//   ];
//   const expenseData: ExpenseData[] = [
//     { period: "Jan 2024", category: "Staff Salaries", amount: 1200000, department: "All" },
//     { period: "Jan 2024", category: "Medical Supplies", amount: 450000, department: "Pharmacy" },
//     { period: "Jan 2024", category: "Equipment Maintenance", amount: 250000, department: "Diagnostics" },
//     { period: "Feb 2024", category: "Staff Salaries", amount: 1250000, department: "All" },
//     { period: "Feb 2024", category: "Medical Supplies", amount: 480000, department: "Pharmacy" },
//     { period: "Mar 2024", category: "Staff Salaries", amount: 1300000, department: "All" }
//   ];
//   const departmentData = [
//     { name: "OPD", value: 1000000, color: "#0088FE" },
//     { name: "Diagnostics", value: 780000, color: "#00C49F" },
//     { name: "Lab", value: 650000, color: "#FFBB28" },
//     { name: "Pharmacy", value: 520000, color: "#FF8042" },
//     { name: "Emergency", value: 400000, color: "#8884D8" }
//   ];
//   const individualEarnings = [
//     { name: "Dr. Rajesh Kumar", department: "Cardiology", earnings: 350000, patients: 145 },
//     { name: "Dr. Priya Sharma", department: "Radiology", earnings: 280000, patients: 98 },
//     { name: "Dr. Amit Singh", department: "Pathology", earnings: 220000, patients: 234 },
//     { name: "Dr. Sarah Wilson", department: "General Medicine", earnings: 195000, patients: 167 }
//   ];

//   // Time Spent Analytics State
//   const [timeSpentLoading, setTimeSpentLoading] = useState(true);
//   const [doctorTimeStats, setDoctorTimeStats] = useState<TimeSpentDoctorStats[]>([]);
//   const [facilityTimeStats, setFacilityTimeStats] = useState<TimeSpentFacilityStats[]>([]);
//   const [totalDoctorSeconds, setTotalDoctorSeconds] = useState(0);
//   const [totalFacilitySeconds, setTotalFacilitySeconds] = useState(0);
//   const [totalDoctorSessions, setTotalDoctorSessions] = useState(0);
//   const [totalFacilitySessions, setTotalFacilitySessions] = useState(0);
// // Date range state
// const [dateRangeType, setDateRangeType] = useState<"today" | "week" | "month" | "year">("month");
// const [startDate, setStartDate] = useState(() => {
//   const d = new Date();
//   d.setDate(1);
//   return d.toISOString().split('T')[0];
// });
// const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
// const [trendData, setTrendData] = useState<{ label: string; seconds: number }[]>([]);
// const [facilityTrend, setFacilityTrend] = useState<number | null>(null);
// const [timeGrouping, setTimeGrouping] = useState<"day" | "week" | "month">("day");
//  const [dailyChangePercent, setDailyChangePercent] = useState<number | null>(null);
// const [weeklyChangePercent, setWeeklyChangePercent] = useState<number | null>(null);
// const [monthlyChangePercent, setMonthlyChangePercent] = useState<number | null>(null);



// useEffect(() => {
//     if (activeView === "time_spent") {
//       fetchTimeSpentAnalytics();
//     }
//   }, [activeView]);

// const fetchTimeSpentAnalytics = async () => {
//   setTimeSpentLoading(true);
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return;

//     const { data: persondetails, error: personError } = await supabase
//       .from("facilities")
//       .select("id")
//       .eq("admin_user_id", user.id)
//       .maybeSingle();

//     if (personError || !persondetails) {
//       console.log("Person details not found");
//       return;
//     }

//     // Fetch all time_spent_analytics records with date filter
//     const { data: timeData, error } = await supabase
//       .from("time_spent_analytics")
//       .select("*")
//       .eq("entity_id", persondetails.id)
//       .gte("date", startDate)
//       .lte("date", endDate)
//       .order("created_at", { ascending: false });

//     if (error) throw error;

//     const records = timeData || [];

//     // Process facility records
//     const facilityRecords = records.filter(r => r.entity_type === "facility");
//     const facilityMap = new Map<string, { total: number; sessions: number }>();
//     facilityRecords.forEach(rec => {
//       const existing = facilityMap.get(rec.entity_id);
//       if (existing) {
//         existing.total += rec.time_spent_seconds;
//         existing.sessions += 1;
//       } else {
//         facilityMap.set(rec.entity_id, { total: rec.time_spent_seconds, sessions: 1 });
//       }
//     });

//     const facilityIds = Array.from(facilityMap.keys());
//     let facilitiesList: any[] = [];
//     if (facilityIds.length > 0) {
//       const { data: facs } = await supabase
//         .from("facilities")
//         .select("id, facility_name, facility_type")
//         .in("id", facilityIds);
//       facilitiesList = facs || [];
//     }

//     const facilityStatsArr: TimeSpentFacilityStats[] = [];
//     let totalFacSec = 0, totalFacSess = 0;
//     for (const [facId, stats] of facilityMap.entries()) {
//       const fac = facilitiesList.find(f => f.id === facId);
//       facilityStatsArr.push({
//         facility_id: facId,
//         facility_name: fac?.facility_name || "Unknown Facility",
//         facility_type: fac?.facility_type || "N/A",
//         total_seconds: stats.total,
//         total_sessions: stats.sessions,
//         avg_seconds_per_session: stats.total / stats.sessions,
//       });
//       totalFacSec += stats.total;
//       totalFacSess += stats.sessions;
//     }
//     setFacilityTimeStats(facilityStatsArr.sort((a,b) => b.total_seconds - a.total_seconds));
//     setTotalFacilitySeconds(totalFacSec);
//     setTotalFacilitySessions(totalFacSess);

//     // Build trend data (daily aggregates)
//     const dailyMap = new Map<string, number>();
//     facilityRecords.forEach(rec => {
//       const dateKey = rec.date;
//       dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + rec.time_spent_seconds);
//     });
//     const trend = Array.from(dailyMap.entries())
//       .sort((a,b) => a[0].localeCompare(b[0]))
//       .map(([date, seconds]) => ({ label: date, seconds }));
//     setTrendData(trend);

//     // Calculate daily, weekly, monthly change percentages using the trend array
//     if (trend.length >= 2) {
//       const todaySec = trend[trend.length-1]?.seconds || 0;
//       const yesterdaySec = trend[trend.length-2]?.seconds || 0;
//       const dailyChange = yesterdaySec ? ((todaySec - yesterdaySec) / yesterdaySec) * 100 : 0;
//       setDailyChangePercent(dailyChange);
//     }

//     if (trend.length >= 14) {
//       const lastWeek = trend.slice(-7).reduce((sum, d) => sum + d.seconds, 0);
//       const prevWeek = trend.slice(-14, -7).reduce((sum, d) => sum + d.seconds, 0);
//       setWeeklyChangePercent(prevWeek ? ((lastWeek - prevWeek) / prevWeek) * 100 : 0);
//     }

//     if (trend.length >= 60) {
//       const lastMonth = trend.slice(-30).reduce((sum, d) => sum + d.seconds, 0);
//       const prevMonth = trend.slice(-60, -30).reduce((sum, d) => sum + d.seconds, 0);
//       setMonthlyChangePercent(prevMonth ? ((lastMonth - prevMonth) / prevMonth) * 100 : 0);
//     }

//   } catch (err) {
//     console.error("Error fetching time spent analytics:", err);
//   } finally {
//     setTimeSpentLoading(false);
//   }
// };
// const setDateRange = (type: "today" | "week" | "month" | "year") => {
//   const today = new Date();
//   let start = new Date();
//   let end = new Date();
//   switch (type) {
//     case "today":
//       start = today;
//       end = today;
//       break;
//     case "week":
//       const day = today.getDay();
//       start = new Date(today);
//       start.setDate(today.getDate() - day);
//       end = new Date(today);
//       end.setDate(today.getDate() + (6 - day));
//       break;
//     case "month":
//       start = new Date(today.getFullYear(), today.getMonth(), 1);
//       end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//       break;
//     case "year":
//       start = new Date(today.getFullYear(), 0, 1);
//       end = new Date(today.getFullYear(), 11, 31);
//       break;
//   }
//   setStartDate(start.toISOString().split('T')[0]);
//   setEndDate(end.toISOString().split('T')[0]);
//   setDateRangeType(type);
//   fetchTimeSpentAnalytics();
// };

// const handleDateChange = (value: string, type: "start" | "end") => {
//   if (type === "start") setStartDate(value);
//   else setEndDate(value);
//   setDateRangeType(undefined as any);
// };

//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     if (hours > 0) return `${hours}h ${minutes}m`;
//     if (minutes > 0) return `${minutes}m ${secs}s`;
//     return `${secs}s`;
//   };

//   const formatCurrency = (amount: number) => {
//     if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
//     if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
//     if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
//     return `₹${amount}`;
//   };

//   const currentMonthData = earningsData[earningsData.length - 1];
//   const previousMonthData = earningsData[earningsData.length - 2];
//   const growthRate = ((currentMonthData.total - previousMonthData.total) / previousMonthData.total * 100).toFixed(1);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//   <h2 className="text-2xl font-bold">
//     Your Profile Analytics Dashboard
//   </h2>
//   <p className="text-muted-foreground">
//     Comprehensive Profile view analytics and engagement metrics
//   </p>
// </div>
        
//       </div>

//   <div className="space-y-6">
//     {/* Date Range Controls */}
//     <Card>
//       <CardHeader className="pb-3">
//         <CardTitle className="text-md font-medium flex items-center gap-2">
//           <Calendar className="h-4 w-4" /> Time Period
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-wrap gap-3 mb-4">
//           <Button
//             variant={dateRangeType === "today" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setDateRange("today")}
//             className="rounded-full"
//           >
//             Today
//           </Button>
//           <Button
//             variant={dateRangeType === "week" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setDateRange("week")}
//             className="rounded-full"
//           >
//             This Week
//           </Button>
//           <Button
//             variant={dateRangeType === "month" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setDateRange("month")}
//             className="rounded-full"
//           >
//             This Month
//           </Button>
//           <Button
//             variant={dateRangeType === "year" ? "default" : "outline"}
//             size="sm"
//             onClick={() => setDateRange("year")}
//             className="rounded-full"
//           >
//             This Year
//           </Button>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-4 items-end">
//           <div className="flex-1">
//             <label className="text-sm font-medium mb-1 block">Start Date</label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => handleDateChange(e.target.value, "start")}
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
//             />
//           </div>
//           <div className="flex-1">
//             <label className="text-sm font-medium mb-1 block">End Date</label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => handleDateChange(e.target.value, "end")}
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
//             />
//           </div>
//           <Button onClick={() => fetchTimeSpentAnalytics()} className="bg-blue-600">
//             Apply
//           </Button>
//         </div>
//       </CardContent>
//     </Card>

//     {/* Stock Market Style Graph + Circular Indicators */}
// <Card>
//   <CardHeader>
//     <CardTitle>Time Spent Analytics</CardTitle>
//     <CardDescription>Daily fluctuations & performance indicators</CardDescription>
//   </CardHeader>
//   <CardContent>
//     {timeSpentLoading ? (
//       <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
//     ) : trendData.length === 0 ? (
//       <div className="text-center py-12 text-gray-500"><Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>No data for selected period.</p></div>
//     ) : (
//       <div className="space-y-6">
//         {/* Stock‑like Area Chart */}
//         <ResponsiveContainer width="100%" height={300}>
//           <AreaChart data={trendData.slice(-4)}>
//             <defs>
//               <linearGradient id="colorSeconds" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="label" />
//             <YAxis tickFormatter={(value) => formatTime(value)} />
//             <Tooltip formatter={(value) => formatTime(Number(value))} />
//             <Area type="monotone" dataKey="seconds" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSeconds)" />
//           </AreaChart>
//         </ResponsiveContainer>

//         {/* Circular Percentage Indicators */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//           {/* Today vs Yesterday */}
//           <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
//             <div className="relative w-32 h-32">
//               <svg className="w-full h-full" viewBox="0 0 36 36">
//                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
//                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={dailyChangePercent && dailyChangePercent > 0 ? "#10b981" : "#ef4444"} strokeWidth="3" strokeDasharray={`${Math.abs(dailyChangePercent || 0) / 100 * 100}, 100`} strokeLinecap="round" />
//                 <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#333" className="text-lg font-bold">
//                   {dailyChangePercent?.toFixed(1)}%
//                 </text>
//               </svg>
//             </div>
//             <h3 className="font-semibold mt-3">Daily Change</h3>
//             <p className="text-sm text-gray-500">Today vs Yesterday</p>
//             {dailyChangePercent !== null && (
//               <div className={`flex items-center gap-1 mt-1 ${dailyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                 {dailyChangePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
//                 <span className="font-medium">{Math.abs(dailyChangePercent).toFixed(1)}%</span>
//               </div>
//             )}
//           </div>

//           {/* Weekly Change */}
//           <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
//             <div className="relative w-32 h-32">
//               <svg className="w-full h-full" viewBox="0 0 36 36">
//                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
//                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray={`${Math.abs(weeklyChangePercent || 0) / 100 * 100}, 100`} strokeLinecap="round" />
//                 <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#333" className="text-lg font-bold">
//                   {weeklyChangePercent?.toFixed(1)}%
//                 </text>
//               </svg>
//             </div>
//             <h3 className="font-semibold mt-3">Weekly Change</h3>
//             <p className="text-sm text-gray-500">Last 7 days vs previous</p>
//             {weeklyChangePercent !== null && (
//               <div className={`flex items-center gap-1 mt-1 ${weeklyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                 {weeklyChangePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
//                 <span className="font-medium">{Math.abs(weeklyChangePercent).toFixed(1)}%</span>
//               </div>
//             )}
//           </div>

//           {/* Monthly Change */}
//           <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
//             <div className="relative w-32 h-32">
//               <svg className="w-full h-full" viewBox="0 0 36 36">
//                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
//                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray={`${Math.abs(monthlyChangePercent || 0) / 100 * 100}, 100`} strokeLinecap="round" />
//                 <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#333" className="text-lg font-bold">
//                   {monthlyChangePercent?.toFixed(1)}%
//                 </text>
//               </svg>
//             </div>
//             <h3 className="font-semibold mt-3">Monthly Change</h3>
//             <p className="text-sm text-gray-500">Last 30 days vs previous</p>
//             {monthlyChangePercent !== null && (
//               <div className={`flex items-center gap-1 mt-1 ${monthlyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                 {monthlyChangePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
//                 <span className="font-medium">{Math.abs(monthlyChangePercent).toFixed(1)}%</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     )}
//   </CardContent>
// </Card>

//     {/* Facilities Summary Card */}
//     <Card className="bg-gradient-to-br from-green-50 to-green-100">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-lg flex items-center gap-2">
//           <Building2 className="h-5 w-5 text-green-600" /> Facilities Overview
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div>
//             <p className="text-sm text-gray-500">Total Time Spent</p>
//             <p className="text-2xl font-bold">{formatTime(totalFacilitySeconds)}</p>
//             {facilityTrend !== null && (
//               <p className={`text-xs flex items-center gap-1 ${facilityTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                 {facilityTrend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
//                 {Math.abs(facilityTrend)}% vs previous
//               </p>
//             )}
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Total Sessions</p>
//             <p className="text-2xl font-bold">{totalFacilitySessions}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Avg Time / Session</p>
//             <p className="text-2xl font-bold">
//               {totalFacilitySessions ? formatTime(totalFacilitySeconds / totalFacilitySessions) : "0s"}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Unique Facilities</p>
//             <p className="text-2xl font-bold">{facilityTimeStats.length}</p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>

//     {/* Facility Breakdown Table */}
//     <Card>
//       <CardHeader>
//         <CardTitle>Facility Time Spent Breakdown</CardTitle>
//         <CardDescription>Aggregated from time_spent_analytics</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {timeSpentLoading ? (
//           <div className="flex justify-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//           </div>
//         ) : facilityTimeStats.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
//             <p>No time spent data for facilities in the selected period.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Facility Name</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead className="text-right">Total Time</TableHead>
//                   <TableHead className="text-right">Sessions</TableHead>
//                   <TableHead className="text-right">Avg / Session</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {facilityTimeStats.map((fac) => (
//                   <TableRow key={fac.facility_id}>
//                     <TableCell className="font-medium">{fac.facility_name}</TableCell>
//                     <TableCell>{fac.facility_type}</TableCell>
//                     <TableCell className="text-right">{formatTime(fac.total_seconds)}</TableCell>
//                     <TableCell className="text-right">{fac.total_sessions}</TableCell>
//                     <TableCell className="text-right">{formatTime(fac.avg_seconds_per_session)}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   </div>
//     </div>
//   );
// };

// export default AnalyticsReportsPageView;

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Building2, Calendar, Eye, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// Types for time spent analytics
interface TimeSpentFacilityStats {
  facility_id: string;
  facility_name: string;
  facility_type: string;
  total_seconds: number;
  total_sessions: number;
  avg_seconds_per_session: number;
}

// Page view stats type
interface PageViewFacilityStats {
  facility_id: string;
  facility_name: string;
  view_count: number;
  total_time_spent: number;
}
interface VisitorDetail {
  facility_id: string;
  facility_name: string;
  device_type: string;
  referrer_url: string;
  time_spent_seconds: number;
  view_timestamp: string;
  visitor_id: string;
}

const AnalyticsReportsPageView = () => {
  // Date range state
  const [dateRangeType, setDateRangeType] = useState<"today" | "week" | "month" | "year">("month");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
const [facilityTrend, setFacilityTrend] = useState<number | null>(null);
  // Time Spent Analytics State
  const [timeSpentLoading, setTimeSpentLoading] = useState(true);
  const [facilityTimeStats, setFacilityTimeStats] = useState<TimeSpentFacilityStats[]>([]);
  const [totalFacilitySeconds, setTotalFacilitySeconds] = useState(0);
  const [totalFacilitySessions, setTotalFacilitySessions] = useState(0);
  const [trendData, setTrendData] = useState<{ label: string; seconds: number }[]>([]);
  const [dailyChangePercent, setDailyChangePercent] = useState<number | null>(null);
  const [weeklyChangePercent, setWeeklyChangePercent] = useState<number | null>(null);
  const [monthlyChangePercent, setMonthlyChangePercent] = useState<number | null>(null);
  // Page View Analytics State
  const [pageViewLoading, setPageViewLoading] = useState(false);
  const [facilityPageViews, setFacilityPageViews] = useState<PageViewFacilityStats[]>([]);
  const [totalPageViews, setTotalPageViews] = useState(0);
  const [pageViewTrend, setPageViewTrend] = useState<{ label: string; views: number }[]>([]);
const [visitorDetails, setVisitorDetails] = useState<VisitorDetail[]>([]);
const [topReferrers, setTopReferrers] = useState<{ referrer_url: string; view_count: number }[]>([]);

  // Helper: format seconds to human readable
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  // Fetch time spent analytics
  const fetchTimeSpentAnalytics = async () => {
    setTimeSpentLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get facility owned by this admin
      const { data: facility, error: facError } = await supabase
        .from("facilities")
        .select("id")
        .eq("admin_user_id", user.id)
        .maybeSingle();

      if (facError || !facility) {
        console.log("No facility found for this user");
        setTimeSpentLoading(false);
        return;
      }

      // Fetch time_spent_analytics for this facility
      const { data: timeData, error } = await supabase
        .from("time_spent_analytics")
        .select("*")
        .eq("entity_id", facility.id)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const records = timeData || [];

      // Process facility records (entity_type = "facility")
      const facilityRecords = records.filter(r => r.entity_type === "facility");
      const facilityMap = new Map<string, { total: number; sessions: number }>();
      facilityRecords.forEach(rec => {
        const existing = facilityMap.get(rec.entity_id);
        if (existing) {
          existing.total += rec.time_spent_seconds;
          existing.sessions += 1;
        } else {
          facilityMap.set(rec.entity_id, { total: rec.time_spent_seconds, sessions: 1 });
        }
      });

      const facilityIds = Array.from(facilityMap.keys());
      let facilitiesList: any[] = [];
      if (facilityIds.length > 0) {
        const { data: facs } = await supabase
          .from("facilities")
          .select("id, facility_name, facility_type")
          .in("id", facilityIds);
        facilitiesList = facs || [];
      }

      const facilityStatsArr: TimeSpentFacilityStats[] = [];
      let totalFacSec = 0, totalFacSess = 0;
      for (const [facId, stats] of facilityMap.entries()) {
        const fac = facilitiesList.find(f => f.id === facId);
        facilityStatsArr.push({
          facility_id: facId,
          facility_name: fac?.facility_name || "Unknown Facility",
          facility_type: fac?.facility_type || "N/A",
          total_seconds: stats.total,
          total_sessions: stats.sessions,
          avg_seconds_per_session: stats.total / stats.sessions,
        });
        totalFacSec += stats.total;
        totalFacSess += stats.sessions;
      }
      setFacilityTimeStats(facilityStatsArr.sort((a,b) => b.total_seconds - a.total_seconds));
      setTotalFacilitySeconds(totalFacSec);
      setTotalFacilitySessions(totalFacSess);

      // Build trend data (daily aggregates)
      const dailyMap = new Map<string, number>();
      facilityRecords.forEach(rec => {
        const dateKey = rec.date;
        dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + rec.time_spent_seconds);
      });
      const trend = Array.from(dailyMap.entries())
        .sort((a,b) => a[0].localeCompare(b[0]))
        .map(([date, seconds]) => ({ label: date, seconds }));
      setTrendData(trend);

      // Calculate change percentages
      if (trend.length >= 2) {
        const todaySec = trend[trend.length-1]?.seconds || 0;
        const yesterdaySec = trend[trend.length-2]?.seconds || 0;
        setDailyChangePercent(yesterdaySec ? ((todaySec - yesterdaySec) / yesterdaySec) * 100 : 0);
      }
      if (trend.length >= 14) {
        const lastWeek = trend.slice(-7).reduce((sum, d) => sum + d.seconds, 0);
        const prevWeek = trend.slice(-14, -7).reduce((sum, d) => sum + d.seconds, 0);
        setWeeklyChangePercent(prevWeek ? ((lastWeek - prevWeek) / prevWeek) * 100 : 0);
      }
      if (trend.length >= 60) {
        const lastMonth = trend.slice(-30).reduce((sum, d) => sum + d.seconds, 0);
        const prevMonth = trend.slice(-60, -30).reduce((sum, d) => sum + d.seconds, 0);
        setMonthlyChangePercent(prevMonth ? ((lastMonth - prevMonth) / prevMonth) * 100 : 0);
      }

    } catch (err) {
      console.error("Error fetching time spent analytics:", err);
    } finally {
      setTimeSpentLoading(false);
    }
  };

  // Fetch page view analytics from page_view_logs
 const fetchPageViewAnalytics = async () => {
  setPageViewLoading(true);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: facilitiesData, error: facError } = await supabase
      .from("facilities")
      .select("id, facility_name")
      .eq("admin_user_id", user.id);

    if (facError || !facilitiesData?.length) {
      console.log("No facilities found");
      return;
    }

    const facilityIds = facilitiesData.map((f) => f.id);
    const facilityNameMap = new Map(facilitiesData.map((f) => [f.id, f.facility_name]));

    // Fetch page views
    const { data: pageViewData, error: pvError } = await supabase
      .from("page_view_logs")
      .select(`entity_id, visitor_id, view_timestamp, time_spent_seconds, device_type, referrer_url`)
      .eq("entity_type", "facility")
      .in("entity_id", facilityIds)
      .gte("view_timestamp", `${startDate}T00:00:00`)
      .lte("view_timestamp", `${endDate}T23:59:59`)
      .order("view_timestamp", { ascending: false });

    if (pvError) throw pvError;

    // Aggregate analytics (same as before)
    const viewMap = new Map<string, { count: number; totalTime: number }>();
    (pageViewData || []).forEach((log) => {
      const existing = viewMap.get(log.entity_id) || { count: 0, totalTime: 0 };
      existing.count += 1;
      existing.totalTime += log.time_spent_seconds || 0;
      viewMap.set(log.entity_id, existing);
    });

    const aggregated = Array.from(viewMap.entries()).map(([facilityId, stats]) => ({
      facility_id: facilityId,
      facility_name: facilityNameMap.get(facilityId) || "Unknown Facility",
      view_count: stats.count,
      total_time_spent: stats.totalTime,
    }));

    setFacilityPageViews(aggregated);
    setTotalPageViews(aggregated.reduce((sum, item) => sum + item.view_count, 0));

    // Visitor details table
    const visitorData: VisitorDetail[] = (pageViewData || []).map((log) => ({
      facility_id: log.entity_id,
      facility_name: facilityNameMap.get(log.entity_id) || "Unknown Facility",
      device_type: log.device_type || "Unknown",
      referrer_url: log.referrer_url || "Direct",
      time_spent_seconds: log.time_spent_seconds || 0,
      view_timestamp: log.view_timestamp,
      visitor_id: log.visitor_id || "Guest",
    }));
    setVisitorDetails(visitorData);

    // Trend graph
    const dailyViewMap = new Map<string, number>();
    (pageViewData || []).forEach((log) => {
      const dateKey = log.view_timestamp.split("T")[0];
      dailyViewMap.set(dateKey, (dailyViewMap.get(dateKey) || 0) + 1);
    });
    const trend = Array.from(dailyViewMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, views]) => ({ label: date, views }));
    setPageViewTrend(trend);

    // ✅ NEW: Fetch top referrers
    const { data: facilityReferrers, error: facErr } = await supabase.rpc('get_facility_top_referrers', {
      start_date: startDate,
      end_date: endDate,
      facility_ids: facilityIds
    });

    if (!facErr && facilityReferrers) {
      setTopReferrers(facilityReferrers);
    } else {
      console.error("Error fetching top referrers:", facErr);
    }

  } catch (err) {
    console.error("Error fetching page view analytics:", err);
  } finally {
    setPageViewLoading(false);
  }
};

  // Date range handlers
  const setDateRange = (type: "today" | "week" | "month" | "year") => {
    const today = new Date();
    let start = new Date();
    let end = new Date();
    switch (type) {
      case "today":
        start = today;
        end = today;
        break;
      case "week":
        const day = today.getDay();
        start = new Date(today);
        start.setDate(today.getDate() - day);
        end = new Date(today);
        end.setDate(today.getDate() + (6 - day));
        break;
      case "month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "year":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
    }
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setDateRangeType(type);
    fetchTimeSpentAnalytics();
    fetchPageViewAnalytics();
  };

  const handleDateChange = (value: string, type: "start" | "end") => {
    if (type === "start") setStartDate(value);
    else setEndDate(value);
    setDateRangeType(undefined as any);
  };

  // Fetch data on mount and when date range changes
  useEffect(() => {
    fetchTimeSpentAnalytics();
    fetchPageViewAnalytics();
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Profile Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive Profile view analytics and engagement metrics</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Date Range Controls */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Time Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-4">
              <Button variant={dateRangeType === "today" ? "default" : "outline"} size="sm" onClick={() => setDateRange("today")} className="rounded-full">Today</Button>
              <Button variant={dateRangeType === "week" ? "default" : "outline"} size="sm" onClick={() => setDateRange("week")} className="rounded-full">This Week</Button>
              <Button variant={dateRangeType === "month" ? "default" : "outline"} size="sm" onClick={() => setDateRange("month")} className="rounded-full">This Month</Button>
              <Button variant={dateRangeType === "year" ? "default" : "outline"} size="sm" onClick={() => setDateRange("year")} className="rounded-full">This Year</Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => handleDateChange(e.target.value, "start")} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">End Date</label>
                <input type="date" value={endDate} onChange={(e) => handleDateChange(e.target.value, "end")} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <Button onClick={() => { fetchTimeSpentAnalytics(); fetchPageViewAnalytics(); }} className="bg-blue-600">Apply</Button>
            </div>
          </CardContent>
        </Card>

        {/* Time Spent Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Time Spent Analytics</CardTitle>
            <CardDescription>Daily fluctuations & performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            {timeSpentLoading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
            ) : trendData.length === 0 ? (
              <div className="text-center py-12 text-gray-500"><Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>No time spent data for selected period.</p></div>
            ) : (
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <defs><linearGradient id="colorSeconds" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/><stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(value) => formatTime(value)} />
                    <Tooltip formatter={(value) => formatTime(Number(value))} />
                    <Area type="monotone" dataKey="seconds" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSeconds)" />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full" viewBox="0 0 40 40">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={dailyChangePercent && dailyChangePercent > 0 ? "#10b981" : "#ef4444"} strokeWidth="3" strokeDasharray={`${Math.abs(dailyChangePercent || 0) / 100 * 100}, 100`} strokeLinecap="round" />
                        <text x="18"
  y="19"
  textAnchor="middle"
  dominantBaseline="middle"
  fontSize="5"
  fontWeight="bold" fill="#333" >{dailyChangePercent?.toFixed(1)}%</text>
                        {/* <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#333" className="text-lg font-bold">{dailyChangePercent?.toFixed(1)}%</text> */}
                      </svg>
                    </div>
                    <h3 className="font-semibold mt-3">Daily Change</h3>
                    <p className="text-sm text-gray-500">Today vs Yesterday</p>
                    {dailyChangePercent !== null && (
                      <div className={`flex items-center gap-1 mt-1 ${dailyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {dailyChangePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span className="font-medium">{Math.abs(dailyChangePercent).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full" viewBox="0 0 40 40">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray={`${Math.abs(weeklyChangePercent || 0) / 100 * 100}, 100`} strokeLinecap="round" />
                        <text x="18"
  y="19"
  textAnchor="middle"
  dominantBaseline="middle"
  fontSize="5"
  fontWeight="bold" fill="#333" >{weeklyChangePercent?.toFixed(1)}%</text>
                        {/* <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#333" className="text-lg font-bold">{weeklyChangePercent?.toFixed(1)}%</text> */}
                      </svg>
                    </div>
                    <h3 className="font-semibold mt-3">Weekly Change</h3>
                    <p className="text-sm text-gray-500">Last 7 days vs previous</p>
                    {weeklyChangePercent !== null && (
                      <div className={`flex items-center gap-1 mt-1 ${weeklyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {weeklyChangePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span className="font-medium">{Math.abs(weeklyChangePercent).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full" viewBox="0 0 40 40">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray={`${Math.abs(monthlyChangePercent || 0) / 100 * 100}, 100`} strokeLinecap="round" />
                        <text x="18"
  y="19"
  textAnchor="middle"
  dominantBaseline="middle"
  fontSize="5"
  fontWeight="bold" fill="#333" >{monthlyChangePercent?.toFixed(1)}%</text>
                        {/* <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#333" className="text-lg font-bold">{monthlyChangePercent?.toFixed(1)}%</text> */}
                      </svg>
                    </div>
                    <h3 className="font-semibold mt-3">Monthly Change</h3>
                    <p className="text-sm text-gray-500">Last 30 days vs previous</p>
                    {monthlyChangePercent !== null && (
                      <div className={`flex items-center gap-1 mt-1 ${monthlyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {monthlyChangePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span className="font-medium">{Math.abs(monthlyChangePercent).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>


             {/* Facilities Summary Card */}
     <Card className="bg-gradient-to-br from-green-50 to-green-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">           <Building2 className="h-5 w-5 text-green-600" /> Facilities Overview
         </CardTitle>
     </CardHeader>
       <CardContent>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Time Spent</p>
            <p className="text-2xl font-bold">{formatTime(totalFacilitySeconds)}</p>
            {facilityTrend !== null && (
              <p className={`text-xs flex items-center gap-1 ${facilityTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {facilityTrend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(facilityTrend)}% vs previous
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Sessions</p>
            <p className="text-2xl font-bold">{totalFacilitySessions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg Time / Session</p>
            <p className="text-2xl font-bold">
              {totalFacilitySessions ? formatTime(Math.floor(totalFacilitySeconds / totalFacilitySessions)) : "0s"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Unique Facilities</p>
            <p className="text-2xl font-bold">{facilityTimeStats.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>

        {/* Facility Time Spent Breakdown Table (with extra Page Views column) */}
        <Card>
          <CardHeader>
            <CardTitle>Facility Analytics Breakdown</CardTitle>
            <CardDescription>Time spent and page views aggregated per facility</CardDescription>
          </CardHeader>
          <CardContent>
            {timeSpentLoading || pageViewLoading ? (
              <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
            ) : facilityTimeStats.length === 0 && facilityPageViews.length === 0 ? (
              <div className="text-center py-12 text-gray-500"><Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>No data for the selected period.</p></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Facility Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Total Time Spent</TableHead>
                      <TableHead className="text-right">Sessions</TableHead>
                      <TableHead className="text-right">Avg Time / Session</TableHead>
                      <TableHead className="text-right">Page Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facilityTimeStats.map((fac) => {
                      const pageViewData = facilityPageViews.find(p => p.facility_id === fac.facility_id);
                      return (
                        <TableRow key={fac.facility_id}>
                          <TableCell className="font-medium">{fac.facility_name}</TableCell>
                          <TableCell>{fac.facility_type}</TableCell>
                          <TableCell className="text-right">{formatTime(fac.total_seconds)}</TableCell>
                          <TableCell className="text-right">{fac.total_sessions}</TableCell>
                          <TableCell className="text-right">{formatTime(Math.floor(fac.avg_seconds_per_session))}</TableCell>
                          <TableCell className="text-right">{pageViewData?.view_count || 0}</TableCell>
                        </TableRow>
                      );
                    })}
                    {facilityPageViews.filter(pv => !facilityTimeStats.some(fs => fs.facility_id === pv.facility_id)).map(pv => (
                      <TableRow key={pv.facility_id}>
                        <TableCell className="font-medium">{pv.facility_name}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="text-right">0s</TableCell>
                        <TableCell className="text-right">0</TableCell>
                        <TableCell className="text-right">0s</TableCell>
                        <TableCell className="text-right">{pv.view_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
            {/* Page Views Summary Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" /> Page Views Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Page Views</p>
                    <p className="text-2xl font-bold">{totalPageViews}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg Views per Facility</p>
                    <p className="text-2xl font-bold">{facilityPageViews.length ? (totalPageViews / facilityPageViews.length).toFixed(1) : "0"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Facilities</p>
                    <p className="text-2xl font-bold">{facilityPageViews.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
    
            {/* Daily Page Views Trend Chart */}
            {pageViewTrend.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Daily Page Views Trend</CardTitle>
                  <CardDescription>Number of views per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={pageViewTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* <Card>
  <CardHeader>
    <CardTitle>Profile Visitor Details</CardTitle>
    <CardDescription>
      Users who viewed your facility profile
    </CardDescription>
  </CardHeader>

  <CardContent>
    {pageViewLoading ? (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ) : visitorDetails.length === 0 ? (
      <div className="text-center py-10 text-gray-500">
        <Eye className="h-10 w-10 mx-auto mb-3 text-gray-300" />
        <p>No visitors found.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Facility</TableHead>
              <TableHead>Visitor</TableHead>
              <TableHead>Device Type</TableHead>
              <TableHead>Referrer URL</TableHead>
              <TableHead className="text-right">
                Time Spent
              </TableHead>
              <TableHead>Date & Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visitorDetails.map((visitor, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {visitor.facility_name}
                </TableCell>

                <TableCell>
                  {visitor.visitor_id}
                </TableCell>

                <TableCell>
                  {visitor.device_type}
                </TableCell>

                <TableCell className="max-w-[250px] truncate">
                  {visitor.referrer_url}
                </TableCell>

                <TableCell className="text-right">
                  {formatTime(visitor.time_spent_seconds)}
                </TableCell>

                <TableCell>
                  {new Date(
                    visitor.view_timestamp
                  ).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}
  </CardContent>
</Card> */}

{/* Top Referrers Table */}
{topReferrers.length > 0 && (
  <Card>
    <CardHeader>
      <CardTitle>Top Referrer Sources</CardTitle>
      <CardDescription>Websites that sent the most traffic to your facility profiles</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referrer URL</TableHead>
              <TableHead className="text-right">View Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topReferrers.map((ref, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-mono text-sm break-all">
                  {ref.referrer_url}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {ref.view_count}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
)}
      </div>
    </div>
  );
};

export default AnalyticsReportsPageView;