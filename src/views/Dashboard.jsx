import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosClient from "../axios-client";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";
import { 
  HiOutlineUsers, 
  HiOutlineDocumentText, 
  HiOutlineTrendingUp, 
  HiOutlineCurrencyDollar, 
  HiOutlineClock, 
  HiOutlineCheckCircle, 
  HiOutlineExclamationCircle, 
  HiOutlineArrowRight,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlusCircle
} from "react-icons/hi";

const Dashboard = () => {
  // State to store all dashboard statistics from backend
  const [dashboardData, setDashboardData] = useState({
    // Basic counts
    user_count: 0,
    invoice_count: 0,
    auth_user_invoices: [],
    recent_invoices: [],
    
    // Financial statistics
    total_revenue: 0,
    period_revenue: 0,
    pending_invoices: 0,
    paid_invoices: 0,
    overdue_invoices: 0,
    invoice_growth_percentage: 0,
    
    // Charts and analytics
    monthly_revenue: [],
    top_customers: [],
    revenue_by_status: {},
    
    // Filters and metadata
    period: 'month',
    period_dates: { from: '', to: '' },
    
    // User roles and permissions from backend
    is_admin: false,
    is_editor: false,
    can_access_all_invoices: false,
    can_access_all_users: false,
    can_manage_all: false,
    
    // Detailed permissions from backend
    has_invoice_permissions: {
      access: false,
      create: false,
      update: false,
      delete: false,
      update_status: false
    },
    has_user_permissions: {
      access: false,
      create: false,
      update: false,
      delete: false
    }
  });

  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('month'); // day, week, month, year
  const [userPermissions, setUserPermissions] = useState({
    canManageUsers: false,
    canViewAllInvoices: false,
    canCreateInvoice: false,
    canUpdateInvoice: false,
    canDeleteInvoice: false,
    canUpdateStatus: false
  });

  // Fetch dashboard data when component mounts or timeFilter changes
    useEffect(() => {
      fetchDashboardData();
    }, [timeFilter]);

  const fetchDashboardData = () => {
    setLoading(true);
    // Pass the period filter to backend
    AxiosClient.get(`/dashboard?period=${timeFilter}`)
      .then(({ data }) => {
        console.log("Dashboard data:", data); // For debugging
        
        // Set all data from backend response
        setDashboardData({
          user_count: data.user_count || 0,
          invoice_count: data.invoice_count || 0,
          auth_user_invoices: data.auth_user_invoices || [],
          recent_invoices: data.recent_invoices || [],
          total_revenue: data.total_revenue || 0,
          period_revenue: data.period_revenue || 0,
          pending_invoices: data.pending_invoices || 0,
          paid_invoices: data.paid_invoices || 0,
          overdue_invoices: data.overdue_invoices || 0,
          invoice_growth_percentage: data.invoice_growth_percentage || 0,
          monthly_revenue: data.monthly_revenue || [],
          top_customers: data.top_customers || [],
          revenue_by_status: data.revenue_by_status || {},
          period: data.period || 'month',
          period_dates: data.period_dates || { from: '', to: '' },
          
          // User roles and permissions
          is_admin: data.is_admin || false, 
          is_editor: data.is_editor || false,
          can_access_all_invoices: data.can_access_all_invoices || false,
          can_access_all_users: data.can_access_all_users || false,
          can_manage_all: data.can_manage_all || false,
          
          // Detailed permissions
          has_invoice_permissions: data.has_invoice_permissions || {
            access: false,
            create: false,
            update: false,
            delete: false,
            update_status: false
          },
          has_user_permissions: data.has_user_permissions || {
            access: false,
            create: false,
            update: false,
            delete: false
          }
        });

        // Extract and set user permissions for easier access
        setUserPermissions({
          canManageUsers: data.can_access_all_users || false,
          canViewAllInvoices: data.can_access_all_invoices || false,
          canCreateInvoice: data.has_invoice_permissions?.create || false,
          canUpdateInvoice: data.has_invoice_permissions?.update || false,
          canDeleteInvoice: data.has_invoice_permissions?.delete || false,
          canUpdateStatus: data.has_invoice_permissions?.update_status || false
        });
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        alert("Failed to load dashboard data");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Helper function to display status badges with colors
  const getStatusBadge = (statusId) => {
    const statusMap = {
      1: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      2: { label: "Paid", color: "bg-green-100 text-green-800" },
      3: { label: "Overdue", color: "bg-red-100 text-red-800" },
    };

    const status = statusMap[statusId] || { label: "Unknown", color: "bg-gray-100 text-gray-800" };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
        {status.label}
      </span>
    );
  };

  // Format currency with USD symbol and proper formatting
  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date to display nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Display period information from backend
  const getPeriodDisplay = () => {
    if (dashboardData.period_dates.from && dashboardData.period_dates.to) {
      return `${formatDate(dashboardData.period_dates.from)} - ${formatDate(dashboardData.period_dates.to)}`;
    }
    return "Current period";
  };

  // Get user role badge
  const getUserRoleBadge = () => {
    if (dashboardData.is_admin) {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          <HiOutlineShieldCheck className="w-4 h-4 mr-1" />
          Administrator
        </span>
      );
    } else if (dashboardData.is_editor) {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          <HiOutlinePencil className="w-4 h-4 mr-1" />
          Editor
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
          <HiOutlineUserCircle className="w-4 h-4 mr-1" />
          User
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* HEADER SECTION - Shows title, user role, and period filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            {getUserRoleBadge()}
          </div>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
          {/* Display period dates from backend */}
          <p className="text-sm text-gray-500 mt-1">{getPeriodDisplay()}</p>
        </div>
        
        {/* TIME FILTER CONTROLS - Allows user to change period */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Period:</span>
            <div className="inline-flex rounded-lg border border-gray-300 p-1">
              {['day', 'week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFilter(period)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    timeFilter === period
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {/* Display period revenue from backend */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
            <p className="text-sm text-blue-700 font-medium">
              {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Revenue:{" "}
              <span className="font-bold">{formatCurrency(dashboardData.period_revenue)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* USER PERMISSIONS BADGES - Show user capabilities */}
      {dashboardData.is_admin || dashboardData.is_editor ? (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Your Permissions:</p>
          <div className="flex flex-wrap gap-2">
            {dashboardData.can_access_all_invoices && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                <HiOutlineEye className="w-3 h-3 mr-1" />
                View All Invoices
              </span>
            )}
            {dashboardData.can_access_all_users && (
              <span className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                <HiOutlineUserGroup className="w-3 h-3 mr-1" />
                Manage Users
              </span>
            )}
            {dashboardData.has_invoice_permissions?.create && (
              <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                <HiOutlinePlusCircle className="w-3 h-3 mr-1" />
                Create Invoices
              </span>
            )}
            {dashboardData.has_invoice_permissions?.update && (
              <span className="inline-flex items-center px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
                <HiOutlinePencil className="w-3 h-3 mr-1" />
                Edit Invoices
              </span>
            )}
            {dashboardData.has_invoice_permissions?.delete && (
              <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-200">
                <HiOutlineTrash className="w-3 h-3 mr-1" />
                Delete Invoices
              </span>
            )}
            {dashboardData.has_invoice_permissions?.update_status && (
              <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
                <HiOutlineCheckCircle className="w-3 h-3 mr-1" />
                Update Status
              </span>
            )}
          </div>
        </div>
      ) : null}

      {/* MAIN STATISTICS CARDS - Shows key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardData.total_revenue)}
          icon={<HiOutlineCurrencyDollar className="w-6 h-6" />}
          trend={dashboardData.invoice_growth_percentage > 0 
            ? `+${dashboardData.invoice_growth_percentage.toFixed(1)}%` 
            : `${dashboardData.invoice_growth_percentage.toFixed(1)}%`}
          trendColor={dashboardData.invoice_growth_percentage > 0 ? "text-green-600" : "text-red-600"}
          color="from-blue-500 to-blue-600"
        />
        
        {/* Total Invoices Card */}
        <StatCard
          title="Total Invoices"
          value={dashboardData.invoice_count}
          icon={<HiOutlineDocumentText className="w-6 h-6" />}
          trend={dashboardData.invoice_growth_percentage > 0 
            ? `+${dashboardData.invoice_growth_percentage.toFixed(1)}%` 
            : `${dashboardData.invoice_growth_percentage.toFixed(1)}%`}
          trendColor={dashboardData.invoice_growth_percentage > 0 ? "text-green-600" : "text-red-600"}
          color="from-green-500 to-green-600"
        />
        
        {/* Total Users Card */}
        <StatCard
          title="Total Users"
          value={dashboardData.user_count}
          icon={<HiOutlineUsers className="w-6 h-6" />}
          trend={dashboardData.can_access_all_users ? "System Total" : "You"}
          trendColor="text-gray-600"
          color="from-purple-500 to-purple-600"
        />
        
        {/* Period Revenue Card */}
        <StatCard
          title={`${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Revenue`}
          value={formatCurrency(dashboardData.period_revenue)}
          icon={<HiOutlineTrendingUp className="w-6 h-6" />}
          trend="Period total"
          trendColor="text-blue-600"
          color="from-yellow-500 to-yellow-600"
        />
      </div>

      {/* INVOICE STATUS OVERVIEW - Shows counts for each status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Paid Invoices Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Paid Invoices</p>
              <p className="text-3xl font-bold mt-2">{dashboardData.paid_invoices}</p>
              {/* Show revenue from paid invoices - Note: status_id 2 is Paid */}
              {dashboardData.revenue_by_status && dashboardData.revenue_by_status[2] && (
                <p className="text-green-100 text-sm mt-1">
                  {formatCurrency(dashboardData.revenue_by_status[2])}
                </p>
              )}
            </div>
            <HiOutlineCheckCircle className="w-12 h-12 opacity-80" />
          </div>
        </div>
        
        {/* Pending Invoices Card */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Pending Invoices</p>
              <p className="text-3xl font-bold mt-2">{dashboardData.pending_invoices}</p>
              {/* Show revenue from pending invoices - Note: status_id 1 is Pending */}
              {dashboardData.revenue_by_status && dashboardData.revenue_by_status[1] && (
                <p className="text-yellow-100 text-sm mt-1">
                  {formatCurrency(dashboardData.revenue_by_status[1])}
                </p>
              )}
            </div>
            <HiOutlineClock className="w-12 h-12 opacity-80" />
          </div>
        </div>
        
        {/* Overdue Invoices Card */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Overdue Invoices</p>
              <p className="text-3xl font-bold mt-2">{dashboardData.overdue_invoices}</p>
              {/* Show revenue from overdue invoices - Note: status_id 3 is Overdue */}
              {dashboardData.revenue_by_status && dashboardData.revenue_by_status[3] && (
                <p className="text-red-100 text-sm mt-1">
                  {formatCurrency(dashboardData.revenue_by_status[3])}
                </p>
              )}
            </div>
            <HiOutlineExclamationCircle className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA - Recent invoices and side panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT INVOICES TABLE - Shows recent invoices based on permissions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {dashboardData.can_access_all_invoices ? "All Recent Invoices" : "My Recent Invoices"}
              </h2>
              {dashboardData.can_access_all_invoices && (
                <p className="text-sm text-gray-500 mt-1">Showing all system invoices</p>
              )}
            </div>
            <Link 
              to="/invoices" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
              <HiOutlineArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {dashboardData.recent_invoices.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineDocumentText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No invoices found</p>
              <p className="text-gray-400 mt-2">Create your first invoice to get started</p>
              {dashboardData.has_invoice_permissions?.create && (
                <Link
                  to="/new-invoice"
                  className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                >
                  + Create Invoice
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Invoice #
                    </th>
                    {dashboardData.can_access_all_invoices && (
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Created By
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.recent_invoices.slice(0, 8).map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          #{invoice.invoice_no || invoice.id}
                        </div>
                      </td>
                      {dashboardData.can_access_all_invoices && (
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{invoice.user_name}</div>
                          <div className="text-xs text-gray-500">ID: {invoice.user_id}</div>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{invoice.customer_name}</div>
                        <div className="text-xs text-gray-500">{invoice.customer_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(invoice.status_id)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(invoice.total)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-500">
                          {formatDate(invoice.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SIDEBAR SECTION - Quick actions and summary */}
        <div className="space-y-6">
          {/* QUICK ACTIONS PANEL */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {/* Create Invoice Action - Only show if user has permission */}
              {dashboardData.has_invoice_permissions?.create && (
                <Link
                  to="/new-invoice"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <HiOutlineDocumentText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Create Invoice</p>
                      <p className="text-sm text-gray-600">Generate new invoice</p>
                    </div>
                  </div>
                  <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
                </Link>
              )}
              
              {/* Manage Users Action - Only show if user has permission */}
              {dashboardData.can_access_all_users && (
                <Link
                  to="/users"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <HiOutlineUsers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Manage Users</p>
                      <p className="text-sm text-gray-600">View all users</p>
                    </div>
                  </div>
                  <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition" />
                </Link>
              )}

              {/* View All Invoices Action */}
              <Link
                to="/invoices"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl hover:from-green-100 hover:to-green-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <HiOutlineChartBar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">View All Invoices</p>
                    <p className="text-sm text-gray-600">
                      {dashboardData.can_access_all_invoices ? "Browse all invoices" : "View your invoices"}
                    </p>
                  </div>
                </div>
                <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition" />
              </Link>
            </div>
          </div>

          {/* STATS SUMMARY PANEL */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Invoice Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Paid Invoices</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-600">{dashboardData.paid_invoices}</span>
                  {dashboardData.revenue_by_status && dashboardData.revenue_by_status[2] && (
                    <span className="text-xs text-gray-500">
                      ({formatCurrency(dashboardData.revenue_by_status[2])})
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Invoices</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-yellow-600">{dashboardData.pending_invoices}</span>
                  {dashboardData.revenue_by_status && dashboardData.revenue_by_status[1] && (
                    <span className="text-xs text-gray-500">
                      ({formatCurrency(dashboardData.revenue_by_status[1])})
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Overdue Invoices</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-red-600">{dashboardData.overdue_invoices}</span>
                  {dashboardData.revenue_by_status && dashboardData.revenue_by_status[3] && (
                    <span className="text-xs text-gray-500">
                      ({formatCurrency(dashboardData.revenue_by_status[3])})
                    </span>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total Revenue</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.total_revenue)}
                  </span>
                </div>
              </div>

              {/* Display growth percentage if available */}
              {dashboardData.invoice_growth_percentage !== 0 && (
                <div className="pt-2">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    dashboardData.invoice_growth_percentage > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <HiOutlineTrendingUp className={`w-4 h-4 mr-1 ${
                      dashboardData.invoice_growth_percentage > 0 ? 'text-green-600' : 'text-red-600'
                    }`} />
                    {dashboardData.invoice_growth_percentage > 0 ? '+' : ''}
                    {dashboardData.invoice_growth_percentage.toFixed(1)}% growth
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TOP CUSTOMERS PANEL (if data available) */}
          {dashboardData.top_customers.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Customers</h2>
              <div className="space-y-4">
                {dashboardData.top_customers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {customer.customer_name?.charAt(0).toUpperCase() || "C"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.customer_name || "Unknown Customer"}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(customer.total_spent)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;