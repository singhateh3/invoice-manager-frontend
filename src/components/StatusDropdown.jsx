import { useEffect, useState } from "react";
import AxiosClient from "../axios-client";

const StatusDropdown = ({ invoice, refreshInvoices }) => {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    AxiosClient.get("/statuses").then(({ data }) => setStatuses(data));
  }, []);

  const handleChange = (e) => {
    const newStatus = e.target.value;
    AxiosClient.patch(`/invoices/${invoice.id}/status`, {
      status: newStatus,
    })
      .then(() => {
        refreshInvoices();
      })
      .catch(() => alert("Update failed"));
  };

  return (
    <select
      value={invoice.status?.name || ""}
      onChange={handleChange}
      className="px-3 py-1 rounded-lg border text-sm"
    >
      {statuses.map((status) => (
        <option key={status.id} value={status.name}>
          {status.name}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;
