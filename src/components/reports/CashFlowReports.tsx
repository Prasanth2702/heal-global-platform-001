import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, 
  Download, Filter, RefreshCw, Printer, AlertCircle,
  Wallet, Building2, Package, CreditCard, BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CashflowFilters {
  facility_id: string;
  department_id?: string;
  date_range?: {
    start_date: string;
    end_date: string;
  };
  report_type: 'overview' | 'department' | 'item' | 'daily' | 'payment_method' | 'weekly' | 'monthly_projection';
}

interface CashflowData {
  summary?: {
    total_projected_revenue: number;
    actual_cash_inflow: number;
    expected_cash_inflow: number;
    total_transactions: number;
    completed_transactions: number;
    pending_transactions: number;
    collection_rate: number;
    average_transaction_value: number;
      total_projected?: number;
  total_actual_inflow?: number;
  total_expected_inflow?: number;
  overall_collection_rate?: number;
  };
  cashflow_by_department?: Record<string, any>;
  daily_cashflow_trend?: Record<string, any>;
  payment_method_distribution?: Record<string, any>;
  departments?: any[];
  items?: any[];
  top_performing_items?: any[];
  daily_summary?: any[];
  payment_methods?: any[];
  weekly_trend?: any[];
  monthly_data?: any[];
  forecast?: any[];
  facility?: string;
  generated_at?: string;
}

