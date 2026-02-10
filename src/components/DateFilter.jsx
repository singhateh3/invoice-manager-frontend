import React, { useState } from "react";
import { HiOutlineCalendar } from "react-icons/hi";

const DateFilter = ({ dateRange, onDateRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFromDateChange = (e) => {
    const newDateRange = { ...dateRange, fromDate: e.target.value };
    onDateRangeChange(newDateRange);
  };

  const handleToDateChange = (e) => {
    const newDateRange = { ...dateRange, toDate: e.target.value };
    onDateRangeChange(newDateRange);
  };

  const clearDates = () => {
    onDateRangeChange({ fromDate: "", toDate: "" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <HiOutlineCalendar className="w-5 h-5 text-gray-400" />
          <span>
            {dateRange.fromDate || dateRange.toDate
              ? `${dateRange.fromDate || "Any"} - ${dateRange.toDate || "Any"}`
              : "Date Range"}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={dateRange.fromDate}
                onChange={handleFromDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                max={dateRange.toDate || undefined}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={dateRange.toDate}
                onChange={handleToDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min={dateRange.fromDate || undefined}
              />
            </div>

            {(dateRange.fromDate || dateRange.toDate) && (
              <button
                onClick={clearDates}
                className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;