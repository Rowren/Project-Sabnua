import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart2, Users, Tag, UtensilsCrossed, LogOut } from 'lucide-react';

const SidebarAdmin = () => {
    return (
        <div className="bg-red-600 w-64 min-h-screen flex flex-col text-white">
            {/* Header */}
            <div className="p-4 text-center text-2xl font-bold border-b border-red-500">
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
                    <BarChart2 size={24} />
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
                    <Users size={24} />
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
                    <Tag size={24} />
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
                    <UtensilsCrossed size={24} />
                    <span>รายการอาหาร</span>
                </NavLink>
            </nav>

            {/* Footer */}
            <div className="p-4 bg-red-700">
                <button className="w-full text-white flex items-center justify-center space-x-2 p-2 hover:bg-red-800 rounded">
                    <LogOut size={24} />
                    <span>ออกจากระบบ</span>
                </button>
            </div>
        </div>
    );
};

export default SidebarAdmin;
