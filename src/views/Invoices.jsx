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
import ShowInvoice from "./ShowInvoice";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(1);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [viewInvoiceId, setViewInvoiceId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const handleDelete = () => {
    if (!invoiceToDelete) return;

    AxiosClient.delete(`/invoice/${invoiceToDelete}`)
      .then(() => {
        setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceToDelete));
        setShowDeleteModal(false);
        setInvoiceToDelete(null);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete invoice");
      });
  };
  useEffect(() => {
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
                          <button
                            onClick={() => setViewInvoiceId(invoice.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-green-50 transition border-2 p-2"
                          >
                            <img
                              src={viewIcon}
                              alt="view"
                              className="w-4 h-4 object-contain"
                            />
                          </button>

                          <button
                            onClick={() => setEditingInvoiceId(invoice.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-50 transition border-2 p-2"
                          >
                            <img
                              src={editIcon}
                              alt="Edit"
                              className="w-4 h-4 object-contain"
                            />
                          </button>

                          <button
                            onClick={() => {
                              setInvoiceToDelete(invoice.id);
                              setShowDeleteModal(true);
                            }}
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 transition border-2 p-2"
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

      {viewInvoiceId && (
        <Modal onClose={() => setViewInvoiceId(null)}>
          <ShowInvoice
            invoiceId={viewInvoiceId}
            onClose={() => setViewInvoiceId(null)}
          />
        </Modal>
      )}

      {/* show delete modal  */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Confirm Delete
            </h2>

            <p className="mb-6">
              Are you sure you want to delete this invoice? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setInvoiceToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
