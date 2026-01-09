import React, { useEffect, useState } from "react";
import AxiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";
import StatusDropdown from "../components/StatusDropdown";
import Modal from "../components/Modal";
import EditInvoice from "./EditInvoice";
import editIcon from "../assets/images/pen.png";
import viewIcon from "../assets/images/eye.png";
import deleteIcon from "../assets/images/delete.png";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(1);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

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

  const fetchInvoices = () => {
    setLoading(true);

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
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentPage]);

  const handleStatusChange = (updatedInvoice) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
  };

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
          <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-800">
              No invoices yet
            </h2>
            <p className="text-gray-500 mt-2">
              Create your first invoice to get started
            </p>

            <Link
              to="/new-invoice"
              className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-shadow shadow-sm"
            >
              + Create Invoice
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-separate border-spacing-y-2">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="p-4 text-left">Invoice #</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-center">Total</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="bg-white border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {invoice.invoice_no}
                      </td>

                      <td className="p-4 text-gray-700">
                        {invoice.customer_name}
                      </td>

                      <td className="p-4 text-center font-semibold text-gray-800">
                        ${Number(invoice.total).toFixed(2)}
                      </td>

                      <td className="p-4 text-center">
                        {/* Status Dropdown with badge style */}
                        <StatusDropdown
                          invoice={invoice}
                          onStatusChange={handleStatusChange}
                        />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-4">
                          <Link
                            to={`/invoice/${invoice.id}`}
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-green-50 transition"
                          >
                            <img
                              src={viewIcon}
                              alt="view"
                              className="w-4 h-4 object-contain"
                            />
                          </Link>

                          <button
                            onClick={() => setEditingInvoiceId(invoice.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-50 transition"
                          >
                            <img
                              src={editIcon}
                              alt="Edit"
                              className="w-4 h-4 object-contain"
                            />
                          </button>

                          <button
                            onClick={() => handleDelete(invoice.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 transition"
                          >
                            <img
                              src={deleteIcon}
                              alt="delete"
                              className="w-4 h-4 object-contain"
                            />
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
      {editingInvoiceId && (
        <Modal onClose={() => setEditingInvoiceId(null)}>
          <EditInvoice
            invoiceId={editingInvoiceId}
            onClose={() => setEditingInvoiceId(null)}
            onUpdated={(updatedInvoice) =>
              setInvoices((prev) =>
                prev.map((inv) =>
                  inv.id === updatedInvoice.id ? updatedInvoice : inv
                )
              )
            }
          />
        </Modal>
      )}
    </div>
  );
};

export default Invoices;
