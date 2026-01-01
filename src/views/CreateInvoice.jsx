import React, { useRef, useState } from "react";
import AxiosClient from "../axios-client";
import { Link, useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  // header refs
  const companyNameRef = useRef();
  const companyAddressRef = useRef();
  const customerNameRef = useRef();
  const customerAddressRef = useRef();
  const invoiceDateRef = useRef();
  const dueDateRef = useRef();
  const noteRef = useRef();
  const termsRef = useRef();

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
    console.log("Before:", items);
    setItems((prev) => [
      ...prev,
      { item: "", description: "", quantity: 1, price: 0 },
    ]);
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
      note: noteRef.current.value,
      terms: termsRef.current.value,

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
  };
  return (
    <form onSubmit={onSubmit} className="min-h-screen bg-gray-100 py-10">
      {/* Paper */}
      <div className="max-w-5xl mx-auto bg-white border shadow-sm">
        {/* Header Bar */}
        <div className="bg-blue-700 text-white px-6 py-4">
          <h1 className="text-2xl font-bold">CREATE INVOICE</h1>
        </div>

        {/* Invoice Meta */}
        <div className="grid grid-cols-2 gap-6 px-6 py-4 text-sm">
          <div className="flex items-center gap-4 px-2">
            <label className="block font-semibold w-32">Invoice Date:</label>
            <input
              className="input border-gray-300 border-2 w-full"
              placeholder=""
              type="date"
              value={new Date().toISOString().split("T")[0]}
              ref={invoiceDateRef}
            />
          </div>

          <div className="flex items-center gap-4 px-2">
            <label className="block font-semibold w-32">Due Date</label>
            <input
              ref={dueDateRef}
              type="date"
              className="input border-gray-300 border-2 w-full"
            />
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-6 px-6 py-4 border-t">
          {/* Your Details */}
          <div className="border-2 bg-gray-50">
            <h2 className="font-semibold mb-2 bg-gray-300 p-2">YOUR DETAILS</h2>
            <div className="flex items-center gap-4 px-2">
              <p className="w-40 text-sm font-medium">Company Name:</p>
              <input
                ref={companyNameRef}
                name="name"
                placeholder="Your Name"
                className="input mb-2 border-gray-300 border-2 w-full px-1"
              />
            </div>
            <div className="flex items-center gap-4 px-2">
              <p className="w-40 text-sm font-medium">Your Company:</p>
              <input
                ref={companyAddressRef}
                type="text"
                name="address"
                placeholder=" Company Address"
                className="input mb-2 border-gray-300 border-2 w-full px-1"
              />
            </div>
            <div className="flex items-center gap-4 px-2">
              <p className="w-40 text-sm font-medium">Company Email:</p>
              <input
                type="email"
                placeholder="Your Email"
                className="input border-gray-300 border-2 w-full mb-1 px-1"
              />
            </div>
          </div>

          {/* Client Details */}
          <div className="border-2 bg-gray-50">
            <h2 className="font-semibold mb-2 bg-gray-300 p-2">
              CLIENT DETAILS
            </h2>
            <div className="flex items-center gap-4 px-2">
              <p className="w-36 text-sm font-medium">Client Name:</p>
              <input
                ref={customerNameRef}
                placeholder="Your Name"
                className="input mb-2 border-gray-300 border-2 w-full px-1"
              />
            </div>
            <div className="flex items-center gap-4 px-2">
              <p className="w-36 text-sm font-medium">Client Address:</p>
              <input
                ref={customerAddressRef}
                placeholder="Your Company"
                className="input mb-2 border-gray-300 border-2 w-full px-1"
              />
            </div>
            <div className="flex items-center gap-4 px-2">
              <p className="w-36 text-sm font-medium">Client Email:</p>
              <input
                placeholder="Your Email"
                className="input border-gray-300 border-2 w-full mb-1 px-1"
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-6 py-4">
          <table className="w-full border text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-left">DESCRIPTION</th>
                <th className="p-2 w-20">QUANTITY</th>
                <th className="p-2 w-28">UNIT PRICE</th>
                <th className="p-2 w-28">AMOUNT</th>
                <th>#</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">
                    <input
                      className="table-input"
                      placeholder="Item "
                      onChange={(e) =>
                        handleItemChange(index, "item", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="table-input"
                      name="description"
                      placeholder="description "
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      name="quantity"
                      className="table-input text-center"
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="table-input text-center"
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 text-right">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                  <td className="text-center">
                    <button
                      className="bg-red-700 px-4 rounded text-white"
                      onClick={() => removeItem(index)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={addItem}
            className="mt-3 bg-blue-600 text-white px-4 py-1 rounded"
          >
            + Add Item
          </button>
        </div>

        {/* Notes & Totals */}
        <div className="grid grid-cols-2 gap-6 px-6 py-4">
          {/* Notes */}
          <div className="border-2">
            <h3 className="font-semibold mb-1 bg-gray-100">Notes</h3>
            <textarea
              ref={noteRef}
              name="note"
              max={100}
              placeholder="Additional notes here..."
              className="input h-28 w-full"
            />
          </div>

          {/* Totals */}
          <div className="border p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between ">
              <span className=" font-bold">
                Discount:{" "}
                <input
                  type="number"
                  max={100}
                  min={0}
                  className="border-2"
                  onChange={(e) => setDiscountRate(e.target.value)}
                />
              </span>
              <span>${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="">
                Tax:{" "}
                <input
                  type="number"
                  max={100}
                  min={0}
                  className="border-2"
                  onChange={(e) => setTaxRate(e.target.value)}
                />
              </span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between bg-blue-600 text-white font-bold px-2 py-1">
              <span>Grand Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="px-6 py-4">
          <h3 className="font-semibold mb-1 bg-gray-100">Terms & Conditions</h3>
          <textarea
            ref={termsRef}
            name="terms"
            max={150}
            placeholder="Terms and conditions here..."
            className="input h-24 w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 px-6 py-4 border-t">
          {/* <button type="button" className="border px-6 py-2 rounded">
            Save Draft
          </button> */}
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded"
          >
            Save Invoice
          </button>
        </div>
      </div>
    </form>
  );
};
export default CreateInvoice;
