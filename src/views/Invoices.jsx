import React, { useEffect, useRef, useState } from "react";
import AxiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";
import StatusDropdown from "../components/StatusDropdown";
import Modal from "../components/Modal";
import EditInvoice from "./EditInvoice";
import ShowInvoice from "./ShowInvoice";
import { 
  HiOutlineEye, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineDocumentAdd, 
  HiOutlineDocument
} from "react-icons/hi";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const timeoutRef = useRef(null);
  
  // Simple search state
  const [search, setSearch] = useState("");
  
  // Modals
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [viewInvoiceId, setViewInvoiceId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  
  // Timeout for debounce
  const [timeoutId, setTimeoutId] = useState(null);

  // Fetch invoices function
  const fetchInvoices = (page = currentPage, searchTerm = search) => {
    setLoading(true);
    
    let url = `/invoices?page=${page}`;
    if (searchTerm.trim()) {
      url += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }
    
    AxiosClient.get(url)
      .then(({ data }) => {
        // Handle Laravel paginator response
        if (data.invoices && data.invoices.data) {
          setInvoices(data.invoices.data);
          setLastPage(data.invoices.last_page || 1);
          setPerPage(data.invoices.per_page || 10);
          setTotal(data.invoices.total || 0);
        } 
        // Fallback for other response formats
        else if (Array.isArray(data.invoices)) {
          setInvoices(data.invoices);
          setLastPage(1);
          setTotal(data.invoices.length);
        }
      })
      .catch((err) => {
        console.error("Error fetching invoices:", err);
      })
      .finally(() => setLoading(false));
  };

  // Handle search with debounce
  const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearch(value);

  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  timeoutRef.current = setTimeout(() => {
    setCurrentPage(1);
    fetchInvoices(1, value);
  }, 500);
};


  // Clear search
  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    fetchInvoices(1, "");
  };

  // Initial fetch
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Fetch when page changes
  useEffect(() => {
  fetchInvoices(currentPage, search);
}, [currentPage]);


  // Cleanup timeout
  useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);

  // Handle delete
  const handleDelete = () => {
    if (!invoiceToDelete) return;

    AxiosClient.delete(`/invoices/${invoiceToDelete}`)
      .then(() => {
        setInvoices(prev => prev.filter(inv => inv.id !== invoiceToDelete));
        setTotal(prev => prev - 1);
        setShowDeleteModal(false);
        setInvoiceToDelete(null);
        
        if (invoices.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchInvoices(currentPage); // Refresh current page
        }
      })
      .catch((err) => {
        console.error("Error deleting invoice:", err);
        alert("Failed to delete invoice");
      });
  };

  const handleStatusChange = (updatedInvoice) => {
    setInvoices(prevInvoices =>
      prevInvoices.map(invoice =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-2">
              {total} {total === 1 ? 'invoice' : 'invoices'} in total
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg 
                  className="w-5 h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by invoice #, customer, email..."
                value={search}
                onChange={handleSearchChange}
                className="w-full sm:w-72 pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-700"
                  title="Clear search"
                >
                  <svg 
                    className="w-5 h-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            <Link
              to="/new-invoice"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              <HiOutlineDocumentAdd className="w-5 h-5" />
              New Invoice
            </Link>
          </div>
        </div>

        {/* Show loading indicator when searching with existing data */}
        {loading && invoices.length > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center gap-2 text-blue-600">
              <Spinner size="sm" />
              <span>Loading...</span>
            </div>
          </div>
        )}

        {/* Search Results Info */}
        {search && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-blue-700 font-medium">
                  Search results for: "{search}"
                </span>
                <span className="text-blue-600">
                  ({invoices.length} {invoices.length === 1 ? 'result' : 'results'})
                </span>
              </div>
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {invoices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <HiOutlineDocument className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {search ? "No invoices found" : "No invoices yet"}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {search
                ? "Try searching with different terms"
                : "Create your first invoice to get started"}
            </p>
            {search ? (
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
              >
                View All Invoices
              </button>
            ) : (
              <Link
                to="/new-invoice"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
              >
                <HiOutlineDocumentAdd className="w-5 h-5" />
                Create First Invoice
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Invoices Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Customer Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr 
                        key={invoice.id} 
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{invoice.invoice_no}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {invoice.customer_name}
                            </div>
                            {invoice.customer_email && (
                              <div className="text-sm text-gray-500">
                                {invoice.customer_email}
                              </div>
                            )}
                            {invoice.customer_phone && (
                              <div className="text-sm text-gray-500">
                                {invoice.customer_phone}
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-semibold text-gray-900">
                            ${Number(invoice.total).toFixed(2)}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusDropdown
                            invoice={invoice}
                            onStatusChange={handleStatusChange}
                          />
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewInvoiceId(invoice.id)}
                              className="inline-flex items-center p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="View Invoice"
                            >
                              <HiOutlineEye className="w-5 h-5" />
                            </button>
                            
                            <button
                              onClick={() => setEditingInvoiceId(invoice.id)}
                              className="inline-flex items-center p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Invoice"
                            >
                              <HiOutlinePencil className="w-5 h-5" />
                            </button>
                            
                            <button
                              onClick={() => {
                                setInvoiceToDelete(invoice.id);
                                setShowDeleteModal(true);
                              }}
                              className="inline-flex items-center p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Invoice"
                            >
                              <HiOutlineTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <Pagination
                  totalPosts={total}
                  postPerPage={perPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={lastPage}
                />
              </div>
            )}
          </>
        )}

        {/* Modals remain the same */}
        {viewInvoiceId && (
          <Modal onClose={() => setViewInvoiceId(null)}>
            <ShowInvoice 
              invoiceId={viewInvoiceId} 
              onClose={() => setViewInvoiceId(null)} 
            />
          </Modal>
        )}

        {editingInvoiceId && (
          <Modal onClose={() => setEditingInvoiceId(null)}>
            <EditInvoice
              invoiceId={editingInvoiceId}
              onClose={() => setEditingInvoiceId(null)}
              onUpdated={(updatedInvoice) =>
                setInvoices((prev) =>
                  prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
                )
              }
            />
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <HiOutlineTrash className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Delete Invoice</h2>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="mb-8 text-gray-700">
                Are you sure you want to delete this invoice? This will permanently remove all invoice data.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setInvoiceToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:opacity-90 transition shadow-md"
                >
                  Delete Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;