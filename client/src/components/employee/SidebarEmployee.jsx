import React from "react";
import { NavLink, useNavigate } from "react-router-dom"; // ✅ เพิ่ม useNavigate
import {
  FaChartBar,
  FaUsers,
  FaThLarge,
  FaList,
  FaShoppingCart,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import useSabnuaStore from "../../store/SabnuaStore";

const SidebarEmployee = ({ isOpen, closeSidebar }) => {
  const actionLogout = useSabnuaStore((s) => s.actionLogout);
  const navigate = useNavigate(); // ✅ ใช้ useNavigate

  const handleLogout = () => {
    actionLogout();
    navigate("/"); // ✅ พอกด Logout ให้เปลี่ยนไปหน้าแรก
  };

  return (
    <div
      className={`bg-orange-500 w-64 min-h-screen flex flex-col text-white fixed top-0 left-0 z-50 shadow-lg transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative`}
    >
      {/* Header */}
      <div className="p-4 text-center text-2xl font-bold border-b border-orange-400 relative">
        <button
          onClick={closeSidebar}
          className="absolute top-3 right-4 text-white hover:text-gray-200 transition md:hidden"
        >
          <FaTimes size={24} />
        </button>
        แซ่บนัวครัวยินดี
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-3">
        <SidebarLink to="/employee" icon={<FaChartBar size={24} />} text="รายงานยอดขาย" />
        <SidebarLink to="manage" icon={<FaUsers size={24} />} text="จัดการผู้ใช้งาน" />
        <SidebarLink to="product" icon={<FaList size={24} />} text="รายการอาหาร" />
        <SidebarLink to="orders" icon={<FaShoppingCart size={24} />} text="จัดการรายการสั่งซื้อ" />
      </nav>

      {/* Footer */}
      <div className="p-4 bg-orange-600">
        <button
          onClick={handleLogout} // ✅ เปลี่ยนไปใช้ handleLogout
          className="w-full flex items-center justify-center space-x-2 p-3 text-lg font-semibold hover:bg-orange-700 rounded transition"
        >
          <FaSignOutAlt size={24} />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
};

// ✅ Component ย่อย SidebarLink
const SidebarLink = ({ to, icon, text }) => {
    return (
      <NavLink
        to={to}
        end // ✅ เพิ่ม end เพื่อให้ไม่ active ซ้อนกัน
        className={({ isActive }) =>
          `flex items-center space-x-2 p-4 rounded transition ${
            isActive ? "bg-orange-600 text-white" : "text-gray-200 hover:bg-orange-400 hover:text-white"
          }`
        }
      >
        {icon}
        <span>{text}</span>
      </NavLink>
    );
  };
  
export default SidebarEmployee;
