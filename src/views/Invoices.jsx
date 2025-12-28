import React, { useEffect, useState } from "react";
import AxiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(1);

  const handleDelete = (id) => {
    AxiosClient.delete(`/invoice/${id}`)
      .then(() => {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      })
      .catch((err) => {
        console.error(err);
        alert("failed to delete invoice");
      });
  };

  useEffect(() => {
    // setLoading(true);
    AxiosClient.get(`/invoice?page=${currentPage}`)
      .then(({ data }) => {
        const invoicesPagination = data.invoices;

        setInvoices(invoicesPagination.data || []);
        setLastPage(invoicesPagination.last_page || 1);
        setPostPerPage(invoicesPagination.per_page || 10);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
            <p className="text-sm text-gray-500">
              Manage and track all your invoices
            </p>
          </div>

          <Link
            to="/new-invoice"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition shadow-sm"
          >
            + New Invoice
          </Link>
        </div>

        {/* Empty State */}
        {invoices.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <div className="text-4xl mb-3">📄</div>
            <h2 className="text-lg font-semibold text-gray-700">
              No invoices yet
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create your first invoice to get started
            </p>

            <Link
              to="/new-invoice"
              className="inline-block mt-5 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="p-4 text-left">Invoice #</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-right">Total</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {invoice.invoice_no}
                      </td>

                      <td className="p-4 text-gray-700">
                        {invoice.customer_name}
                      </td>

                      <td className="p-4 text-right font-semibold text-gray-800">
                        ${Number(invoice.total).toFixed(2)}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-4">
                          <Link
                            to={`/invoice/${invoice.id}`}
                            className="text-green-600 hover:underline font-medium"
                          >
                            View
                          </Link>

                          <Link
                            to={`/invoice/${invoice.id}/edit`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(invoice.id)}
                            className="text-red-600 hover:underline font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Pagination
        totalPosts={lastPage * postPerPage}
        postPerPage={postPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Invoices;
