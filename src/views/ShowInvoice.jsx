import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosClient from "../axios-client";

const ShowInvoice = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AxiosClient.get(`/invoice/${id}`)
      .then(({ data }) => {
        setData(data);
        console.log(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // 🔴 IMPORTANT: Guard before rendering
  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Invoice not found</p>;

  const { invoice, subtotal, discount, tax, total } = data;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Invoice #{invoice.invoice_no}</h1>

      <p>
        <strong>Company:</strong> {invoice.company_name}
      </p>
      <p>
        <strong>Customer:</strong> {invoice.customer_name}
      </p>

      <table className="w-full mt-6 border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Item</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Price</th>
            <th className="p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td className="p-2">{item.item}</td>
              <td className="p-2 text-center">{item.quantity}</td>
              <td className="p-2 text-right">{item.price}</td>
              <td className="p-2 text-right">
                {(item.quantity * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mt-6 space-y-1">
        <p>Subtotal: {subtotal}</p>
        <p>Discount: {discount}</p>
        <p>Tax: {tax}</p>
        <p className="font-bold text-lg">Total: {total}</p>
      </div>
    </div>
  );
};

export default ShowInvoice;
