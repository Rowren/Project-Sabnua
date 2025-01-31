import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaUsers, FaThLarge, FaList, FaShoppingCart, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import useSabnuaStore from '../../store/SabnuaStore';

const SidebarAdmin = ({ isOpen, closeSidebar }) => {
  const actionLogout = useSabnuaStore((s)=> s.actionLogout)
  return (
    <div
      className={`bg-red-600 w-64 min-h-screen flex flex-col text-white fixed md:relative ${isOpen ? 'block' : 'hidden'} md:block`}
    >
      {/* Header */}
      <div className="p-4 text-center text-2xl font-bold border-b border-red-500">
        <button onClick={closeSidebar} className="absolute top-4 right-4 text-white md:hidden">
          <FaTimes size={24} />
        </button>
        แซ่บนัวครัวยินดี
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-3">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive
              ? 'bg-red-700 rounded-md text-white p-4 hover:bg-red-800 flex items-center space-x-2'
              : 'text-gray-300 p-4 hover:bg-red-500 hover:text-white rounded flex items-center space-x-2'
          }
        >
          <FaChartBar size={24} />
          <span>รายงานยอดขาย</span>
        </NavLink>

        <NavLink
          to="manage"
          className={({ isActive }) =>
            isActive
              ? 'bg-red-700 rounded-md text-white p-4 hover:bg-red-800 flex items-center space-x-2'
              : 'text-gray-300 p-4 hover:bg-red-500 hover:text-white rounded flex items-center space-x-2'
          }
        >
          <FaUsers size={24} />
          <span>จัดการผู้ใช้งาน</span>
        </NavLink>

        <NavLink
          to="category"
          className={({ isActive }) =>
            isActive
              ? 'bg-red-700 rounded-md text-white p-4 hover:bg-red-800 flex items-center space-x-2'
              : 'text-gray-300 p-4 hover:bg-red-500 hover:text-white rounded flex items-center space-x-2'
          }
        >
          <FaThLarge size={24} />
          <span>ประเภทอาหาร</span>
        </NavLink>

        <NavLink
          to="product"
          className={({ isActive }) =>
            isActive
              ? 'bg-red-700 rounded-md text-white p-4 hover:bg-red-800 flex items-center space-x-2'
              : 'text-gray-300 p-4 hover:bg-red-500 hover:text-white rounded flex items-center space-x-2'
          }
        >
          <FaList size={24} />
          <span>รายการอาหาร</span>
        </NavLink>

        <NavLink
          to="orders"
          className={({ isActive }) =>
            isActive
              ? 'bg-red-700 rounded-md text-white p-4 hover:bg-red-800 flex items-center space-x-2'
              : 'text-gray-300 p-4 hover:bg-red-500 hover:text-white rounded flex items-center space-x-2'
          }
        >
          <FaShoppingCart size={24} />
          <span>จัดการรายการสั่งซื้อ</span>
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="p-4 bg-red-700">
        <button 
        onClick={()=>actionLogout()}
        className="w-full text-white flex items-center justify-center space-x-2 p-2 hover:bg-red-800 rounded">
          <FaSignOutAlt size={24} />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;
