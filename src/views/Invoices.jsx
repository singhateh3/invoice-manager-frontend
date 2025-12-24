import React, { useEffect, useState } from "react";
import AxiosClient from "../axios-client";
import { Link } from "react-router-dom";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AxiosClient.get("/invoice")
      .then(({ data }) => {
        // If paginated
        setInvoices(data.data ?? data.invoices ?? []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading invoices...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>

        <Link
          to="/new-invoice"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
        >
          + New Invoice
        </Link>
      </div>

      {/* Empty state */}
      {invoices.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          No invoices found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Invoice #</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{invoice.invoice_no}</td>
                  <td className="p-3">{invoice.customer_name}</td>
                  <td className="p-3 text-right font-semibold">
                    ${Number(invoice.total).toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    <Link
                      to={`/invoice/${invoice.id}`}
                      className="text-green-600 font-medium hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Invoices;