export const CashFlowReports: React.FC = () => {
  const [filters, setFilters] = useState<CashflowFilters>({
    facility_id: '',
    report_type: 'overview'
  });
  const [reportData, setReportData] = useState<CashflowData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (filters.facility_id) {
      fetchDepartments();
    }
  }, [filters.facility_id]);

  const fetchFacilities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('facilities')
          .select('id, facility_name')
          .eq('admin_user_id', user.id);
        
        if (error) throw error;
        if (data) setFacilities(data);
      }
    } catch (err) {
      console.error('Error fetching facilities:', err);
      setError('Failed to load facilities');
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .eq('facility_id', filters.facility_id)
        .eq('is_active', true);
      
      if (error) throw error;
      if (data) setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const generateReport = async () => {
    if (!filters.facility_id) {
      setError('Please select a facility');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const requestBody = {
        facility_id: filters.facility_id,
        department_id: filters.department_id,
        admin_user_id: user.id,
        report_type: filters.report_type,
        date_range: filters.date_range?.start_date && filters.date_range?.end_date ? filters.date_range : undefined
      };

      console.log('Sending request:', requestBody);

       const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;
      
      const response = await fetch(`https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/cashflow-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate report');
      }
      
      if (result.success) {
        setReportData(result.data);
      } else {
        throw new Error(result.error || 'Failed to generate report');
      }
    } catch (err: any) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData) return;
    
    let csvData: any[] = [];
    if (filters.report_type === 'overview' && reportData.daily_cashflow_trend) {
      csvData = Object.entries(reportData.daily_cashflow_trend).map(([date, data]: [string, any]) => ({
        Date: date,
        'Projected Revenue': data.projected,
        'Actual Inflow': data.actual,
        'Expected Inflow': data.expected,
        'Transactions': data.transactions
      }));
    } else if (filters.report_type === 'department' && reportData.departments) {
      csvData = reportData.departments;
    } else if (filters.report_type === 'item' && reportData.items) {
      csvData = reportData.items;
    }

    if (csvData.length === 0) return;

    const headers = Object.keys(csvData[0]);
    const csv = [
      headers.join(','),
      ...csvData.map(row => headers.map(h => JSON.stringify(row[h])).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filters.report_type}_report_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const renderOverviewReport = () => {
    if (!reportData?.summary) return null;

    const summaryCards = [
      {
        title: 'Total Projected Revenue',
        value: formatCurrency(reportData.summary.total_projected_revenue),
        icon: <DollarSign className="w-6 h-6" />,
        color: 'bg-blue-500'
      },
      {
        title: 'Actual Cash Inflow',
        value: formatCurrency(reportData.summary.actual_cash_inflow),
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'bg-green-500'
      },
      {
        title: 'Expected Inflow',
        value: formatCurrency(reportData.summary.expected_cash_inflow),
        icon: <Wallet className="w-6 h-6" />,
        color: 'bg-yellow-500'
      },
      {
        title: 'Collection Rate',
        value: `${reportData.summary.collection_rate}%`,
        icon: <BarChart3 className="w-6 h-6" />,
        color: 'bg-purple-500'
      }
    ];

    // Prepare chart data
    const dailyChartData = reportData.daily_cashflow_trend
      ? Object.entries(reportData.daily_cashflow_trend).map(([date, data]: [string, any]) => ({
          date,
          projected: data.projected,
          actual: data.actual,
          expected: data.expected
        }))
      : [];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full text-white`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cash Flow Trend Chart */}
        {dailyChartData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Cash Flow Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area type="monotone" dataKey="projected" fill="#8884d8" stroke="#8884d8" name="Projected" />
                <Bar dataKey="actual" fill="#82ca9d" name="Actual Inflow" />
                <Line type="monotone" dataKey="expected" stroke="#ffc658" name="Expected Inflow" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Key Metrics Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg Transaction Value</p>
              <p className="text-xl font-bold mt-2">{formatCurrency(reportData.summary.average_transaction_value)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-xl font-bold mt-2">
                {((reportData.summary.completed_transactions / reportData.summary.total_transactions) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Pending Amount</p>
              <p className="text-xl font-bold mt-2 text-yellow-600">{formatCurrency(reportData.summary.expected_cash_inflow)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-xl font-bold mt-2">{reportData.summary.total_transactions}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDepartmentReport = () => {
    if (!reportData?.departments) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Inflow</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Inflow</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.departments.map((dept: any) => (
                <tr key={dept.department_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                      {dept.department_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.total_items_sold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(dept.projected_revenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(dept.actual_inflow)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{formatCurrency(dept.expected_inflow)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 rounded-full h-2" 
                            style={{ width: `${dept.collection_rate}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium">{dept.collection_rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {reportData.summary && (
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-sm font-bold">Total</td>
                  <td className="px-6 py-4 text-sm font-bold">{formatCurrency(reportData.summary.total_projected)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">{formatCurrency(reportData.summary.total_actual_inflow)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-yellow-600">{formatCurrency(reportData.summary.total_expected_inflow)}</td>
                  <td className="px-6 py-4 text-sm font-bold">{reportData.summary.overall_collection_rate}%</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    );
  };

  const renderItemReport = () => {
    if (!reportData?.items) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.items.map((item: any) => (
                <tr key={item.item_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2 text-gray-500" />
                      {item.item_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.department_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity_sold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.projected_revenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(item.actual_inflow)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.collection_rate >= 80 ? 'bg-green-100 text-green-800' :
                      item.collection_rate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.collection_rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDailyReport = () => {
    if (!reportData?.daily_summary) return null;

    const chartData = reportData.daily_summary.map(day => ({
      date: day.date,
      projected: day.projected_revenue,
      actual: day.actual_inflow,
      expected: day.expected_inflow,
      movingAvg: day.moving_avg_7days
    }));

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Cash Flow with 7-Day Moving Average</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual Inflow" strokeWidth={2} />
              <Line type="monotone" dataKey="movingAvg" stroke="#8884d8" name="7-Day Moving Avg" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="projected" stroke="#ffc658" name="Projected" strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderMonthlyProjection = () => {
    if (!reportData?.monthly_data) return null;

    const chartData = reportData.monthly_data.map((month: any) => ({
      month: new Date(month.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      projected: month.total_projected,
      collected: month.actual_collected,
      pending: month.pending_collection
    }));

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Cash Flow Projection</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="projected" fill="#8884d8" name="Projected Revenue" />
              <Bar dataKey="collected" fill="#82ca9d" name="Actual Collected" />
              <Bar dataKey="pending" fill="#ffc658" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast */}
        {reportData.forecast && reportData.forecast.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">?? 3-Month Cash Flow Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportData.forecast.map((forecast: any, idx: number) => (
                <div key={idx} className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">
                    {new Date(forecast.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {formatCurrency(forecast.projected_inflow)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Expected Growth: {forecast.expected_growth_rate}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReport = () => {
    switch (filters.report_type) {
      case 'overview':
        return renderOverviewReport();
      case 'department':
        return renderDepartmentReport();
      case 'item':
        return renderItemReport();
      case 'daily':
        return renderDailyReport();
      case 'payment_method':
        return renderOverviewReport();
      case 'monthly_projection':
        return renderMonthlyProjection();
      default:
        return (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p>Select a report type and generate report</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cash Flow Analysis Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and analyze your facility's cash inflow projections</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Report Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facility *</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.facility_id}
              onChange={(e) => setFilters({ ...filters, facility_id: e.target.value })}
            >
              <option value="">Select Facility</option>
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>{facility.facility_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.report_type}
              onChange={(e) => setFilters({ ...filters, report_type: e.target.value as any })}
            >
              <option value="overview">Overview Dashboard</option>
              <option value="department">Department Analysis</option>
              <option value="item">Item Performance</option>
              <option value="daily">Daily Cash Flow</option>
              <option value="payment_method">Payment Methods</option>
              <option value="monthly_projection">Monthly Projection</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department (Optional)</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.department_id || ''}
              onChange={(e) => setFilters({ ...filters, department_id: e.target.value || undefined })}
              disabled={!filters.facility_id}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={generateReport}
              disabled={loading || !filters.facility_id}
              className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
            
            {reportData && (
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>

        {/* Date Range */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setFilters({
                ...filters,
                date_range: {
                  ...filters.date_range,
                  start_date: e.target.value,
                  end_date: filters.date_range?.end_date || ''
                }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setFilters({
                ...filters,
                date_range: {
                  start_date: filters.date_range?.start_date || '',
                  end_date: e.target.value
                }
              })}
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Report Content */}
      {reportData && (
        <div>
          {/* Report Header */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Facility: <span className="font-semibold">{reportData.facility}</span></p>
              <p className="text-sm text-gray-600">Generated: {new Date(reportData.generated_at || '').toLocaleString()}</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>

          {/* Report Content */}
          {renderReport()}
        </div>
      )}
    </div>
  );
};