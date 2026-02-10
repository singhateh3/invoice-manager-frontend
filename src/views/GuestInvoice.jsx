import React, { useRef, useState } from "react";
import AxiosClient from "../axios-client";
import { HiOutlinePlus, HiOutlineTrash, HiOutlineDocumentText } from "react-icons/hi";

const GuestInvoice = () => {
  // Refs for form inputs
  const companyNameRef = useRef();
  const companyAddressRef = useRef();
  const companyEmailRef = useRef();
  const companyPhoneRef = useRef();
  const customerNameRef = useRef();
  const customerAddressRef = useRef();
  const customerEmailRef = useRef();
  const customerPhoneRef = useRef();
  const invoiceDateRef = useRef();
  const dueDateRef = useRef();
  const noteRef = useRef();
  const termsRef = useRef();

  // State management
  const [items, setItems] = useState([
    { item: "", description: "", quantity: 1, price: 0 },
  ]);
  const [errors, setErrors] = useState(null);
  const [taxRate, setTaxRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle item field changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = (field === "quantity" || field === "price") 
      ? Number(value) || 0 
      : value;
    setItems(newItems);
  };

  // Add new item row
  const addItem = () => {
    setItems([...items, { item: "", description: "", quantity: 1, price: 0 }]);
  };

  // Remove item row
  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculate totals
  const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subTotal * (taxRate / 100);
  const discount = subTotal * (discountRate / 100);
  const total = subTotal - discount + tax;

  // Form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const payload = {
      company_name: companyNameRef.current.value,
      company_address: companyAddressRef.current.value,
      company_email: companyEmailRef.current.value,
      company_phone: companyPhoneRef.current.value,
      customer_name: customerNameRef.current.value,
      customer_address: customerAddressRef.current.value,
      customer_email: customerEmailRef.current.value,
      customer_phone: customerPhoneRef.current.value,
      invoice_date: invoiceDateRef.current.value,
      due_date: dueDateRef.current.value,
      tax_rate: Number(taxRate),
      discount_rate: Number(discountRate),
      note: noteRef.current.value,
      terms: termsRef.current.value,
      items: items.filter(item => item.item.trim() !== ""),
      is_guest: true, // Add this flag for backend
    };

    try {
      // You might need a different endpoint for guest invoices
      await AxiosClient.post("/guest-invoices", payload);
      setSuccess(true);
      resetForm();
    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        setErrors(response.data.errors);
      } else {
        setErrors({ general: ["Something went wrong. Please try again."] });
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    if (companyNameRef.current) companyNameRef.current.value = '';
    if (companyAddressRef.current) companyAddressRef.current.value = '';
    if (companyEmailRef.current) companyEmailRef.current.value = '';
    if (companyPhoneRef.current) companyPhoneRef.current.value = '';
    if (customerNameRef.current) customerNameRef.current.value = '';
    if (customerAddressRef.current) customerAddressRef.current.value = '';
    if (customerEmailRef.current) customerEmailRef.current.value = '';
    if (customerPhoneRef.current) customerPhoneRef.current.value = '';
    if (noteRef.current) noteRef.current.value = '';
    if (termsRef.current) termsRef.current.value = '';
    
    setItems([{ item: "", description: "", quantity: 1, price: 0 }]);
    setTaxRate(0);
    setDiscountRate(0);
    setErrors(null);
  };

  // Set default dates
  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-4xl">
        {/* Guest Mode Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <HiOutlineDocumentText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quick Invoice Creator</h1>
              <p className="text-gray-600 text-sm mt-1">Create professional invoices instantly. No login required!</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 font-medium">
                  Invoice created successfully! You can create another one below.
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Need to save invoices? <a href="/signup" className="font-medium underline">Create a free account</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Form */}
        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Form Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <HiOutlineDocumentText className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">CREATE INVOICE</h2>
              </div>
              <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                Guest Mode
              </div>
            </div>

            {/* Error Display */}
            {errors && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    {errors.general ? (
                      <p className="text-sm text-red-700">{errors.general[0]}</p>
                    ) : (
                      <div className="text-sm text-red-700">
                        {Object.keys(errors).map((key) => (
                          <p key={key}>{errors[key][0]}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Meta Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date *
                  </label>
                  <input
                    ref={invoiceDateRef}
                    type="date"
                    required
                    defaultValue={today}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    ref={dueDateRef}
                    type="date"
                    required
                    defaultValue={nextWeek}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Company & Client Details */}
            <div className="mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Company Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    Your Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        ref={companyNameRef}
                        required
                        placeholder="Your Company Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        ref={companyAddressRef}
                        required
                        placeholder="Street, City, State, ZIP"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          ref={companyEmailRef}
                          type="email"
                          placeholder="billing@company.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          ref={companyPhoneRef}
                          type="tel"
                          placeholder="(123) 456-7890"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    Client Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Name *
                      </label>
                      <input
                        ref={customerNameRef}
                        required
                        placeholder="Client's Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        ref={customerAddressRef}
                        required
                        placeholder="Client's Address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          ref={customerEmailRef}
                          type="email"
                          placeholder="client@example.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          ref={customerPhoneRef}
                          type="tel"
                          placeholder="(123) 456-7890"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Unit Price ($)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Amount ($)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            value={item.item}
                            onChange={(e) => handleItemChange(index, "item", e.target.value)}
                            placeholder="Item name"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            value={item.description}
                            onChange={(e) => handleItemChange(index, "description", e.target.value)}
                            placeholder="Description"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, "price", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-gray-900">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                            className={`p-2 rounded-lg transition ${items.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                            title={items.length === 1 ? "Cannot remove the only item" : "Remove item"}
                          >
                            <HiOutlineTrash className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals & Notes */}
            <div className="mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Notes & Terms */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      ref={noteRef}
                      rows="4"
                      placeholder="Additional notes or instructions for the client..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Terms & Conditions (Optional)
                    </label>
                    <textarea
                      ref={termsRef}
                      rows="4"
                      placeholder="Payment terms, late fees, or other conditions..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Invoice Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-lg font-medium text-gray-900">${subTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-600">Discount</span>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={discountRate}
                            onChange={(e) => setDiscountRate(Number(e.target.value) || 0)}
                            className="w-20 px-3 py-1 border border-gray-300 rounded text-center"
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                      <span className="text-lg font-medium text-red-600">-${discount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-600">Tax</span>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={taxRate}
                            onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                            className="w-20 px-3 py-1 border border-gray-300 rounded text-center"
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                      <span className="text-lg font-medium text-gray-900">${tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-lg font-medium transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-md`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Invoice...
                  </div>
                ) : (
                  'Create Invoice'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Guest Mode Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4">
            <a 
              href="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Login
            </a>
            <span className="text-gray-400">|</span>
            <p className="text-gray-600 text-sm">
              Want to save invoices? <a href="/signup" className="text-blue-600 hover:underline font-medium">Create a free account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestInvoice;