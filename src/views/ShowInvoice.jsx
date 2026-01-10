import React, { useEffect, useRef, useState } from "react";
import AxiosClient from "../axios-client";
import Spinner from "../components/Spinner";
import { useReactToPrint } from "react-to-print";

const ShowInvoice = ({ invoiceId, onClose }) => {
  const id = invoiceId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  //   React to print
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    AxiosClient.get(`/invoice/${id}`)
      .then(({ data }) => {
        setData(data);
        console.log(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Guard before rendering
  if (loading) return <Spinner />;

  if (!data) return <p>Invoice not found</p>;

  const { invoice, subtotal, discount, tax, total } = data;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50">
      {/* Print Button */}
      <div className="text-right mb-4 flex justify-between">
        <button
          className="rounded px-4 py-1 bg-gray-600 text-white hover:bg-gray-500"
          onClick={reactToPrintFn}
        >
          Print
        </button>
        <button
          onClick={onClose}
          className="text-black text-xl px-2 py-1 bg-red-600"
        >
          ✕
        </button>
      </div>

      {/* Invoice Content */}
      <div
        ref={contentRef}
        className="bg-white border border-gray-300 shadow-sm"
      >
        {/* Header */}
        <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">INVOICE RECEIPT</h1>
          <div className="text-right text-sm">
            <p className="font-semibold">Receipt #{invoice.invoice_no}</p>
            <p>{invoice.invoice_date.split("T")[0]}</p>
          </div>
        </div>

        {/* Company / Customer */}
        <div className="px-6 py-4 flex justify-between text-sm">
          <div>
            <p className="font-semibold text-gray-700 mb-1 underline">
              Bill To:
            </p>
            <p>{invoice.customer_name}</p>
            <p>{invoice.customer_address}</p>
          </div>

          <div className="text-left">
            <p className="font-semibold text-gray-700 mb-1 underline">
              Company:
            </p>
            <p className="font-semibold text-gray-700 mb-1">
              {invoice.company_name}
            </p>
            <p className="font-semibold text-gray-700 mb-1">
              {invoice.customer_address}
            </p>
            <p>
              <strong>Due Date:</strong> {invoice.due_date.split("T")[0]}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-6">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 text-left">Item</th>

                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-center">Unit Price</th>
                <th className="p-2 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-t bg-blue-50">
                  <td className="p-2 border-l border-r">{item.item}</td>
                  <td className="p-2 border-l border-r">{item.description}</td>

                  <td className="p-2 text-center border-l border-r">
                    {item.quantity}
                  </td>
                  <td className="p-2 text-center border-l border-r">
                    ${item.price}
                  </td>
                  <td className="p-2 text-center border-l border-r">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 flex justify-end">
          <div className="w-64 text-sm">
            <div className="flex justify-between bg-blue-50 border-t">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between bg-blue-50 border-t">
              <span>Discount:</span>
              <span>${discount}</span>
            </div>
            <div className="flex justify-between bg-blue-50 border-t">
              <span>Tax:</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between bg-blue-600 text-white font-bold px-2 py-1 mt-2">
              <span>Grand Total:</span>
              <span>${total}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="px-6 pb-4 text-sm">
          <p className="font-semibold text-gray-700 mb-1">Notes:</p>
          <p className="border border-gray-300 p-2">{invoice.note}</p>
        </div>

        {/* Terms */}
        <div className="px-6 pb-6 text-sm">
          <p className="font-semibold text-gray-700 mb-1">
            Terms & Conditions:
          </p>
          <p className="border border-gray-300 p-2">{invoice.terms}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowInvoice;
