import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Building2, Calendar, Eye, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// Types for time spent analytics (doctor)
interface TimeSpentDoctorStats {
  doctor_id: string;
  doctor_name: string;
  specialty: string;
  total_seconds: number;
  total_sessions: number;
  avg_seconds_per_session: number;
}

// Page view stats type
interface PageViewStats {
  doctor_id: string;
  doctor_name: string;
  view_count: number;
  total_time_spent: number;
}

interface VisitorDetail {
  doctor_id: string;
  doctor_name: string;
  device_type: string;
  referrer_url: string;
  time_spent_seconds: number;
  view_timestamp: string;
  visitor_id: string;
}

const DoctorAnalytics = () => {
  // Date range state
  const [dateRangeType, setDateRangeType] = useState<"today" | "week" | "month" | "year">("month");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Time Spent Analytics State
  const [timeSpentLoading, setTimeSpentLoading] = useState(true);
  const [doctorTimeStats, setDoctorTimeStats] = useState<TimeSpentDoctorStats[]>([]);
  const [totalDoctorSeconds, setTotalDoctorSeconds] = useState(0);
  const [totalDoctorSessions, setTotalDoctorSessions] = useState(0);
  const [trendData, setTrendData] = useState<{ label: string; seconds: number }[]>([]);
  const [dailyChangePercent, setDailyChangePercent] = useState<number | null>(null);
  const [weeklyChangePercent, setWeeklyChangePercent] = useState<number | null>(null);
  const [monthlyChangePercent, setMonthlyChangePercent] = useState<number | null>(null);

  // Page View Analytics State
  const [pageViewLoading, setPageViewLoading] = useState(false);
  const [doctorPageViews, setDoctorPageViews] = useState<PageViewStats[]>([]);
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

  // Fetch time spent analytics for the logged‑in doctor
  const fetchTimeSpentAnalytics = async () => {
    setTimeSpentLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get the doctor's medical_professional record
      const { data: doctorRecord, error: doctorError } = await supabase
        .from("medical_professionals")
        .select("id, medical_speciality")
        .eq("user_id", user.id)
        .maybeSingle();

      if (doctorError || !doctorRecord) {
        console.log("Doctor record not found");
        setTimeSpentLoading(false);
        return;
      }

      const doctorId = doctorRecord.id;
      const specialty = doctorRecord.medical_speciality || "General";

      // Fetch time_spent_analytics for this doctor
      const { data: timeData, error } = await supabase
        .from("time_spent_analytics")
        .select("*")
        .eq("entity_type", "medical_professional")
        .eq("entity_id", doctorId)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const records = timeData || [];

      // Aggregate doctor records (should be only one doctor, but handle generically)
      const doctorMap = new Map<string, { total: number; sessions: number }>();
      records.forEach(rec => {
        const existing = doctorMap.get(rec.entity_id) || { total: 0, sessions: 0 };
        existing.total += rec.time_spent_seconds;
        existing.sessions += 1;
        doctorMap.set(rec.entity_id, existing);
      });

      // Get doctor name from profiles
      let doctorName = "Unknown Doctor";
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, prefix")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile) {
        doctorName = `${profile.prefix?.charAt(0)?.toUpperCase() + profile.prefix?.slice(1) || ''} ${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Doctor";
      }

      const statsArr: TimeSpentDoctorStats[] = [];
      let totalSec = 0, totalSess = 0;
      for (const [docId, stats] of doctorMap.entries()) {
        statsArr.push({
          doctor_id: docId,
          doctor_name: doctorName,
          specialty: specialty,
          total_seconds: stats.total,
          total_sessions: stats.sessions,
          avg_seconds_per_session: stats.total / stats.sessions,
        });
        totalSec += stats.total;
        totalSess += stats.sessions;
      }
      setDoctorTimeStats(statsArr.sort((a,b) => b.total_seconds - a.total_seconds));
      setTotalDoctorSeconds(totalSec);
      setTotalDoctorSessions(totalSess);

      // Build daily trend data
      const dailyMap = new Map<string, number>();
      records.forEach(rec => {
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

      // Get doctor ID
      const { data: doctorRecord, error: doctorError } = await supabase
        .from("medical_professionals")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (doctorError || !doctorRecord) {
        console.log("Doctor record not found for page views");
        return;
      }

      const doctorId = doctorRecord.id;
      const professionalIds = [doctorId];

      // Get doctor name from profiles
      let doctorName = "Unknown Doctor";
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, prefix")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile) {
        doctorName = `${profile.prefix?.charAt(0)?.toUpperCase() + profile.prefix?.slice(1) || ''} ${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Doctor";
      }

      // Fetch page_view_logs for this doctor
      const { data: pageViewData, error: pvError } = await supabase
        .from("page_view_logs")
        .select(`entity_id, visitor_id, view_timestamp, time_spent_seconds, device_type, referrer_url`)
        .eq("entity_type", "medical_professional")
        .eq("entity_id", doctorId)
        .gte("view_timestamp", `${startDate}T00:00:00`)
        .lte("view_timestamp", `${endDate}T23:59:59`)
        .order("view_timestamp", { ascending: false });

      if (pvError) throw pvError;

      // Aggregate page views (for summary)
      const viewCount = pageViewData?.length || 0;
      const totalTime = (pageViewData || []).reduce((sum, log) => sum + (log.time_spent_seconds || 0), 0);
      setDoctorPageViews([{
        doctor_id: doctorId,
        doctor_name: doctorName,
        view_count: viewCount,
        total_time_spent: totalTime
      }]);
      setTotalPageViews(viewCount);

      // Visitor details table
      const visitorData: VisitorDetail[] = (pageViewData || []).map((log) => ({
        doctor_id: log.entity_id,
        doctor_name: doctorName,
        device_type: log.device_type || "Unknown",
        referrer_url: log.referrer_url || "Direct",
        time_spent_seconds: log.time_spent_seconds || 0,
        view_timestamp: log.view_timestamp,
        visitor_id: log.visitor_id || "Guest",
      }));
      setVisitorDetails(visitorData);

      // Daily page view trend
      const dailyViewMap = new Map<string, number>();
      (pageViewData || []).forEach((log) => {
        const dateKey = log.view_timestamp.split("T")[0];
        dailyViewMap.set(dateKey, (dailyViewMap.get(dateKey) || 0) + 1);
      });
      const trend = Array.from(dailyViewMap.entries())
        .sort((a,b) => a[0].localeCompare(b[0]))
        .map(([date, views]) => ({ label: date, views }));
      setPageViewTrend(trend);

      // Fetch top referrers using the RPC function
      const { data: referrers, error: refErr } = await supabase.rpc('get_medical_professional_top_referrers', {
        start_date: startDate,
        end_date: endDate,
        professional_ids: professionalIds
      });
      if (!refErr && referrers) {
        setTopReferrers(referrers);
      } else if (refErr) {
        console.error("Error fetching top referrers:", refErr);
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

  // Initial fetch when date range changes
  useEffect(() => {
    fetchTimeSpentAnalytics();
    fetchPageViewAnalytics();
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Profile Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive engagement metrics (time spent + page views)</p>
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
                        {/* <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#333" className="text-lg font-bold">{dailyChangePercent?.toFixed(1)}%</text> */}
                      <text
  x="18"
  y="19"
  textAnchor="middle"
  dominantBaseline="middle"
  fontSize="5"
  fontWeight="bold"
  fill="#333"
>
  {Math.abs(dailyChangePercent || 0).toFixed(1)}%
</text>
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
                        {/* <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#333" className="text-lg font-bold">{weeklyChangePercent?.toFixed(1)}%</text> */}
                        <text  x="18"
  y="19"
  textAnchor="middle"
  dominantBaseline="middle"
  fontSize="5"
  fontWeight="bold" fill="#333" >{weeklyChangePercent?.toFixed(1)}%</text>
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

        {/* Doctor Overview Card */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" /> Doctor Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Time Spent</p>
                <p className="text-2xl font-bold">{formatTime(totalDoctorSeconds)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sessions</p>
                <p className="text-2xl font-bold">{totalDoctorSessions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Time / Session</p>
                <p className="text-2xl font-bold">
                  {totalDoctorSessions ? formatTime(Math.floor(totalDoctorSeconds / totalDoctorSessions)) : "0s"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Profile Views</p>
                <p className="text-2xl font-bold">{totalPageViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Time Spent Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor Time Spent Breakdown</CardTitle>
            <CardDescription>Aggregated from time_spent_analytics</CardDescription>
          </CardHeader>
          <CardContent>
            {timeSpentLoading ? (
              <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
            ) : doctorTimeStats.length === 0 ? (
              <div className="text-center py-12 text-gray-500"><Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p>No time spent data for the selected period.</p></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor Name</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead className="text-right">Total Time</TableHead>
                      <TableHead className="text-right">Sessions</TableHead>
                      <TableHead className="text-right">Avg / Session</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctorTimeStats.map((doc) => (
                      <TableRow key={doc.doctor_id}>
                        <TableCell className="font-medium">{doc.doctor_name}</TableCell>
                        <TableCell>{doc.specialty}</TableCell>
                        <TableCell className="text-right">{formatTime(doc.total_seconds)}</TableCell>
                        <TableCell className="text-right">{doc.total_sessions}</TableCell>
                        <TableCell className="text-right">{formatTime(Math.floor(doc.avg_seconds_per_session))}</TableCell>
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
                <p className="text-sm text-gray-500">Total Time on Profile</p>
                <p className="text-2xl font-bold">{formatTime(doctorPageViews[0]?.total_time_spent || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Unique Visitors</p>
                <p className="text-2xl font-bold">{new Set(visitorDetails.map(v => v.visitor_id)).size}</p>
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

        {/* Top Referrers Table */}
        {topReferrers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Referrer Sources</CardTitle>
              <CardDescription>Websites that sent the most traffic to your profile</CardDescription>
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
                        <TableCell className="font-mono text-sm break-all">{ref.referrer_url}</TableCell>
                        <TableCell className="text-right font-semibold">{ref.view_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Visitor Details Table */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Profile Visitor Details</CardTitle>
            <CardDescription>Users who viewed your profile</CardDescription>
          </CardHeader>
          <CardContent>
            {pageViewLoading ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
            ) : visitorDetails.length === 0 ? (
              <div className="text-center py-10 text-gray-500"><Eye className="h-10 w-10 mx-auto mb-3 text-gray-300" /><p>No visitors found.</p></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Visitor ID</TableHead>
                      <TableHead>Device Type</TableHead>
                      <TableHead>Referrer URL</TableHead>
                      <TableHead className="text-right">Time Spent</TableHead>
                      <TableHead>Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitorDetails.map((visitor, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{visitor.visitor_id}</TableCell>
                        <TableCell>{visitor.device_type}</TableCell>
                        <TableCell className="max-w-[250px] truncate">{visitor.referrer_url}</TableCell>
                        <TableCell className="text-right">{formatTime(visitor.time_spent_seconds)}</TableCell>
                        <TableCell>{new Date(visitor.view_timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default DoctorAnalytics;