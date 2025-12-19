import React, { useRef, useState } from "react";
import AxiosClient from "../axios-client";

const CreateInvoice = () => {
  // header refs
  const companyNameRef = useRef();
  const companyAddressRef = useRef();
  const customerNameRef = useRef();
  const customerAddressRef = useRef();
  const invoiceNumberRef = useRef();
  const invoiceDateRef = useRef();
  const dueDateRef = useRef();

  // invoice items
  const [items, setItems] = useState([
    { item: "", description: "", quantity: 1, price: 0 },
  ]);

  const [taxRate, setTaxRate] = useState(0);

  // item handlers
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    // check if the quantity and price are strings, if the are, change them to number else leave them like they are
    newItems[index][field] =
      field === "quantity" || field === "price" ? +value : value;
    setItems(newItems);
  };
  const addItem = () => {
    setItems([...items, { item: "", description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculate frontend UX
  const subTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const tax = subTotal * taxRate;
  const total = subTotal + tax;

  // Onsubmit

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      company_name: companyNameRef.current.value,
      company_address: companyAddressRef.current.value,
      customer_name: customerNameRef.current.value,
      customer_address: customerAddressRef.current.value,
      invoice_no: invoiceNumberRef.current.value,
      invoice_date: invoiceDateRef.current.value,
      due_date: dueDateRef.current.value,
      items,
    };

    AxiosClient.post("/invoice", payload)
      .then(({ data }) => console.log(data))
      .catch((err) => {
        if (err.response) {
          console.error("Validation errors:", err.response.data.errors);
        } else {
          console.log("STATUS:", err.response?.status);
          console.log("DATA:", err.response?.data);
          console.log("ERRORS:", err.response?.data?.errors);
        }
      });
  };
  return (
    <form
      action=""
      onSubmit={onSubmit}
      className="bg-gray-100 p-6 flex justify-center w-full min-h-screen ml-20"
    >
      <div className="bg-white w-full max-w-3xl shadow-md p-8 rounded-md">
        {/* Header */}
        <div className="flex justify-between">
          <div className="space-y-2">
            <input
              ref={companyNameRef}
              placeholder="Company Name"
              className="border px-2 py-1 rounded w-full"
            />
            <input
              ref={companyAddressRef}
              placeholder="Company Address"
              className="border px-2 py-1 rounded w-full"
            />
          </div>

          <div className="text-right space-y-2">
            <input
              type="number"
              ref={invoiceNumberRef}
              placeholder="Invoice #"
              className="border px-2 py-1 rounded"
            />
            <input
              ref={invoiceDateRef}
              type="date"
              className="border px-2 py-1 rounded"
            />
            <input
              ref={dueDateRef}
              type="date"
              className="border px-2 py-1 rounded"
            />
          </div>
        </div>
        {/* Bill To */}
        <div className="mt-6">
          <h2 className="font-semibold">Bill To</h2>
          <input
            ref={customerNameRef}
            placeholder="Customer Name"
            className="border px-2 py-1 rounded w-full mt-2"
          />
          <input
            ref={customerAddressRef}
            placeholder="Customer Address"
            className="border px-2 py-1 rounded w-full mt-2"
          />
        </div>

        {/* Items Table */}
        <div className="mt-8">
          <table className="w-full border text-sm">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="p-2">Item</th>
                <th className="p-2">Description</th>
                <th className="p-2 w-20">Qty</th>
                <th className="p-2 w-28">Price</th>
                <th className="p-2 w-28">Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="text-center">
                  <td>
                    <input
                      type="text"
                      onChange={(e) =>
                        handleItemChange(index, "item", e.target.value)
                      }
                      className=""
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="text-center"
                      type="number"
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="text-center"
                      type="number"
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                    />
                  </td>
                  <td>${item.quantity * item.price}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addItem}
            className="px-2 py-1 bg-green-400 rounded border-none mt-2"
          >
            + Add Item
          </button>
        </div>
        {/* Totals */}
        <div className="mt-6 w-64 ml-auto text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>
              Tax{" "}
              <input
                type="number"
                className="border-gray-500 border w-8 px-1 rounded"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />{" "}
              %
            </span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t mt-2 pt-2 text-green-700">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <button
          type="submit"
          className="mt-8 bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
        >
          Save Invoice
        </button>
      </div>
    </form>
  );
};

export default CreateInvoice;
