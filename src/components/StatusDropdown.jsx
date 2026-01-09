import { useEffect, useState } from "react";
import AxiosClient from "../axios-client";

const StatusDropdown = ({ invoice, onStatusChange }) => {
  const [statuses, setStatuses] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    AxiosClient.get("/statuses")
      .then(({ data }) => setStatuses(data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const newStatusName = e.target.value;

    setUpdating(true);

    AxiosClient.patch(`/invoices/${invoice.id}/status`, {
      status: newStatusName,
    })
      .then(({ data }) => {
        // send UPDATED invoice back to parent
        onStatusChange(data.invoice);
      })
      .catch(() => alert("Update failed"))
      .finally(() => setUpdating(false));
  };

  return (
    <select
      value={invoice.status?.name}
      onChange={handleChange}
      disabled={updating}
      className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50"
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
