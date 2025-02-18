import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import {
  FaHome,
  FaUtensils,
  FaShoppingCart,
  FaUserPlus,
  FaSignInAlt,
  FaAngleDown,
  FaUser,
} from "react-icons/fa";
import useSabnuaStore from "../store/SabnuaStore";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const user = useSabnuaStore((s) => s.user);
  const actionLogout = useSabnuaStore((s) => s.actionLogout);

  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-[#ffb205] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-3xl md:text-4xl font-bold text-yellow-900 hover:text-yellow-700 flex items-center"
            >
              <img src={Logo} alt="logo" className="h-16 w-40 object-contain" />
              แซ่บนัวครัวยินดี
            </Link>
          </div>

          {/* Menu Links for Desktop */}
          <div className="hidden md:flex items-center gap-6 text-lg font-medium">
            <Link
              to="/"
              className={`flex items-center gap-2 ${isActive("/") ? "text-yellow-700" : "text-white hover:text-yellow-700"} transition duration-300`}
            >
              <FaHome className="text-xl" />
              หน้าแรก
            </Link>
            <Link
              to="/menu"
              className={`flex items-center gap-2 ${isActive("/menu") ? "text-yellow-700" : "text-white hover:text-yellow-700"} transition duration-300`}
            >
              <FaUtensils className="text-xl" />
              เมนู
            </Link>
            <Link
              to="/cart"
              className={`flex items-center gap-2 ${isActive("/cart") ? "text-yellow-700" : "text-white hover:text-yellow-700"} transition duration-300`}
            >
              <FaShoppingCart className="text-xl" />
              รายการอาหาร
            </Link>
          </div>

          {/* Desktop User or Auth Links */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative flex items-center gap-4">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-yellow-300 p-2 rounded-md"
                >
                  <FaUser className="w-10 h-10 text-white bg-yellow-500 p-2 rounded-md" />
                  <FaAngleDown size={24} />
                </button>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute mt-2 top-full right-0 bg-white shadow-md rounded-md w-48"
                  >
                    <Link
                      to={`/user/update/${user.id}`}
                      className="block p-3 hover:bg-yellow-100"
                    >
                      แก้ไขข้อมูลส่วนตัว
                    </Link>
                    <Link
                      to="/user/history"
                      className="block p-3 hover:bg-yellow-100"
                    >
                      ประวัติการสั่งซื้อ
                    </Link>
                    <button
                      onClick={() => actionLogout()}
                      className="block w-full text-left p-3 hover:bg-yellow-100"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="text-white bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300 flex items-center gap-2"
                >
                  <FaUserPlus className="text-xl" />
                  สมัครสมาชิก
                </Link>
                <Link
                  to="/login"
                  className="text-white border border-white px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-red-500 transition duration-300 flex items-center gap-2"
                >
                  <FaSignInAlt className="text-xl" />
                  เข้าสู่ระบบ
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-3xl text-yellow-700">
              {isMenuOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#ffb205] py-6 px-4 transition-all duration-300 ease-in-out">
            <div className="flex flex-col items-start gap-6">
              <Link
                to="/"
                onClick={toggleMenu}
                className={`text-lg font-medium w-full ${isActive("/") ? "text-yellow-700" : "text-white hover:text-yellow-400"} flex items-center gap-4`}
              >
                <FaHome className="text-xl" />
                หน้าแรก
              </Link>
              <Link
                to="/menu"
                onClick={toggleMenu}
                className={`text-lg font-medium w-full ${isActive("/menu") ? "text-yellow-700" : "text-white hover:text-yellow-400"} flex items-center gap-4`}
              >
                <FaUtensils className="text-xl" />
                เมนู
              </Link>
              <Link
                to="/cart"
                onClick={toggleMenu}
                className={`text-lg font-medium w-full ${isActive("/cart") ? "text-yellow-700" : "text-white hover:text-yellow-400"} flex items-center gap-4`}
              >
                <FaShoppingCart className="text-xl" />
                รายการอาหาร
              </Link>

              {/* User Dropdown หรือ Auth Links */}
              <div className="w-full border-t border-yellow-300 pt-4">
                {user ? (
                  <>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex justify-between items-center w-full bg-yellow-500 px-4 py-2 rounded-lg text-white"
                    >
                      <div className="flex items-center gap-3">
                        <FaUser className="w-10 h-10 text-yellow-600 bg-white p-2 rounded-full" />
                        <span>บัญชีผู้ใช้</span>
                      </div>
                      <FaAngleDown />
                    </button>

                    {isDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className="bg-white shadow-md rounded-md mt-2"
                      >
                        <Link
                          to={`user/update/${user.id}`}
                          onClick={toggleMenu}
                          className="block p-3 hover:bg-yellow-100"
                        >
                          แก้ไขข้อมูลส่วนตัว
                        </Link>
                        <Link
                          to="/user/history"
                          onClick={toggleMenu}
                          className="block p-3 hover:bg-yellow-100"
                        >
                          ประวัติการสั่งซื้อ
                        </Link>
                        <button
                          onClick={() => {
                            actionLogout();
                            toggleMenu();
                          }}
                          className="block w-full text-left p-3 hover:bg-yellow-100"
                        >
                          ออกจากระบบ
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col gap-4 mt-4">
                    <Link
                      to="/register"
                      onClick={toggleMenu}
                      className="text-white bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300 flex items-center gap-2"
                    >
                      <FaUserPlus className="text-xl" />
                      สมัครสมาชิก
                    </Link>
                    <Link
                      to="/login"
                      onClick={toggleMenu}
                      className="text-white border border-white px-4 py-2 rounded-lg hover:bg-red-700 hover:text-yellow-400 transition duration-300 flex items-center gap-2"
                    >
                      <FaSignInAlt className="text-xl" />
                      เข้าสู่ระบบ
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
