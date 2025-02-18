import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import SidebarEmployee from '../components/employee/SidebarEmployee'
import HeaderEmp from '../components/employee/HeaderEmp'
import React, { useState } from 'react'; // ✅ เพิ่ม useState


const LayoutEmployee = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };
  
    const closeSidebar = () => {
      setSidebarOpen(false);
    };
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SidebarEmployee isOpen={sidebarOpen} closeSidebar={closeSidebar} />


      <div className="flex-1 flex flex-col">
        {/* Header (แสดงเฉพาะบนมือถือ) */}
        <div className="md:hidden">
        <HeaderEmp toggleSidebar={toggleSidebar} />

        </div>

        {/* Main Content */}
        <main className="flex-1 p-6  overflow-y-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default LayoutEmployee