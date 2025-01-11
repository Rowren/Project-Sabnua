import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/LogoSabnua.png'; // นำเข้ารูปภาพ
import useSabnuaStore from '../store/SabnuaStore';
import { FaHome, FaUtensils, FaShoppingCart, FaUserPlus, FaSignInAlt } from 'react-icons/fa'; // ไอคอนที่ใช้

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const carts = useSabnuaStore((s) => s.carts);

    return (
        <nav className="bg-red-600 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img
                            src={Logo}
                            alt="logo"
                            className="h-20 w-28"
                        />
                        <Link to="/" className="text-4xl font-bold text-yellow-400 hover:text-yellow-500">
                            แซ่บนัวครัวยินดี
                        </Link>
                    </div>

                    {/* Menu Links for Desktop */}
                    <div className="hidden md:flex items-center gap-8 text-lg font-medium">
                        <Link to="/" className="text-white hover:text-yellow-400 transition duration-300 flex items-center gap-2">
                            <FaHome className="text-xl" /> {/* ปรับขนาดไอคอน */}
                            หน้าแรก
                        </Link>
                        <Link to="/menu" className="text-white hover:text-yellow-400 transition duration-300 flex items-center gap-2">
                            <FaUtensils className="text-xl" /> {/* ปรับขนาดไอคอน */}
                            เมนู
                        </Link>
                        {/* Badge */}
                        <Link to="/cart" className="text-white hover:text-yellow-400 transition duration-300 flex items-center gap-2">
                            <FaShoppingCart className="text-xl" /> {/* ปรับขนาดไอคอน */}
                            รายการอาหาร
                        </Link>
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/register" className="text-white bg-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300 flex items-center gap-2">
                            <FaUserPlus className="text-xl" /> {/* ปรับขนาดไอคอน */}
                            สมัครสมาชิก
                        </Link>
                        <Link to="/login" className="text-white border border-white px-4 py-2 rounded-lg hover:bg-red-700 hover:text-yellow-400 transition duration-300 flex items-center gap-2">
                            <FaSignInAlt className="text-xl" /> {/* ปรับขนาดไอคอน */}
                            เข้าสู่ระบบ
                        </Link>
                    </div>

                    {/* Hamburger Menu for Mobile */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-3xl text-yellow-400">
                            {isMenuOpen ? 'X' : '☰'}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-red-600 py-4`}>
                    <div className="flex flex-col items-center gap-4">
                        <Link to="/" className="text-lg font-medium text-yellow-400 hover:text-yellow-500 transition duration-300 flex items-center gap-2">
                            <FaHome className="text-xl" /> {/* ปรับขนาดไอคอน */}
                            หน้าแรก
                        </Link>
                        <Link to="/menu" className="text-lg font-medium text-yellow-400 hover:text-yellow-500 transition duration-300 flex items-center gap-2">
                            <FaUtensils className="text-xl" /> {/* ปรับขนาดไอคอน */}
                            เมนู
                        </Link>
                        <Link to="/cart" className="text-lg font-medium text-yellow-400 hover:text-yellow-500 transition duration-300 flex items-center gap-2">
                            <FaShoppingCart className="text-xl" /> {/* ปรับขนาดไอคอน */}
                            รายการอาหาร
                        </Link>
                        <div className="flex flex-col items-center gap-4 mt-4">
                            <Link to="/register" className="text-white bg-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300 flex items-center gap-2">
                                <FaUserPlus className="text-xl" /> {/* ปรับขนาดไอคอน */}
                                สมัครสมาชิก
                            </Link>
                            <Link to="/login" className="text-white border border-white px-4 py-2 rounded-lg hover:bg-red-700 hover:text-yellow-400 transition duration-300 flex items-center gap-2">
                                <FaSignInAlt className="text-xl" /> {/* ปรับขนาดไอคอน */}
                                เข้าสู่ระบบ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
