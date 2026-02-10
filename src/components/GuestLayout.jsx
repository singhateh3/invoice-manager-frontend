import React from 'react';
import { Outlet } from 'react-router-dom';

const GuestLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Outlet />
    </div>
  );
};

export default GuestLayout;