import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AxiosClient from "../axios-client";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const [stats, setStats] = useState({
    user_count: 0,
    invoice_count: 0,
    auth_user_invoices: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AxiosClient.get("/dashboard")
      .then(({ data }) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Total Users" value={stats.user_count} />
        <StatCard title="Total Invoices" value={stats.invoice_count} />
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">My Invoices</h2>

        {stats.auth_user_invoices.length === 0 ? (
          <p className="text-gray-500">No invoices found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-gray-600">
                <th className="py-2">Invoice #</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.auth_user_invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b last:border-0">
                  <td className="py-2">{invoice.id}</td>
                  <td>
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-600 text-xs">
                      {invoice.status}
                    </span>
                  </td>
                  <td>${invoice.total.toFixed(2)}</td>
                  <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
