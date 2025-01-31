import React, { useState } from 'react';
import SidebarAdmin from '../components/admin/SidebarAdmin';
import HeaderAdmin from '../components/admin/HeaderAdmin';
import { Outlet } from 'react-router-dom';

const LayoutAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);  // Corrected to setSidebarOpen
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SidebarAdmin isOpen={sidebarOpen} closeSidebar={closeSidebar} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderAdmin toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-200 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
