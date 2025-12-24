import React, { useRef, useState } from "react";
import AxiosClient from "../axios-client";
import { Link, useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  // header refs
  const companyNameRef = useRef();
  const companyAddressRef = useRef();
  const customerNameRef = useRef();
  const customerAddressRef = useRef();
  // const invoiceNumberRef = useRef();
  const invoiceDateRef = useRef();
  const dueDateRef = useRef();

  // invoice items
  const [items, setItems] = useState([
    { item: "", description: "", quantity: 1, price: 0 },
  ]);

  const [taxRate, setTaxRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const navigate = useNavigate();

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

  const tax = subTotal * (taxRate / 100);
  const discount = subTotal * (discountRate / 100);
  const total = subTotal - discount + tax;

  // Onsubmit

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      company_name: companyNameRef.current.value,
      company_address: companyAddressRef.current.value,
      customer_name: customerNameRef.current.value,
      customer_address: customerAddressRef.current.value,
      invoice_date: invoiceDateRef.current.value,
      due_date: dueDateRef.current.value,
      tax_rate: Number(taxRate),
      discount_rate: Number(discountRate),

      items,
    };

    AxiosClient.post("/invoice", payload)
      .then(({ data }) => {
        console.log(data);
        const invoiceId = data.invoice.id;
        navigate(`/invoice/${invoiceId}`);
      })

      .catch((err) => {
        if (err.response) {
          console.error("Validation errors:", err.response.data.errors);
        } else {
          console.log("STATUS:", err.response?.status);
          console.log("DATA:", err.response?.data);
          console.log("ERRORS:", err.response?.data?.errors);
        }
      });

    // setItems([{ item: "", description: "", quantity: 1, price: 0 }]);
  };
  return (
    <>
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
                name="company_name"
                type="text"
                placeholder="Company Name"
                className="border px-2 py-1 rounded w-full mt-0"
              />
              <input
                ref={companyAddressRef}
                name="company_address"
                type="text"
                placeholder="Company Address"
                className="border px-2 py-1 rounded w-full"
              />
            </div>

            <div className="text-right space-y-2">
              <div>
                <label htmlFor="">Invoice Date:</label>
                <input
                  ref={invoiceDateRef}
                  name="invoice_date"
                  type="date"
                  className="border px-2 py-1 rounded"
                />
              </div>
              <div className="flex gap-5">
                <label htmlFor="">Due Date:</label>

                <input
                  ref={dueDateRef}
                  type="date"
                  name="due_date"
                  className="border px-2 py-1 rounded"
                />
              </div>
            </div>
          </div>
          {/* Bill To */}
          <div className="mt-6">
            <h2 className="font-semibold">Bill To</h2>
            <input
              ref={customerNameRef}
              type="text"
              name="customer_name"
              placeholder="Customer Name"
              className="border px-2 py-1 rounded w-full mt-2"
            />
            <input
              ref={customerAddressRef}
              type="text"
              name="customer_address"
              autoComplete="street-address"
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
                        name="item"
                        onChange={(e) =>
                          handleItemChange(index, "item", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="description"
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
          <div className="mt-6 w-64 ml-auto text-sm ">
            <div className="flex justify-between border-b">
              <span>Subtotal</span>
              <span>${subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex mb-1">
                Tax:{" "}
                <input
                  max={100}
                  min={0}
                  type="number"
                  className="border-gray-500 border w-10 px-1 rounded ml-10"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                />{" "}
                %
              </span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>
                Discount:{" "}
                <input
                  max={100}
                  min={0}
                  type="number"
                  className="border-gray-500 border w-10 px-1 rounded"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                />{" "}
                %
              </span>
              <span>${discount.toFixed(2)}</span>
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
    </>
  );
};

export default CreateInvoice;
