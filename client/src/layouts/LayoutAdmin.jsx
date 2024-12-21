import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../components/admin/SidebarAdmin';
import HeaderAdmin from '../components/admin/HeaderAdmin';

const LayoutAdmin = () => {
  return (
    <div className='flex h-screen'>
      <SidebarAdmin />
      <div className='flex-1 flex flex-col'>
        <HeaderAdmin />
        <main className='flex-1 p-6 bg-gray-200 overflow-y-auto'>
          <Outlet /> {/* ใช้เรนเดอร์เส้นทางย่อย */}
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
